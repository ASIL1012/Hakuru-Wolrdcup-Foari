// Standardizing cloud instance naming to fix access issues.
window.supabaseInstance = null;

function initDatabase(url, key) {
    if (typeof window.supabase === 'undefined') {
        console.warn("Supabase library not loaded. Falling back to LocalStorage.");
        return null;
    }
    if (!url || url === "YOUR_SUPABASE_URL") {
        console.warn("Supabase URL not set. Falling back to LocalStorage.");
        return null;
    }
    try {
        return window.supabase.createClient(url, key);
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        return null;
    }
}

// Global functions for the new Relational Schema
async function syncMatchesFromCloud() {
    if (!window.supabaseInstance) return null;
    const { data, error } = await window.supabaseInstance.from('matches').select('*');
    if (error) {
        console.error("Error fetching match data from cloud:", error);
        return null;
    }
    return data;
}

async function cloudSavePrediction(username, matchId, homeScore, awayScore) {
    if (!window.supabaseInstance) return false;
    
    if (homeScore === null || awayScore === null) {
        const { error } = await window.supabaseInstance
            .from('predictions')
            .delete()
            .eq('username', username)
            .eq('match_id', matchId);
        return !error;
    }
    
    const { error } = await window.supabaseInstance
        .from('predictions')
        .upsert({ 
            username: username, 
            match_id: matchId, 
            home_score: homeScore, 
            away_score: awayScore 
        }, { onConflict: 'username,match_id' });
    
    if (error) {
        console.error("Cloud Prediction Save Error:", error);
        return false;
    }
    return true;
}

async function cloudSavePoints(username, points) {
    if (!window.supabaseInstance) return false;
    const { error } = await window.supabaseInstance
        .from('user_scores')
        .upsert({ username: username, points: points });
    return !error;
}

async function cloudLoadUserData(username) {
    if (!window.supabaseInstance) return null;
    
    // Get points first to see if user exists
    const { data: score, error: sError } = await window.supabaseInstance
        .from('user_scores')
        .select('points')
        .eq('username', username)
        .single();
        
    if (sError) {
        if (sError.code === 'PGRST116') {
            // User does not exist in DB
            return { predictions: {}, points: 6, exists: false };
        }
        // Other error (e.g. network failure)
        console.error("Error loading user points:", sError);
        return null;
    }
    
    // Get predictions
    const { data: predictions, error: pError } = await window.supabaseInstance
        .from('predictions')
        .select('*')
        .eq('username', username);
        
    if (pError) {
        console.error("Error loading user predictions:", pError);
        return null;
    }
 
    // Format back to app state
    const formattedPredictions = {};
    predictions.forEach(p => {
        let inferredOutcome = '';
        let penaltyWinner = null;
        if (p.home_score !== null && p.away_score !== null && p.home_score !== '' && p.away_score !== '') {
            let h = parseInt(p.home_score);
            let a = parseInt(p.away_score);
            if (h >= 10000) {
                h -= 10000;
                inferredOutcome = 'home';
                penaltyWinner = 'home';
            } else if (a >= 10000) {
                a -= 10000;
                inferredOutcome = 'away';
                penaltyWinner = 'away';
            } else {
                if (h > a) inferredOutcome = 'home';
                else if (h < a) inferredOutcome = 'away';
                else inferredOutcome = 'draw';
            }
            formattedPredictions[p.match_id] = { 
                home: h, 
                away: a,
                outcome: inferredOutcome,
                penaltyWinner: penaltyWinner
            };
        }
    });
 
    return {
        predictions: formattedPredictions,
        points: score ? score.points : 6,
        exists: true
    };
}

async function cloudGetLeaderboard() {
    if (!window.supabaseInstance) return null;
    
    const { data, error } = await window.supabaseInstance
        .from('user_scores')
        .select('username, points')
        .order('points', { ascending: false });
        
    if (error) return null;

    // Fetch counts from predictions table to compute voted matches count (paginated)
    let predData = [];
    let from = 0;
    let to = 999;
    const limit = 1000;
    let predError = null;
    while (true) {
        const { data, error } = await window.supabaseInstance
            .from('predictions')
            .select('username, home_score, away_score')
            .range(from, to);
        if (error) {
            predError = error;
            console.error("Error fetching predictions for leaderboard:", error);
            break;
        }
        predData = predData.concat(data);
        if (data.length < limit) {
            break;
        }
        from += limit;
        to += limit;
    }

    const voteCounts = {};
    if (!predError && predData) {
        predData.forEach(p => {
            if (p.home_score !== null && p.away_score !== null && p.home_score !== '' && p.away_score !== '') {
                voteCounts[p.username] = (voteCounts[p.username] || 0) + 1;
            }
        });
    }
    
    return data.map(item => ({
        name: item.username,
        pts: item.points || 0,
        voted: (voteCounts[item.username] || 0) + 2,
        icon: "👤"
    }));
}

async function cloudGetAllPredictions() {
    if (!window.supabaseInstance) return null;
    let allData = [];
    let from = 0;
    let to = 999;
    const limit = 1000;
    while (true) {
        const { data, error } = await window.supabaseInstance
            .from('predictions')
            .select('*')
            .range(from, to);
        if (error) {
            console.error("Error fetching all predictions from cloud:", error);
            return null;
        }
        allData = allData.concat(data);
        if (data.length < limit) {
            break;
        }
        from += limit;
        to += limit;
    }
    return allData;
}

async function cloudGetCaseCorrectedUsername(username) {
    if (!window.supabaseInstance) return username;
    try {
        const { data, error } = await window.supabaseInstance
            .from('user_scores')
            .select('username')
            .ilike('username', username);
            
        if (!error && data && data.length > 0) {
            return data[0].username;
        }
    } catch (e) {
        console.error("Error fetching case-corrected username:", e);
    }
    return username;
}