-- Drop existing tables to start fresh (drops predictions first due to foreign key dependency)
DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS user_scores;

-- Create user_scores table to store players and their points
CREATE TABLE user_scores (
    username TEXT PRIMARY KEY,
    points INTEGER DEFAULT 0 NOT NULL
);

-- Create predictions table to store scores predicted by players
CREATE TABLE predictions (
    username TEXT REFERENCES user_scores(username) ON DELETE CASCADE,
    match_id INTEGER NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    PRIMARY KEY (username, match_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for user_scores table (allow anyone using the API key to perform operations)
CREATE POLICY "Allow anonymous read on user_scores" ON user_scores FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on user_scores" ON user_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on user_scores" ON user_scores FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on user_scores" ON user_scores FOR DELETE USING (true);

-- Create RLS Policies for predictions table (allow anyone using the API key to perform operations)
CREATE POLICY "Allow anonymous read on predictions" ON predictions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on predictions" ON predictions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on predictions" ON predictions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on predictions" ON predictions FOR DELETE USING (true);