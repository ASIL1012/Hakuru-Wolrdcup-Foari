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
    
    // Get predictions
    const { data: predictions, error: pError } = await window.supabaseInstance
        .from('predictions')
        .select('*')
        .eq('username', username);
    
    // Get points
    const { data: score, error: sError } = await window.supabaseInstance
        .from('user_scores')
        .select('points')
        .eq('username', username)
        .single();
    
    if (pError || sError) return null;

    // Format back to app state
    const formattedPredictions = {};
    predictions.forEach(p => {
        let inferredOutcome = '';
        if (p.home_score !== null && p.away_score !== null && p.home_score !== '' && p.away_score !== '') {
            const h = parseInt(p.home_score);
            const a = parseInt(p.away_score);
            if (h > a) inferredOutcome = 'home';
            else if (h < a) inferredOutcome = 'away';
            else inferredOutcome = 'draw';
        }
        formattedPredictions[p.match_id] = { 
            home: p.home_score, 
            away: p.away_score,
            outcome: inferredOutcome 
        };
    });

    return {
        predictions: formattedPredictions,
        points: score ? score.points : 0
    };
}

async function cloudGetLeaderboard() {
    if (!window.supabaseInstance) return null;
    
    const { data, error } = await window.supabaseInstance
        .from('user_scores')
        .select('username, points')
        .order('points', { ascending: false });
        
    if (error) return null;

    // Fetch counts from predictions table to compute voted matches count
    const { data: predData, error: predError } = await window.supabaseInstance
        .from('predictions')
        .select('username, home_score, away_score');

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
    const { data, error } = await window.supabaseInstance
        .from('predictions')
        .select('*');
    if (error) {
        console.error("Error fetching all predictions from cloud:", error);
        return null;
    }
    return data;
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
