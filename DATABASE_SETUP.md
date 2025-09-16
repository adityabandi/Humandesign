# Human Design Database Setup Guide

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
-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table extension (optional, if you need additional user fields)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_responses table
CREATE TABLE public.quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quiz_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  answer_value INTEGER NOT NULL CHECK (answer_value >= 1 AND answer_value <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id, question_id)
);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quiz_id TEXT NOT NULL,
  type TEXT NOT NULL,
  authority TEXT NOT NULL,
  profile TEXT NOT NULL,
  centers JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

-- Create user_reports table
CREATE TABLE public.user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quiz_result_id UUID REFERENCES public.quiz_results(id),
  report_data JSONB NOT NULL,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_quiz_responses_user_quiz ON public.quiz_responses(user_id, quiz_id);
CREATE INDEX idx_quiz_results_user_quiz ON public.quiz_results(user_id, quiz_id);
CREATE INDEX idx_user_reports_user ON public.user_reports(user_id);
CREATE INDEX idx_user_reports_purchased ON public.user_reports(is_purchased);

-- Set up Row Level Security policies
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_responses
CREATE POLICY "Users can insert their own quiz responses" 
  ON public.quiz_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz responses" 
  ON public.quiz_responses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz responses" 
  ON public.quiz_responses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policies for quiz_results
CREATE POLICY "Users can insert their own quiz results" 
  ON public.quiz_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz results" 
  ON public.quiz_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz results" 
  ON public.quiz_results FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policies for user_reports
CREATE POLICY "Users can insert their own reports" 
  ON public.user_reports FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports" 
  ON public.user_reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
  ON public.user_reports FOR UPDATE 
  USING (auth.uid() = user_id);
```

### Step 4: Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Enable email confirmations if desired
3. Configure any social auth providers if needed

### Step 5: Update Configuration
1. Update the `SUPABASE_CONFIG` object in `config.js`
2. Replace `your-project-id` with your actual project ID
3. Replace `your-anon-key-here` with your actual anon key

### Step 6: Test the Integration
1. Sign up for a new account through the website
2. Take the quiz while logged in
3. Check your Supabase dashboard to see the data being saved

## Features Enabled
- User authentication (sign up, sign in, sign out)
- Quiz response storage per user
- Personalized results calculation and storage
- 40+ page report generation
- Preview functionality
- Database-backed user sessions

## Security Notes
- All data is protected by Row Level Security (RLS)
- Users can only access their own data
- API keys are safe for client-side use (anon key only)
- All sensitive data requires authentication