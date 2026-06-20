// ONE-TIME DATA RESET MIGRATION
if (!localStorage.getItem('predictr_reset_v6')) {
    localStorage.clear();
    localStorage.setItem('predictr_reset_v6', 'true');
}

// STATE MANAGEMENT
const BASE_SIMULATED_NOW = new Date("2026-06-12T18:07:04Z").getTime();
const PAGE_LOAD_TIME = Date.now();

function getSimulatedNow() {
    return new Date();
}

function isAdminUser(username) {
    if (!username) return false;
    const lower = username.toLowerCase();
    return lower === 'admin' || lower === 'asil' || lower === 'elaf';
}

function getSimulatedDateString(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function getVenueOffset(venue) {
    if (!venue) return -4;
    const v = venue.toLowerCase();

    if (v.includes("toronto") || v.includes("boston") || v.includes("new york") || v.includes("philadelphia") || v.includes("atlanta") || v.includes("miami")) {
        return -4;
    }

    if (v.includes("mexico city") || v.includes("monterrey") || v.includes("guadalajara") || v.includes("houston") || v.includes("dallas") || v.includes("kansas")) {
        return -5;
    }

    if (v.includes("seattle") || v.includes("san francisco") || v.includes("los angeles") || v.includes("vancouver")) {
        return -7;
    }

    return -4;
}

let appData = JSON.parse(localStorage.getItem('predictr_data')) || {
    accounts: {},
    currentUsername: null
};

let userState = {
    username: appData.currentUsername,
    predictions: appData.currentUsername ? (appData.accounts[appData.currentUsername]?.predictions || {}) : {},
    points: 0
};

// DOM ELEMENTS
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const matchContainer = document.getElementById('match-container');
const resultsContainer = document.getElementById('results-container');
const leaderboardBody = document.getElementById('leaderboard-body');
const exportBtn = document.getElementById('export-btn');
const authOverlay = document.getElementById('auth-overlay');
const authUsernameInput = document.getElementById('auth-username');
const authBtn = document.getElementById('auth-btn');
const userStatsDiv = document.getElementById('user-stats');
const cloudStatus = document.getElementById('cloud-status');
const displayName = document.getElementById('display-name');
const displayRank = document.getElementById('display-rank');
const navAdmin = document.getElementById('nav-admin');
const adminContainer = document.getElementById('admin-container');

// INITIALIZATION
async function init() {
    setupNavigation();

    // Connect to Cloud DB
    if (window.SUPABASE_CONFIG) {
        // Try to initialize global supabase variable from database.js
        window.supabaseInstance = initDatabase(window.SUPABASE_CONFIG.URL, window.SUPABASE_CONFIG.ANON_KEY);
        if (window.supabaseInstance && cloudStatus) {
            cloudStatus.innerHTML = '<span class="status-dot" style="background:#22c55e;"></span> Cloud Connected';
        }
    }

    if (window.SHOULD_RESET_CLOUD) {
        await resetCloudDatabase();
        window.SHOULD_RESET_CLOUD = false;
    }

    // Ensure currently logged in user is recorded in Supabase (handles database reset recovery)
    if (userState.username) {
        const corrected = await cloudGetCaseCorrectedUsername(userState.username);
        if (corrected !== userState.username) {
            userState.username = corrected;
            appData.currentUsername = corrected;
            userState.predictions = appData.accounts[corrected]?.predictions || {};
            saveData();
        }

        const cloudData = await cloudLoadUserData(userState.username);
        if (cloudData) {
            appData.accounts[userState.username] = cloudData;
            userState.predictions = cloudData.predictions;
            userState.points = cloudData.points;
            saveData();
        } else {
            await cloudSavePoints(userState.username, userState.points);
        }
    }

    checkUser();
    renderMatches();
    renderResults();
    updatePoints();
    renderLeaderboard();

    // Initialize countdowns immediately and tick every second
    updateCountdowns();
    setInterval(updateCountdowns, 1000);

    // Auto-refresh leaderboard every 30 seconds to show new players
    setInterval(renderLeaderboard, 30000);

    authBtn.onclick = () => {
        const val = authUsernameInput.value.trim();
        if (val) {
            login(val);
        } else {
            const error = document.getElementById('auth-error');
            error.style.display = 'block';
            authUsernameInput.classList.add('shake');
            setTimeout(() => authUsernameInput.classList.remove('shake'), 400);
        }
    };

    exportBtn.onclick = exportData;
}

async function login(username) {
    // Resolve exact database casing case-insensitively (e.g. asil -> Asil)
    const correctedUsername = await cloudGetCaseCorrectedUsername(username);

    appData.currentUsername = correctedUsername;

    // Try to load from cloud tables
    const cloudData = await cloudLoadUserData(correctedUsername);
    if (cloudData) {
        appData.accounts[correctedUsername] = cloudData;
    } else {
        if (!appData.accounts[correctedUsername]) {
            appData.accounts[correctedUsername] = { predictions: {}, points: 6 };
        }
        // Save new player to cloud database so they are recorded on join!
        await cloudSavePoints(correctedUsername, 6);
    }

    userState.username = correctedUsername;
    userState.predictions = appData.accounts[correctedUsername].predictions;
    userState.points = appData.accounts[correctedUsername].points || 0;

    saveData();
    checkUser();
    switchPage('matches');
    renderMatches();
    renderResults();
    updatePoints();
    renderLeaderboard();
}

async function switchPage(pageId) {
    if (pageId === 'admin') {
        if (isAdminUser(userState.username)) {
            // Allow accessing admin page
        } else {
            // Redirect non-admins to matches page
            pageId = 'matches';
        }
    }

    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    pages.forEach(p => {
        if (p.id === pageId) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });

    if (pageId === 'admin') {
        await renderAdminPage();
    } else if (pageId === 'leaderboard') {
        await renderLeaderboard();
    }
}

function logout() {
    appData.currentUsername = null;
    userState.username = null;
    userState.predictions = {};

    saveData();
    checkUser();
}

function saveData() {
    if (userState.username) {
        appData.accounts[userState.username].predictions = userState.predictions;
        appData.accounts[userState.username].points = userState.points;

        // Sync points to cloud specifically
        cloudSavePoints(userState.username, userState.points);
    }
    localStorage.setItem('predictr_data', JSON.stringify(appData));
}

function checkUser() {
    const isAdmin = isAdminUser(userState.username);
    if (navAdmin) {
        navAdmin.style.display = isAdmin ? '' : 'none';
    }

    if (userState.username) {
        authOverlay.style.display = 'none';
        displayName.innerText = userState.username;
        document.getElementById('profile-pts').innerText = userState.points;
        document.getElementById('profile-count').innerText = getVotedCountForAccount(userState.predictions);
    } else {
        authOverlay.style.display = 'flex';
        const profileCrown = document.getElementById('profile-crown');
        if (profileCrown) {
            profileCrown.style.display = 'none';
        }
    }
}

// NAVIGATION
function setupNavigation() {
    navLinks.forEach(link => {
        link.onclick = async () => {
            const pageId = link.getAttribute('data-page');
            const isActive = link.classList.contains('active');
            await switchPage(pageId);
            if (isActive) {
                const scrollHeight = document.documentElement.scrollHeight;
                if (window.scrollY > 200) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
                }
            }
        };
        link.ondblclick = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            if (window.scrollY > 200) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
            }
        };
    });
}

function renderMatches() {
    matchContainer.innerHTML = '';
    const upcomingMatches = matches.filter(m => m.result === null);

    if (upcomingMatches.length === 0) {
        matchContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">All matches finished! Check Results tab.</p>';
        return;
    }

    const now = getSimulatedNow();

    upcomingMatches.forEach(match => {
        const prediction = userState.predictions[match.id] || { home: '', away: '', outcome: '' };
        const isPast = match.result !== null;

        const offset = getVenueOffset(match.venue);
        const nowLocal = new Date(now.getTime() + offset * 60 * 60 * 1000);
        const todayStr = getSimulatedDateString(nowLocal);
        const isToday = match.date === todayStr;

        const tomorrowLocal = new Date(nowLocal.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowStr = getSimulatedDateString(tomorrowLocal);
        const isTomorrow = match.date === tomorrowStr;

        const matchTime = new Date(match.isoDate);
        const isStarted = now.getTime() >= matchTime.getTime();
        const isMatchOverrideLocked =
            ((match.id === 11 || match.id === 12 || match.id === 13) && now.getTime() < new Date("2026-06-14T00:00:00Z").getTime()) ||
            ((match.id === 14 || match.id === 15 || match.id === 16) && now.getTime() < new Date("2026-06-15T00:00:00Z").getTime());
        const isLocked = (!isToday && !isTomorrow) || isStarted || isPast || match.locked === true || isMatchOverrideLocked;

        const card = document.createElement('div');
        card.className = 'card match-card';

        let lockStatusHTML = '';
        if (isPast) {
            lockStatusHTML = `<div class="lock-status past">🔒 Closed (Match Finished)</div>`;
        } else if (isStarted) {
            lockStatusHTML = `<div class="lock-status past">🔒 Closed (Match Started)</div>`;
        } else if (match.locked === true) {
            lockStatusHTML = `<div class="lock-status locked">🔒 Closed for Predictions</div>`;
        } else if (isMatchOverrideLocked) {
            const lockDate = (match.id === 14 || match.id === 15 || match.id === 16) ? 'June 15' : 'June 14';
            lockStatusHTML = `<div class="lock-status locked">🔒 Locked until ${lockDate}</div>`;
        } else if (isToday || isTomorrow) {
            lockStatusHTML = `<div class="lock-status open">🟢 Open for Predictions</div>`;
        } else {
            lockStatusHTML = `<div class="lock-status locked">🔒 Locked until ${match.date}</div>`;
        }

        const kickoffDate = new Date(match.isoDate);
        const formattedTime = kickoffDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const formattedDate = kickoffDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        card.innerHTML = `
            <div class="match-info">Match ${match.id} • ${match.group} • ${formattedDate} ${formattedTime}</div>
            <div class="match-main">
                <div class="match-team-row home-row">
                    <div class="team-identity">
                        <img src="${match.home.flag}" class="team-flag" alt="${match.home.name}">
                        <span class="team-name">${match.home.name}</span>
                    </div>
                    <input type="number" min="0" class="score-input" data-match="${match.id}" data-team="home" value="${prediction.home}" ${isLocked ? 'disabled' : ''}>
                </div>
                <div class="match-separator">-</div>
                <div class="match-team-row away-row">
                    <input type="number" min="0" class="score-input" data-match="${match.id}" data-team="away" value="${prediction.away}" ${isLocked ? 'disabled' : ''}>
                    <div class="team-identity">
                        <img src="${match.away.flag}" class="team-flag" alt="${match.away.name}">
                        <span class="team-name">${match.away.name}</span>
                    </div>
                </div>
            </div>
            <div class="outcome-buttons">
                <span class="outcome-indicator ${prediction.outcome === 'home' ? 'active' : ''}" data-match="${match.id}" data-outcome="home">
                    ${match.home.name} Win
                </span>
                <span class="outcome-indicator ${prediction.outcome === 'draw' ? 'active' : ''}" data-match="${match.id}" data-outcome="draw">
                    Draw
                </span>
                <span class="outcome-indicator ${prediction.outcome === 'away' ? 'active' : ''}" data-match="${match.id}" data-outcome="away">
                    ${match.away.name} Win
                </span>
            </div>
            <div class="match-countdown" id="countdown-${match.id}" style="font-weight:700; color:var(--secondary); font-size:0.85rem; text-align:center; margin-top:8px; display:none;"></div>
            <div class="prediction-status" id="status-${match.id}">Prediction Saved!</div>
            ${lockStatusHTML}
        `;

        matchContainer.appendChild(card);
    });

    // Add listeners to inputs
    document.querySelectorAll('.score-input').forEach(input => {
        input.onchange = (e) => savePrediction(e);
    });
}

function renderResults() {
    resultsContainer.innerHTML = '';
    const playedMatches = matches.filter(m => m.result !== null);

    if (playedMatches.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No matches completed yet.</p>';
        return;
    }

    playedMatches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'card match-card';
        const kickoffDate = new Date(match.isoDate);
        const formattedTime = kickoffDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const formattedDate = kickoffDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        card.innerHTML = `
            <div class="match-info">Match ${match.id} • ${match.group} • ${formattedDate} ${formattedTime}</div>
            <div class="match-main">
                <div class="match-team-row home-row">
                    <div class="team-identity">
                        <img src="${match.home.flag}" class="team-flag" alt="${match.home.name}">
                        <span class="team-name">${match.home.name}</span>
                    </div>
                    <span class="score-input score-display">${match.result.home}</span>
                </div>
                <div class="match-separator">-</div>
                <div class="match-team-row away-row">
                    <span class="score-input score-display">${match.result.away}</span>
                    <div class="team-identity">
                        <img src="${match.away.flag}" class="team-flag" alt="${match.away.name}">
                        <span class="team-name">${match.away.name}</span>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

function exportData() {
    const playedMatches = matches.filter(m => m.result !== null);
    const exportContent = {
        exportedAt: new Date().toISOString(),
        totalMatchesPlayed: playedMatches.length,
        results: playedMatches.map(m => ({
            match: `${m.home.name} vs ${m.away.name}`,
            date: m.date,
            score: `${m.result.home} - ${m.result.away}`,
            winner: m.result.home > m.result.away ? m.home.name : (m.result.home < m.result.away ? m.away.name : "Draw")
        }))
    };

    const blob = new Blob([JSON.stringify(exportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worldcup_results_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function resetCloudDatabase() {
    if (!window.supabaseInstance) return;
    try {
        console.log("Attempting cloud database reset...");
        const { error: pError } = await window.supabaseInstance
            .from('predictions')
            .delete()
            .neq('username', '');

        const { error: sError } = await window.supabaseInstance
            .from('user_scores')
            .delete()
            .neq('username', '');

        if (pError || sError) {
            console.warn("Cloud database reset failed. Supabase policies may prevent bulk deletes from anonymous key.", pError, sError);
        } else {
            console.log("Cloud database reset successful.");
        }
    } catch (err) {
        console.error("Cloud database reset exception:", err);
    }
}

function checkUrgent(isoDate) {
    const matchTime = new Date(isoDate).getTime();
    const diff = matchTime - getSimulatedNow().getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

function updateCountdowns() {
    const now = getSimulatedNow();

    document.querySelectorAll('.match-card').forEach(card => {
        const input = card.querySelector('.score-input');
        if (!input) return;

        const matchId = parseInt(input.getAttribute('data-match'));
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        const matchTime = new Date(match.isoDate).getTime();
        const isPast = match.result !== null;

        const offset = getVenueOffset(match.venue);
        const nowLocal = new Date(now.getTime() + offset * 60 * 60 * 1000);
        const todayStr = getSimulatedDateString(nowLocal);
        const isToday = match.date === todayStr;

        const tomorrowLocal = new Date(nowLocal.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowStr = getSimulatedDateString(tomorrowLocal);
        const isTomorrow = match.date === tomorrowStr;

        const isStarted = now.getTime() >= matchTime;
        const isMatchOverrideLocked =
            ((match.id === 11 || match.id === 12 || match.id === 13) && now.getTime() < new Date("2026-06-14T00:00:00Z").getTime()) ||
            ((match.id === 14 || match.id === 15 || match.id === 16) && now.getTime() < new Date("2026-06-15T00:00:00Z").getTime());
        const isLocked = (!isToday && !isTomorrow) || isStarted || isPast || match.locked === true || isMatchOverrideLocked;

        card.querySelectorAll('.score-input').forEach(inp => {
            if (inp.disabled !== isLocked) {
                inp.disabled = isLocked;
            }
        });

        const lockStatusEl = card.querySelector('.lock-status');
        if (lockStatusEl) {
            let expectedText = '';
            let expectedClass = 'lock-status';

            if (isPast) {
                expectedText = `🔒 Closed (Match Finished)`;
                expectedClass = 'lock-status past';
            } else if (isStarted) {
                expectedText = `🔒 Closed (Match Started)`;
                expectedClass = 'lock-status past';
            } else if (match.locked === true) {
                expectedText = `🔒 Closed for Predictions`;
                expectedClass = 'lock-status locked';
            } else if (isMatchOverrideLocked) {
                const lockDate = (match.id === 14 || match.id === 15 || match.id === 16) ? 'June 15' : 'June 14';
                expectedText = `🔒 Locked until ${lockDate}`;
                expectedClass = 'lock-status locked';
            } else if (isToday || isTomorrow) {
                expectedText = `🟢 Open for Predictions`;
                expectedClass = 'lock-status open';
            } else {
                expectedText = `🔒 Locked until ${match.date}`;
                expectedClass = 'lock-status locked';
            }

            if (lockStatusEl.innerText !== expectedText) {
                lockStatusEl.innerText = expectedText;
                lockStatusEl.className = expectedClass;
            }
        }

        const countdownEl = card.querySelector('.match-countdown');
        if (countdownEl) {
            const diff = matchTime - now.getTime();
            if (diff > 0) {
                const totalSecs = Math.floor(diff / 1000);
                const hours = Math.floor(totalSecs / 3600);
                const minutes = Math.floor((totalSecs % 3600) / 60);
                const seconds = totalSecs % 60;

                const hStr = hours.toString().padStart(2, '0');
                const mStr = minutes.toString().padStart(2, '0');
                const sStr = seconds.toString().padStart(2, '0');
                const countdownStr = `⏳ Starts in ${hStr}h ${mStr}m ${sStr}s`;
                if (countdownEl.innerText !== countdownStr) {
                    countdownEl.innerText = countdownStr;
                }
                if (countdownEl.style.display !== 'block') {
                    countdownEl.style.display = 'block';
                }
            } else {
                if (countdownEl.innerText !== '') {
                    countdownEl.innerText = '';
                }
                if (countdownEl.style.display !== 'none') {
                    countdownEl.style.display = 'none';
                }
            }
        }


    });
}


function savePrediction(e) {
    const matchId = e.target.getAttribute('data-match');
    const team = e.target.getAttribute('data-team');
    let val = e.target.value;

    // Validation: Must be >= 0
    if (val !== '' && parseInt(val) < 0) {
        val = 0;
        e.target.value = 0;
    }

    if (!userState.predictions[matchId]) {
        userState.predictions[matchId] = { home: '', away: '', outcome: '' };
    }

    userState.predictions[matchId][team] = val;

    // Auto-calculate outcome choice based on scores
    const p = userState.predictions[matchId];
    if (p.home !== '' && p.away !== '' && p.home !== null && p.away !== null) {
        const h = parseInt(p.home);
        const a = parseInt(p.away);
        if (h > a) p.outcome = 'home';
        else if (h < a) p.outcome = 'away';
        else p.outcome = 'draw';
    } else {
        p.outcome = '';
    }

    saveData();

    // Sync prediction to cloud (deletes if any score is empty)
    if (userState.username) {
        const homeVal = (p.home === '' || p.home === null) ? null : parseInt(p.home);
        const awayVal = (p.away === '' || p.away === null) ? null : parseInt(p.away);
        cloudSavePrediction(userState.username, matchId, homeVal, awayVal);
    }

    // Instantly update indicators DOM styling
    updateIndicatorsForMatch(matchId, p.home, p.away);

    // Show status
    const status = document.getElementById(`status-${matchId}`);
    status.style.display = 'block';
    setTimeout(() => status.style.display = 'none', 2000);

    updatePoints();
    renderLeaderboard();
    checkUser();
}

function updateIndicatorsForMatch(matchId, homeVal, awayVal) {
    const homeIndicator = document.querySelector(`.outcome-indicator[data-match="${matchId}"][data-outcome="home"]`);
    const drawIndicator = document.querySelector(`.outcome-indicator[data-match="${matchId}"][data-outcome="draw"]`);
    const awayIndicator = document.querySelector(`.outcome-indicator[data-match="${matchId}"][data-outcome="away"]`);

    if (!homeIndicator || !drawIndicator || !awayIndicator) return;

    homeIndicator.classList.remove('active');
    drawIndicator.classList.remove('active');
    awayIndicator.classList.remove('active');

    if (homeVal !== '' && awayVal !== '' && homeVal !== null && awayVal !== null) {
        const h = parseInt(homeVal);
        const a = parseInt(awayVal);
        if (h > a) homeIndicator.classList.add('active');
        else if (h < a) awayIndicator.classList.add('active');
        else drawIndicator.classList.add('active');
    }
}

// POINTS CALCULATION
function calculateMatchPoints(pred, actual) {
    if (!pred || !actual) return 0;

    // Outcome must be selected to earn any points
    if (!pred.outcome) return 0;

    const aHome = parseInt(actual.home);
    const aAway = parseInt(actual.away);

    // Determine actual outcome
    let actualOutcome = 'draw';
    if (aHome > aAway) {
        actualOutcome = 'home';
    } else if (aHome < aAway) {
        actualOutcome = 'away';
    }

    // Did the player guess the outcome correctly?
    if (pred.outcome === actualOutcome) {
        // Did they also guess the exact score correctly?
        if (pred.home !== '' && pred.away !== '' &&
            parseInt(pred.home) === aHome && parseInt(pred.away) === aAway) {
            return 3; // Correct outcome AND exact score
        }
        return 1; // Correct outcome only
    }

    return 0; // Incorrect outcome
}

function updatePoints() {
    let total = 6;
    matches.forEach(match => {
        if (match.result) {
            total += calculateMatchPoints(userState.predictions[match.id], match.result);
        }
    });
    if (userState.points !== total) {
        userState.points = total;
        saveData();
    }
    // Ensure the profile page points UI is always updated with the correct value
    const profilePts = document.getElementById('profile-pts');
    if (profilePts) {
        profilePts.innerText = userState.points;
    }
}

function getPointsForAccount(predictions) {
    if (!predictions) return 6;
    let total = 6;
    matches.forEach(match => {
        if (match.result) {
            total += calculateMatchPoints(predictions[match.id], match.result);
        }
    });
    return total;
}

function getVotedCountForAccount(predictions) {
    if (!predictions) return 2;
    let count = 2;
    Object.keys(predictions).forEach(matchId => {
        const pred = predictions[matchId];
        if (pred && pred.home !== '' && pred.away !== '' && pred.home !== null && pred.away !== null) {
            count++;
        }
    });
    return count;
}

// LEADERBOARD
async function renderLeaderboard() {
    let combined = [];

    // 1. Gather all local registered player accounts
    Object.keys(appData.accounts).forEach(uname => {
        if (uname.toLowerCase() === 'admin') return;
        const acc = appData.accounts[uname];
        const pts = getPointsForAccount(acc.predictions || {});
        const voted = getVotedCountForAccount(acc.predictions || {});

        combined.push({
            name: uname === userState.username ? `${uname} (You)` : uname,
            pts: pts,
            voted: voted,
            icon: "👤",
            isUser: uname === userState.username
        });
    });

    // 2. Fetch cloud players and merge (avoid duplicates)
    const cloudPlayers = await cloudGetLeaderboard();
    if (cloudPlayers) {
        cloudPlayers.forEach(cp => {
            if (cp.name.toLowerCase() === 'admin') return;
            const exists = combined.some(p => p.name.replace(" (You)", "") === cp.name);
            if (!exists) {
                combined.push({
                    name: cp.name,
                    pts: cp.pts,
                    voted: cp.voted || 0,
                    icon: cp.icon || "👤",
                    isUser: cp.name === userState.username
                });
            }
        });
    }

    // 3. Fallback to mock players if absolutely nobody has signed up
    if (combined.length === 0 && mockLeaderboard) {
        mockLeaderboard.forEach(mp => {
            combined.push({
                name: mp.name,
                pts: mp.pts,
                voted: mp.voted || 0,
                icon: mp.icon || "👤",
                isUser: false
            });
        });
    }

    // Sort by points
    combined.sort((a, b) => b.pts - a.pts);

    // Determine if we have a sole leader with points > 0 (tie check)
    const hasPointsAwarded = combined.length > 0 && combined[0].pts > 0;
    const isTied = combined.length > 1 && combined[0].pts === combined[1].pts;
    const soleLeaderName = (hasPointsAwarded && !isTied) ? combined[0].name : null;

    leaderboardBody.innerHTML = '';

    if (combined.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No players yet. Sign up to be the first!</td></tr>';
        return;
    }

    combined.forEach((player, index) => {
        const row = document.createElement('tr');
        row.className = 'leaderboard-row';
        if (player.isUser) {
            row.style.background = 'rgba(34, 197, 94, 0.1)';
            if (displayRank) displayRank.innerText = `Rank: #${index + 1}`;
        }

        const hasCrown = soleLeaderName && player.name === soleLeaderName;

        row.innerHTML = `
            <td class="leaderboard-cell rank">#${index + 1}</td>
            <td class="leaderboard-cell">
                <div class="user-info">
                    <div class="avatar-container">
                        <div class="avatar" style="display: flex; align-items: center; justify-content: center; background: ${player.isUser ? 'var(--primary)' : '#334155'}">
                            ${player.icon}
                        </div>
                        ${hasCrown ? '<span class="crown-badge">👑</span>' : ''}
                    </div>
                    <span style="font-weight: ${player.isUser ? '700' : '400'}">${player.name}</span>
                </div>
            </td>
            <td class="leaderboard-cell" style="text-align: center;">${player.voted}</td>
            <td class="leaderboard-cell pts">${player.pts}</td>
        `;
        leaderboardBody.appendChild(row);
    });

    // Update profile page crown badge
    const profileCrown = document.getElementById('profile-crown');
    if (profileCrown) {
        const normalizedUser = userState.username;
        const normalizedLeader = soleLeaderName ? soleLeaderName.replace(" (You)", "") : null;
        if (normalizedUser && normalizedLeader && normalizedUser === normalizedLeader) {
            profileCrown.style.display = 'block';
        } else {
            profileCrown.style.display = 'none';
        }
    }
}

async function renderAdminPage() {
    if (!adminContainer) return;
    adminContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">Loading predictions...</p>';

    // Fetch all predictions from cloud
    let allPredictions = [];
    const cloudPredictions = await cloudGetAllPredictions();
    if (cloudPredictions) {
        allPredictions = cloudPredictions;
    }

    // Merge with local storage predictions to ensure completeness
    Object.keys(appData.accounts).forEach(username => {
        if (username.toLowerCase() === 'admin') return;
        const userPreds = appData.accounts[username].predictions || {};
        Object.keys(userPreds).forEach(matchId => {
            const p = userPreds[matchId];
            if (p && p.home !== '' && p.away !== '' && p.home !== null && p.away !== null) {
                const mId = parseInt(matchId);
                const exists = allPredictions.some(ap => ap.username === username && ap.match_id === mId);
                if (!exists) {
                    allPredictions.push({
                        username: username,
                        match_id: mId,
                        home_score: parseInt(p.home),
                        away_score: parseInt(p.away)
                    });
                }
            }
        });
    });

    const playedMatches = matches.filter(m => m.result !== null);

    if (playedMatches.length === 0) {
        adminContainer.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--text-muted);">No matches have been completed yet. Check back once results are recorded!</p>';
        return;
    }

    adminContainer.innerHTML = '';

    playedMatches.forEach(match => {
        const actualHome = parseInt(match.result.home);
        const actualAway = parseInt(match.result.away);

        let actualOutcome = 'draw';
        if (actualHome > actualAway) actualOutcome = 'home';
        else if (actualHome < actualAway) actualOutcome = 'away';

        // Filter and map correct predictions
        const correctPredictors = [];
        allPredictions.forEach(pred => {
            if (pred.match_id === match.id) {
                const predHome = parseInt(pred.home_score);
                const predAway = parseInt(pred.away_score);

                let predOutcome = 'draw';
                if (predHome > predAway) predOutcome = 'home';
                else if (predHome < predAway) predOutcome = 'away';

                if (predOutcome === actualOutcome) {
                    const exact = (predHome === actualHome && predAway === actualAway);
                    correctPredictors.push({
                        username: pred.username,
                        home: predHome,
                        away: predAway,
                        exact: exact
                    });
                }
            }
        });

        // Sort: Exact scores first, then by username
        correctPredictors.sort((a, b) => {
            if (a.exact !== b.exact) {
                return a.exact ? -1 : 1;
            }
            return a.username.localeCompare(b.username);
        });

        const section = document.createElement('div');
        section.className = 'admin-match-section card';

        const kickoffDate = new Date(match.isoDate);
        const formattedTime = kickoffDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const formattedDate = kickoffDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

        let predictorsHTML = '';
        if (correctPredictors.length === 0) {
            predictorsHTML = `<div class="admin-empty-state">No players predicted this match correctly.</div>`;
        } else {
            predictorsHTML = `<div class="admin-predictors-grid">`;
            correctPredictors.forEach(pred => {
                predictorsHTML += `
                    <div class="admin-predictor-card">
                        <div class="admin-predictor-user">
                            <div class="admin-predictor-avatar">👤</div>
                            <span class="admin-predictor-name">${pred.username}</span>
                        </div>
                        <div class="admin-predictor-info">
                            <span class="badge ${pred.exact ? 'badge-exact' : 'badge-outcome'}">
                                ${pred.exact ? 'Exact Score (+3)' : 'Outcome Only (+1)'}
                            </span>
                            <span class="admin-predictor-score">Predicted: ${pred.home} - ${pred.away}</span>
                        </div>
                    </div>
                `;
            });
            predictorsHTML += `</div>`;
        }

        section.innerHTML = `
            <div class="admin-match-header">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <img src="${match.home.flag}" style="width:24px; height:16px; border-radius:2px;" alt="${match.home.name}">
                    <span>${match.home.name}</span>
                    <span style="font-weight:800; color:var(--primary); font-size:1.1rem; padding:0 0.25rem;">
                        ${actualHome} - ${actualAway}
                    </span>
                    <span>${match.away.name}</span>
                    <img src="${match.away.flag}" style="width:24px; height:16px; border-radius:2px;" alt="${match.away.name}">
                </div>
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:400;">
                    Match ${match.id} • ${formattedDate}
                </div>
            </div>
            ${predictorsHTML}
        `;

        adminContainer.appendChild(section);
    });
}

init();
