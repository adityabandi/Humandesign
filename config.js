// Database configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
// See DATABASE_SETUP.md for detailed setup instructions
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // Replace 'your-project-id' with your actual project ID
    anon_key: 'your-anon-key-here' // Replace with your actual anon key from Supabase dashboard
};

// Example of real config (replace with your actual values):
// const SUPABASE_CONFIG = {
//     url: 'https://xyzabcdefghijk.supabase.co',
//     anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
// };

// Export configuration
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

// Database schema design:
// 
// users table:
// - id (uuid, primary key)
// - email (text, unique)
// - created_at (timestamp)
// - updated_at (timestamp)
//
// quiz_responses table:
// - id (uuid, primary key) 
// - user_id (uuid, foreign key to users.id)
// - quiz_id (text)
// - question_id (integer)
// - answer_value (integer, 1-5)
// - created_at (timestamp)
//
// quiz_results table:
// - id (uuid, primary key)
// - user_id (uuid, foreign key to users.id)
// - quiz_id (text)
// - type (text) - Generator, Manifestor, Projector, Reflector
// - authority (text) - Emotional, Sacral, Splenic, Self-Projected
// - profile (text) - 1/3, 1/4, etc.
// - centers (jsonb) - store center definitions
// - scores (jsonb) - store detailed scoring breakdown
// - summary (text) - generated summary
// - created_at (timestamp)
// - updated_at (timestamp)
//
// user_reports table:
// - id (uuid, primary key)
// - user_id (uuid, foreign key to users.id)
// - quiz_result_id (uuid, foreign key to quiz_results.id)
// - report_data (jsonb) - complete 40+ page report content
// - is_purchased (boolean)
// - purchase_date (timestamp)
// - created_at (timestamp)
// - updated_at (timestamp)