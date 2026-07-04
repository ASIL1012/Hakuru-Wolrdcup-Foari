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

let currentLeaderboardType = 'overall';

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
        if (userState.username.includes('||')) {
            userState.username = userState.username.split('||')[0];
            appData.currentUsername = userState.username;
            saveData();
        }
        const corrected = await cloudGetCaseCorrectedUsername(userState.username);
        if (corrected !== userState.username) {
            userState.username = corrected;
            appData.currentUsername = corrected;
            userState.predictions = appData.accounts[corrected]?.predictions || {};
            saveData();
        }

        const cloudData = await cloudLoadUserData(userState.username);
        if (cloudData) {
            if (cloudData.exists) {
                appData.accounts[userState.username] = cloudData;
                userState.predictions = cloudData.predictions;
                userState.points = cloudData.points;
                saveData();
            } else {
                await cloudSavePoints(userState.username, userState.points);
            }
        }
    }

    checkUser();
    renderMatches();
    renderResults();
    updatePoints();
    renderLeaderboard();

    const overallBtn = document.getElementById('leaderboard-overall-btn');
    const groupBtn = document.getElementById('leaderboard-group-btn');
    const r32Btn = document.getElementById('leaderboard-r32-btn');
    const r16Btn = document.getElementById('leaderboard-r16-btn');
    const qfBtn = document.getElementById('leaderboard-qf-btn');
    const finalsBtn = document.getElementById('leaderboard-finals-btn');
    const tableContainer = document.getElementById('leaderboard-table-container');
    const menuContainer = document.getElementById('leaderboard-menu');
    const backBtn = document.getElementById('leaderboard-back-btn');
    const boardTitle = document.getElementById('leaderboard-title');

    const setupBtn = (btn, label, type) => {
        if (btn && tableContainer && menuContainer) {
            btn.onclick = () => {
                menuContainer.style.display = 'none';
                tableContainer.style.display = 'block';
                if (boardTitle) boardTitle.innerText = label;
                renderLeaderboard(type);
            };
        }
    };

    setupBtn(overallBtn, "Overall Leaderboard", "overall");
    setupBtn(groupBtn, "Group Stage Leaderboard", "group");
    setupBtn(r32Btn, "Round of 32 Leaderboard", "r32");
    setupBtn(r16Btn, "Round of 16 Leaderboard", "r16");
    setupBtn(qfBtn, "Quarter Finals Leaderboard", "qf");
    setupBtn(finalsBtn, "Finals Leaderboard", "finals");

    if (backBtn && tableContainer && menuContainer) {
        backBtn.onclick = () => {
            menuContainer.style.display = 'flex';
            tableContainer.style.display = 'none';
            if (boardTitle) boardTitle.innerText = "Leaderboard";
        };
    }

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
    window.scrollTo(0, 0);
}

async function login(username) {
    let cleanUsername = username.trim();
    if (cleanUsername.includes('||')) {
        cleanUsername = cleanUsername.split('||')[0];
    }
    // Resolve exact database casing case-insensitively (e.g. asil -> Asil)
    const correctedUsername = await cloudGetCaseCorrectedUsername(cleanUsername);

    appData.currentUsername = correctedUsername;

    // Try to load from cloud tables
    const cloudData = await cloudLoadUserData(correctedUsername);
    if (cloudData === null) {
        // This is a network error! Do NOT overwrite or create a new user.
        const errorMsg = document.getElementById('auth-error');
        if (errorMsg) {
            errorMsg.innerText = "Connection error. Please check your internet and try again.";
            errorMsg.style.display = 'block';
        }
        return;
    }

    if (cloudData.exists) {
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
    let currentPageId = null;
    pages.forEach(p => {
        if (p.classList.contains('active')) {
            currentPageId = p.id;
        }
    });

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
        const menuContainer = document.getElementById('leaderboard-menu');
        const tableContainer = document.getElementById('leaderboard-table-container');
        const boardTitle = document.getElementById('leaderboard-title');
        if (menuContainer && tableContainer) {
            menuContainer.style.display = 'flex';
            tableContainer.style.display = 'none';
        }
        if (boardTitle) {
            boardTitle.innerText = "Leaderboard";
        }
        await renderLeaderboard();
    }

    if (currentPageId !== pageId) {
        window.scrollTo(0, 0);
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

        const matchTime = new Date(match.isoDate);
        const isStarted = now.getTime() >= matchTime.getTime();
        const isMatchOverrideLocked =
            ((match.id === 11 || match.id === 12 || match.id === 13) && now.getTime() < new Date("2026-06-14T00:00:00Z").getTime()) ||
            ((match.id === 14 || match.id === 15 || match.id === 16) && now.getTime() < new Date("2026-06-15T00:00:00Z").getTime());
        const timeUntilStart = matchTime.getTime() - now.getTime();
        const isOpen = !isPast && !isStarted && timeUntilStart > 0 && timeUntilStart <= 48 * 60 * 60 * 1000 && !isMatchOverrideLocked;
        const isLocked = !isOpen;

        const card = document.createElement('div');
        card.className = 'card match-card';

        let lockStatusHTML = '';
        if (isPast) {
            lockStatusHTML = `<div class="lock-status past">🔒 Closed (Match Finished)</div>`;
        } else if (isStarted) {
            lockStatusHTML = `<div class="lock-status past">🔒 Closed (Match Started)</div>`;
        } else if (isMatchOverrideLocked) {
            const lockDate = (match.id === 14 || match.id === 15 || match.id === 16) ? 'June 15' : 'June 14';
            lockStatusHTML = `<div class="lock-status locked">🔒 Locked until ${lockDate}</div>`;
        } else if (isOpen) {
            lockStatusHTML = `<div class="lock-status open">🟢 Open for Predictions</div>`;
        } else {
            lockStatusHTML = `<div class="lock-status locked">🔒 Locked (Opens 48h before kickoff)</div>`;
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
                <span class="outcome-indicator" data-match="${match.id}" data-outcome="home">
                    ${match.home.name} Win
                </span>
                <span class="outcome-indicator" data-match="${match.id}" data-outcome="draw">
                    Draw
                </span>
                <span class="outcome-indicator" data-match="${match.id}" data-outcome="away">
                    ${match.away.name} Win
                </span>
            </div>
            <div class="match-countdown" id="countdown-${match.id}" style="font-weight:700; color:var(--secondary); font-size:0.85rem; text-align:center; margin-top:8px; display:none;"></div>
            <div class="prediction-status" id="status-${match.id}">Prediction Saved!</div>
            ${isOpen ? `<button class="btn confirm-btn" data-match="${match.id}" style="width: 100%; margin-top: 0.5rem; margin-bottom: 0.5rem; background: var(--primary); font-weight: 600;">Confirm</button>` : ''}
            ${lockStatusHTML}
        `;

        matchContainer.appendChild(card);
        updateIndicatorsForMatch(match.id, prediction.home, prediction.away, prediction.penaltyWinner);
    });

    // Add listeners to inputs to update indicators dynamically as user types
    document.querySelectorAll('.score-input').forEach(input => {
        input.oninput = (e) => {
            const mId = parseInt(e.target.getAttribute('data-match'));
            const cardEl = e.target.closest('.match-card');
            if (cardEl) {
                const homeInput = cardEl.querySelector('.score-input[data-team="home"]');
                const awayInput = cardEl.querySelector('.score-input[data-team="away"]');
                if (homeInput && awayInput) {
                    const localPred = userState.predictions[mId] || {};
                    updateIndicatorsForMatch(mId, homeInput.value, awayInput.value, localPred.penaltyWinner);
                }
            }
        };
    });

    // Add click listeners to Confirm buttons to execute the save prediction pipeline
    document.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.onclick = (e) => {
            const mId = parseInt(e.target.getAttribute('data-match'));
            const cardEl = e.target.closest('.match-card');
            if (cardEl) {
                const homeInput = cardEl.querySelector('.score-input[data-team="home"]');
                const awayInput = cardEl.querySelector('.score-input[data-team="away"]');
                if (homeInput && awayInput) {
                    const homeVal = homeInput.value;
                    const awayVal = awayInput.value;

                    const match = matches.find(m => m.id === mId);
                    if (match && mId >= 73 && homeVal !== '' && awayVal !== '' && parseInt(homeVal) === parseInt(awayVal)) {
                        // It is a knockout match with a draw score! We must show the penalty shootout modal!
                        showPenaltyModal(mId, match, homeVal, awayVal);
                    } else {
                        // Normal save
                        savePrediction(mId, homeVal, awayVal, null);
                    }
                }
            }
        };
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

        let shootoutWinnerInfo = '';
        if (match.result.penaltyWinner) {
            const winnerName = match.result.penaltyWinner === 'home' ? match.home.name : match.away.name;
            shootoutWinnerInfo = `
                <div class="shootout-result-banner" style="
                    text-align: center;
                    font-size: 0.85rem;
                    color: var(--secondary);
                    margin-top: 10px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    background: rgba(251, 191, 36, 0.08);
                    border: 1px dashed rgba(251, 191, 36, 0.2);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-family: 'Outfit', sans-serif;
                ">
                    🎯 ${winnerName} won in penalties
                </div>
            `;
        }

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
            ${shootoutWinnerInfo}
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

        const isStarted = now.getTime() >= matchTime;
        const isMatchOverrideLocked =
            ((match.id === 11 || match.id === 12 || match.id === 13) && now.getTime() < new Date("2026-06-14T00:00:00Z").getTime()) ||
            ((match.id === 14 || match.id === 15 || match.id === 16) && now.getTime() < new Date("2026-06-15T00:00:00Z").getTime());
        const timeUntilStart = matchTime - now.getTime();
        const isOpen = !isPast && !isStarted && timeUntilStart > 0 && timeUntilStart <= 48 * 60 * 60 * 1000 && !isMatchOverrideLocked;
        const isLocked = !isOpen;

        card.querySelectorAll('.score-input').forEach(inp => {
            if (inp.disabled !== isLocked) {
                inp.disabled = isLocked;
            }
        });

        const confirmBtn = card.querySelector('.confirm-btn');
        if (confirmBtn) {
            const expectedDisplay = isOpen ? 'block' : 'none';
            if (confirmBtn.style.display !== expectedDisplay) {
                confirmBtn.style.display = expectedDisplay;
            }
        }

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
            } else if (isMatchOverrideLocked) {
                const lockDate = (match.id === 14 || match.id === 15 || match.id === 16) ? 'June 15' : 'June 14';
                expectedText = `🔒 Locked until ${lockDate}`;
                expectedClass = 'lock-status locked';
            } else if (isOpen) {
                expectedText = `🟢 Open for Predictions`;
                expectedClass = 'lock-status open';
            } else {
                expectedText = `🔒 Locked (Opens 48h before kickoff)`;
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


function savePrediction(matchId, homeVal, awayVal, penaltyWinner = null) {
    let home = homeVal;
    let away = awayVal;

    // Validation: Must be >= 0
    if (home !== '' && parseInt(home) < 0) {
        home = 0;
    }
    if (away !== '' && parseInt(away) < 0) {
        away = 0;
    }

    if (!userState.predictions[matchId]) {
        userState.predictions[matchId] = { home: '', away: '', outcome: '' };
    }

    userState.predictions[matchId].home = home;
    userState.predictions[matchId].away = away;
    userState.predictions[matchId].penaltyWinner = penaltyWinner;

    // Auto-calculate outcome choice based on scores or penalties
    const p = userState.predictions[matchId];
    if (p.home !== '' && p.away !== '' && p.home !== null && p.away !== null) {
        const h = parseInt(p.home);
        const a = parseInt(p.away);
        if (h > a) {
            p.outcome = 'home';
            p.penaltyWinner = null;
        } else if (h < a) {
            p.outcome = 'away';
            p.penaltyWinner = null;
        } else {
            // Draw in score. Outcome is the penalty winner!
            p.outcome = penaltyWinner || 'draw';
        }
    } else {
        p.outcome = '';
        p.penaltyWinner = null;
    }

    saveData();

    // Sync prediction to cloud (deletes if any score is empty)
    if (userState.username) {
        const hVal = (p.home === '' || p.home === null) ? null : parseInt(p.home);
        const aVal = (p.away === '' || p.away === null) ? null : parseInt(p.away);
        
        let encodedH = hVal;
        let encodedA = aVal;
        if (hVal !== null && aVal !== null && hVal === aVal && p.penaltyWinner) {
            if (p.penaltyWinner === 'home') encodedH += 10000;
            else if (p.penaltyWinner === 'away') encodedA += 10000;
        }
        
        cloudSavePrediction(userState.username, matchId, encodedH, encodedA);
    }

    // Instantly update indicators DOM styling
    updateIndicatorsForMatch(matchId, p.home, p.away, p.penaltyWinner);

    // Show status
    const status = document.getElementById(`status-${matchId}`);
    if (status) {
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 2000);
    }

    updatePoints();
    renderLeaderboard();
    checkUser();
}

function showPenaltyModal(matchId, match, homeVal, awayVal) {
    const modal = document.getElementById('penalty-modal');
    const homeOpt = document.getElementById('penalty-home-opt');
    const awayOpt = document.getElementById('penalty-away-opt');
    const homeFlag = document.getElementById('penalty-home-flag');
    const awayFlag = document.getElementById('penalty-away-flag');
    const homeName = document.getElementById('penalty-home-name');
    const awayName = document.getElementById('penalty-away-name');
    const confirmWinnerBtn = document.getElementById('penalty-confirm-btn');

    if (!modal || !homeOpt || !awayOpt || !homeFlag || !awayFlag || !homeName || !awayName || !confirmWinnerBtn) return;

    // Set flags and names
    homeFlag.src = match.home.flag;
    homeFlag.alt = match.home.name;
    homeName.innerText = match.home.name;

    awayFlag.src = match.away.flag;
    awayFlag.alt = match.away.name;
    awayName.innerText = match.away.name;

    // Reset styles
    homeOpt.style.borderColor = 'var(--border)';
    homeOpt.style.background = 'transparent';
    awayOpt.style.borderColor = 'var(--border)';
    awayOpt.style.background = 'transparent';
    confirmWinnerBtn.disabled = true;

    // Click outside handler
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
    const cardEl = modal.querySelector('.card');
    if (cardEl) {
        cardEl.onclick = (e) => e.stopPropagation();
    }

    let selectedWinner = null;

    homeOpt.onclick = () => {
        selectedWinner = 'home';
        homeOpt.style.borderColor = 'var(--primary)';
        homeOpt.style.background = 'rgba(34, 197, 94, 0.1)';
        awayOpt.style.borderColor = 'var(--border)';
        awayOpt.style.background = 'transparent';
        confirmWinnerBtn.disabled = false;
    };

    awayOpt.onclick = () => {
        selectedWinner = 'away';
        awayOpt.style.borderColor = 'var(--primary)';
        awayOpt.style.background = 'rgba(34, 197, 94, 0.1)';
        homeOpt.style.borderColor = 'var(--border)';
        homeOpt.style.background = 'transparent';
        confirmWinnerBtn.disabled = false;
    };

    confirmWinnerBtn.onclick = () => {
        modal.style.display = 'none';
        savePrediction(matchId, homeVal, awayVal, selectedWinner);
    };

    // Show modal
    modal.style.display = 'flex';
}

function updateIndicatorsForMatch(matchId, homeVal, awayVal, penaltyWinner = null) {
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
        if (h > a) {
            homeIndicator.classList.add('active');
        } else if (h < a) {
            awayIndicator.classList.add('active');
        } else {
            // Draw in score
            drawIndicator.classList.add('active');
            if (penaltyWinner === 'home') {
                homeIndicator.classList.add('active');
            } else if (penaltyWinner === 'away') {
                awayIndicator.classList.add('active');
            }
        }
    }
}

// POINTS CALCULATION
function calculateMatchPoints(pred, actual) {
    if (!pred || !actual) return 0;

    // We need both home and away scores in the prediction to earn points
    if (pred.home === '' || pred.away === '' || pred.home === null || pred.away === null) return 0;

    const pHome = parseInt(pred.home);
    const pAway = parseInt(pred.away);
    const aHome = parseInt(actual.home);
    const aAway = parseInt(actual.away);

    const pIsDraw = (pHome === pAway);
    const aIsDraw = (aHome === aAway);

    if (aIsDraw) {
        // Actual result is a draw (meaning there is a penalty shootout)
        const actualWinner = actual.penaltyWinner; // 'home' or 'away'
        const predWinner = pred.penaltyWinner; // 'home' or 'away'

        if (pIsDraw) {
            // Player predicted a draw score
            const exactScore = (pHome === aHome && pAway === aAway);
            const correctWinner = (predWinner === actualWinner);

            if (exactScore && correctWinner) {
                return 3;
            } else if (exactScore && !correctWinner) {
                return 2;
            } else if (!exactScore && correctWinner) {
                return 2;
            } else {
                return 1;
            }
        } else {
            // Player predicted a win for one team
            const pWinner = (pHome > pAway) ? 'home' : 'away';
            if (pWinner === actualWinner) {
                return 1;
            } else {
                return 0;
            }
        }
    } else {
        // Actual result is NOT a draw
        const pWinner = pIsDraw ? 'draw' : ((pHome > pAway) ? 'home' : 'away');
        const aWinner = (aHome > aAway) ? 'home' : 'away';

        if (pWinner === aWinner) {
            if (pHome === aHome && pAway === aAway) {
                return 3;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    }
}

function updatePoints() {
    const username = userState.username;
    let groupPts = 6;
    if (username) {
        const staticEntry = staticGroupLeaderboard.find(p => p.name.toLowerCase() === username.toLowerCase());
        if (staticEntry) {
            groupPts = staticEntry.pts;
        }
    }

    let total = groupPts;
    matches.forEach(match => {
        if (match.id >= 73 && match.result) {
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

function calculateScoreFromRawPredictions(rawPreds, boardType = 'overall') {
    let pts = 0;
    let voted = 0;

    if (boardType === 'overall') {
        const username = rawPreds.length > 0 ? rawPreds[0].username : null;
        let groupPts = 6;
        let groupVoted = 2;
        if (username) {
            const staticEntry = staticGroupLeaderboard.find(p => p.name.toLowerCase() === username.toLowerCase());
            if (staticEntry) {
                groupPts = staticEntry.pts;
                groupVoted = staticEntry.voted;
            }
        }
        pts = groupPts;
        voted = groupVoted;

        rawPreds.forEach(p => {
            const matchId = parseInt(p.match_id);
            if (matchId < 73) return;

            if (p.home_score !== null && p.away_score !== null && p.home_score !== '' && p.away_score !== '') {
                voted++;

                const match = matches.find(m => m.id === matchId);
                if (match && match.result) {
                    const pHomeRaw = parseInt(p.home_score);
                    const pAwayRaw = parseInt(p.away_score);
                    let pHome = pHomeRaw;
                    let pAway = pAwayRaw;
                    let pPenaltyWinner = null;

                    if (pHomeRaw >= 10000) {
                        pHome -= 10000;
                        pPenaltyWinner = 'home';
                    } else if (pAwayRaw >= 10000) {
                        pAway -= 10000;
                        pPenaltyWinner = 'away';
                    }

                    pts += calculateMatchPoints({
                        home: pHome,
                        away: pAway,
                        penaltyWinner: pPenaltyWinner
                    }, match.result);
                }
            }
        });
    } else {
        if (boardType === 'group') {
            pts = 6;
            voted = 2;
        }

        rawPreds.forEach(p => {
            const matchId = parseInt(p.match_id);
            if (boardType === 'group' && matchId > 72) return;
            if (boardType === 'r32' && (matchId < 73 || matchId > 88)) return;
            if (boardType === 'r16' && (matchId < 89 || matchId > 96)) return;
            if (boardType === 'qf' && (matchId < 97 || matchId > 100)) return;
            if (boardType === 'finals' && matchId < 101) return;

            if (p.home_score !== null && p.away_score !== null && p.home_score !== '' && p.away_score !== '') {
                voted++;

                const match = matches.find(m => m.id === matchId);
                if (match && match.result) {
                    const pHomeRaw = parseInt(p.home_score);
                    const pAwayRaw = parseInt(p.away_score);
                    let pHome = pHomeRaw;
                    let pAway = pAwayRaw;
                    let pPenaltyWinner = null;

                    if (pHomeRaw >= 10000) {
                        pHome -= 10000;
                        pPenaltyWinner = 'home';
                    } else if (pAwayRaw >= 10000) {
                        pAway -= 10000;
                        pPenaltyWinner = 'away';
                    }

                    pts += calculateMatchPoints({
                        home: pHome,
                        away: pAway,
                        penaltyWinner: pPenaltyWinner
                    }, match.result);
                }
            }
        });
    }

    return { pts, voted };
}

const staticGroupLeaderboard = [
  { "name": "Azkaan", "pts": 70, "voted": 71, "icon": "👤" },
  { "name": "Asil", "pts": 70, "voted": 70, "icon": "👤" },
  { "name": "IyaL", "pts": 65, "voted": 72, "icon": "👤" },
  { "name": "klsm", "pts": 64, "voted": 72, "icon": "👤" },
  { "name": "Faraa", "pts": 64, "voted": 70, "icon": "👤" },
  { "name": "zum", "pts": 61, "voted": 72, "icon": "👤" },
  { "name": "AliAshraf", "pts": 59, "voted": 72, "icon": "👤" },
  { "name": "Mohamed Ashraf", "pts": 59, "voted": 65, "icon": "👤" },
  { "name": "Elaf", "pts": 59, "voted": 72, "icon": "👤" },
  { "name": "Amsoodha", "pts": 59, "voted": 72, "icon": "👤" },
  { "name": "Humaid", "pts": 56, "voted": 67, "icon": "👤" },
  { "name": "Nasy", "pts": 55, "voted": 72, "icon": "👤" },
  { "name": "Inaa", "pts": 55, "voted": 72, "icon": "👤" },
  { "name": "Azka", "pts": 50, "voted": 70, "icon": "👤" },
  { "name": "Ikleel", "pts": 49, "voted": 68, "icon": "👤" },
  { "name": "Hameed", "pts": 46, "voted": 72, "icon": "👤" },
  { "name": "dhaitha", "pts": 45, "voted": 50, "icon": "👤" },
  { "name": "Ahmedshaheem", "pts": 44, "voted": 71, "icon": "👤" },
  { "name": "Shahuma", "pts": 44, "voted": 66, "icon": "👤" },
  { "name": "Thuhthahtha", "pts": 43, "voted": 72, "icon": "👤" },
  { "name": "Shafga", "pts": 42, "voted": 51, "icon": "👤" },
  { "name": "zaina", "pts": 38, "voted": 58, "icon": "👤" },
  { "name": "Yusuf", "pts": 34, "voted": 49, "icon": "👤" },
  { "name": "Mubeen", "pts": 32, "voted": 36, "icon": "👤" },
  { "name": "Raaidh", "pts": 25, "voted": 36, "icon": "👤" },
  { "name": "Fathun", "pts": 11, "voted": 17, "icon": "👤" },
  { "name": "Saadhu623", "pts": 8, "voted": 8, "icon": "👤" },
  { "name": "mal", "pts": 7, "voted": 4, "icon": "👤" },
  { "name": "Musthafa", "pts": 7, "voted": 3, "icon": "👤" },
  { "name": "a?/", "pts": 6, "voted": 2, "icon": "👤" },
  { "name": "Nunjaha", "pts": 6, "voted": 4, "icon": "👤" }
];

// LEADERBOARD
async function renderLeaderboard(type) {
    if (type) {
        currentLeaderboardType = type;
    }
    const isGroupStage = currentLeaderboardType === 'group';
    let combined = [];

    if (isGroupStage) {
        combined = staticGroupLeaderboard.map(player => ({
            name: player.name === userState.username ? `${player.name} (You)` : player.name,
            pts: player.pts,
            voted: player.voted,
            icon: player.icon || "👤",
            isUser: player.name === userState.username
        }));
    } else {
        // 1. Fetch cloud players and predictions if Supabase is connected
        let cloudUsers = null;
        let cloudPreds = [];
        if (window.supabaseInstance) {
            try {
                const { data: users, error: uError } = await window.supabaseInstance
                    .from('user_scores')
                    .select('username, points');
                if (!uError && users) {
                    cloudUsers = users;
                    const preds = await cloudGetAllPredictions();
                    if (preds) {
                        cloudPreds = preds;
                    }
                }
            } catch (e) {
                console.error("Cloud leaderboard fetch failed, falling back to local:", e);
            }
        }

        if (cloudUsers) {
            cloudUsers.forEach(cu => {
                if (cu.username.toLowerCase() === 'admin') return;

                const userPreds = cloudPreds.filter(p => p.username === cu.username);
                const { pts, voted } = calculateScoreFromRawPredictions(userPreds, currentLeaderboardType);

                combined.push({
                    name: cu.username === userState.username ? `${cu.username} (You)` : cu.username,
                    pts: pts,
                    voted: voted,
                    icon: "👤",
                    isUser: cu.username === userState.username
                });
            });
        } else {
            // Fallback to local accounts
            Object.keys(appData.accounts).forEach(uname => {
                if (uname.toLowerCase() === 'admin') return;
                const acc = appData.accounts[uname];

                const localPreds = Object.keys(acc.predictions || {}).map(mId => ({
                    match_id: mId,
                    home_score: acc.predictions[mId].home,
                    away_score: acc.predictions[mId].away
                }));
                const { pts, voted } = calculateScoreFromRawPredictions(localPreds, currentLeaderboardType);

                combined.push({
                    name: uname === userState.username ? `${uname} (You)` : uname,
                    pts: pts,
                    voted: voted,
                    icon: "👤",
                    isUser: uname === userState.username
                });
            });
        }
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

        // Filter and map correct predictions using calculateMatchPoints
        const correctPredictors = [];
        allPredictions.forEach(pred => {
            if (pred.match_id === match.id) {
                const predHomeRaw = parseInt(pred.home_score);
                const predAwayRaw = parseInt(pred.away_score);
                let predHome = predHomeRaw;
                let predAway = predAwayRaw;
                let predPenaltyWinner = null;

                if (predHomeRaw >= 10000) {
                    predHome -= 10000;
                    predPenaltyWinner = 'home';
                } else if (predAwayRaw >= 10000) {
                    predAway -= 10000;
                    predPenaltyWinner = 'away';
                }

                const pts = calculateMatchPoints({
                    home: predHome,
                    away: predAway,
                    penaltyWinner: predPenaltyWinner
                }, match.result);

                if (pts > 0) {
                    correctPredictors.push({
                        username: pred.username,
                        home: predHome,
                        away: predAway,
                        pts: pts
                    });
                }
            }
        });

        // Sort: highest points first, then by username
        correctPredictors.sort((a, b) => {
            if (a.pts !== b.pts) {
                return b.pts - a.pts;
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
                let badgeClass = 'badge-outcome';
                let badgeText = `Outcome Only (+${pred.pts})`;
                if (pred.pts === 3) {
                    badgeClass = 'badge-exact';
                    badgeText = 'Exact Score (+3)';
                } else if (pred.pts === 2) {
                    badgeClass = 'badge-exact';
                    badgeText = 'Correct Draw/Winner (+2)';
                }

                predictorsHTML += `
                    <div class="admin-predictor-card">
                        <div class="admin-predictor-user">
                            <div class="admin-predictor-avatar">👤</div>
                            <span class="admin-predictor-name">${pred.username}</span>
                        </div>
                        <div class="admin-predictor-info">
                            <span class="badge ${badgeClass}">
                                ${badgeText}
                            </span>
                            <span class="admin-predictor-score">Predicted: ${pred.home} - ${pred.away}</span>
                        </div>
                    </div>
                `;
            });
            predictorsHTML += `</div>`;
        }

        let shootoutText = '';
        if (match.result.penaltyWinner) {
            const winnerName = match.result.penaltyWinner === 'home' ? match.home.name : match.away.name;
            shootoutText = `<span style="font-size:0.8rem; color:var(--secondary); font-weight:600; margin-left:0.5rem;">(${winnerName} won in pens)</span>`;
        }

        section.innerHTML = `
            <div class="admin-match-header">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <img src="${match.home.flag}" style="width:24px; height:16px; border-radius:2px;" alt="${match.home.name}">
                        <span>${match.home.name}</span>
                        <span style="font-weight:800; color:var(--primary); font-size:1.1rem; padding:0 0.25rem;">
                            ${actualHome} - ${actualAway}
                        </span>
                        <span>${match.away.name}</span>
                        <img src="${match.away.flag}" style="width:24px; height:16px; border-radius:2px;" alt="${match.away.name}">
                    </div>
                    ${shootoutText}
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