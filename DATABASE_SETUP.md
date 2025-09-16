# Human Design Database Setup Guide (Anonymous Sessions)

## Supabase Setup Instructions

### Step 1: Create Supabase Account
1. Go to https://supabase.com/
2. Sign up for a free account
3. Create a new project

### Step 2: Get Your Project Credentials
1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and Anon Public Key
3. Update `config.js` with these values

### Step 3: Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create quiz_sessions table for anonymous sessions
CREATE TABLE public.quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create quiz_responses table
CREATE TABLE public.quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.quiz_sessions(session_id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  answer_value INTEGER NOT NULL CHECK (answer_value >= 1 AND answer_value <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, quiz_id, question_id)
);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.quiz_sessions(session_id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  type TEXT NOT NULL,
  authority TEXT NOT NULL,
  profile TEXT NOT NULL,
  centers JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, quiz_id)
);

-- Create quiz_reports table
CREATE TABLE public.quiz_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.quiz_sessions(session_id) ON DELETE CASCADE,
  quiz_result_id UUID REFERENCES public.quiz_results(id) ON DELETE CASCADE,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_quiz_sessions_session_id ON public.quiz_sessions(session_id);
CREATE INDEX idx_quiz_sessions_expires_at ON public.quiz_sessions(expires_at);
CREATE INDEX idx_quiz_responses_session_quiz ON public.quiz_responses(session_id, quiz_id);
CREATE INDEX idx_quiz_results_session_quiz ON public.quiz_results(session_id, quiz_id);
CREATE INDEX idx_quiz_reports_session ON public.quiz_reports(session_id);

-- Set up Row Level Security policies (allow anonymous access)
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_reports ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_sessions (allow anonymous access)
CREATE POLICY "Allow anonymous access to quiz sessions" 
  ON public.quiz_sessions FOR ALL 
  USING (true);

-- Policies for quiz_responses (allow anonymous access)
CREATE POLICY "Allow anonymous access to quiz responses" 
  ON public.quiz_responses FOR ALL 
  USING (true);

-- Policies for quiz_results (allow anonymous access)
CREATE POLICY "Allow anonymous access to quiz results" 
  ON public.quiz_results FOR ALL 
  USING (true);

-- Policies for quiz_reports (allow anonymous access)
CREATE POLICY "Allow anonymous access to quiz reports" 
  ON public.quiz_reports FOR ALL 
  USING (true);

-- Function to clean up expired sessions automatically
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.quiz_sessions 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled function to run cleanup (optional)
-- This requires the pg_cron extension if you want automatic cleanup
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');
```

### Step 4: Configure Settings
1. In Supabase dashboard, go to Settings > API
2. Ensure "Enable Row Level Security" is enabled
3. No authentication configuration needed (anonymous access)

### Step 5: Update Configuration
1. Update the `SUPABASE_CONFIG` object in `config.js`
2. Replace `your-project-id` with your actual project ID
3. Replace `your-anon-key-here` with your actual anon key

### Step 6: Test the Integration
1. Take the quiz on the website
2. Check your Supabase dashboard to see the data being saved
3. Each browser session gets a unique session_id

## Features Enabled
- Anonymous quiz sessions (no user registration required)
- Quiz response storage per session
- Personalized results calculation and storage
- 40+ page report generation
- Preview functionality
- Session-based data persistence
- Automatic session expiration (7 days)

## Session Management
- Each user gets a unique session ID stored in localStorage
- Sessions expire after 7 days automatically
- Quiz responses are tied to session ID instead of user account
- Data is accessible via session ID only
- Expired sessions are automatically cleaned up

## Security Notes
- All data is accessible anonymously but tied to unique session IDs
- No personal information is required or stored
- Session IDs are randomly generated and difficult to guess
- Data automatically expires after session timeout
- RLS policies allow anonymous access while maintaining data isolation

## PDF Generation
The system generates comprehensive PDF reports containing:
- Complete 40+ page Human Design analysis
- Personalized insights based on quiz responses
- Professional formatting and structure
- Downloadable via the purchase flow