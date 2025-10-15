-- ============================================
-- SUPABASE TABLE SETUP FOR HUMAN DESIGN QUIZ
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id BIGSERIAL PRIMARY KEY,
    result_id TEXT UNIQUE NOT NULL,

    -- User info
    name TEXT NOT NULL,
    email TEXT NOT NULL,

    -- Birth data
    birth_date TEXT,
    birth_time TEXT,
    birth_location TEXT,
    birth_timezone TEXT,
    latitude FLOAT,
    longitude FLOAT,

    -- Big 5 Personality Scores (0-100)
    openness INTEGER,
    conscientiousness INTEGER,
    extraversion INTEGER,
    agreeableness INTEGER,
    neuroticism INTEGER,

    -- Human Design
    hd_type TEXT,
    hd_authority TEXT,
    hd_profile TEXT,

    -- Full data as JSON
    full_data JSONB,

    -- Status
    report_status TEXT DEFAULT 'FREE_PREVIEW',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on result_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_quiz_results_result_id ON quiz_results(result_id);

-- Create index on email for user lookups
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(email);

-- Create index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- Enable Row Level Security
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for quiz submissions)
CREATE POLICY "Allow public insert" ON quiz_results
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to allow public read (for results page)
CREATE POLICY "Allow public read" ON quiz_results
    FOR SELECT
    TO anon
    USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_quiz_results_updated_at ON quiz_results;
CREATE TRIGGER update_quiz_results_updated_at
    BEFORE UPDATE ON quiz_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Supabase table setup complete! 🎉' AS message;
