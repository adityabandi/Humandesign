// Database configuration for quiz response storage (no authentication required)
// IMPORTANT: Replace these with your actual Supabase project credentials
// See DATABASE_SETUP.md for detailed setup instructions
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // Replace 'your-project-id' with your actual project ID
    anon_key: 'your-anon-key-here' // Replace with your actual anon key from Supabase dashboard
};

// Configuration for anonymous quiz sessions
const QUIZ_CONFIG = {
    enableDatabase: false, // Set to true when Supabase is configured
    sessionExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    generateSessionId: () => {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Export configuration
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.QUIZ_CONFIG = QUIZ_CONFIG;

// Database schema design (updated for anonymous sessions):
// 
// quiz_sessions table:
// - id (uuid, primary key)
// - session_id (text, unique)
// - created_at (timestamp)
// - updated_at (timestamp)
// - expires_at (timestamp)
//
// quiz_responses table:
// - id (uuid, primary key) 
// - session_id (text, foreign key to quiz_sessions.session_id)
// - quiz_id (text)
// - question_id (integer)
// - answer_value (integer, 1-5)
// - created_at (timestamp)
//
// quiz_results table:
// - id (uuid, primary key)
// - session_id (text, foreign key to quiz_sessions.session_id)
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
// quiz_reports table:
// - id (uuid, primary key)
// - session_id (text, foreign key to quiz_sessions.session_id)
// - quiz_result_id (uuid, foreign key to quiz_results.id)
// - report_data (jsonb) - complete 40+ page report content
// - created_at (timestamp)
// - updated_at (timestamp)

// Configuration for Human Design Quiz Platform
window.QUIZ_CONFIG = {
    enableDatabase: false, // Set to true when Supabase is configured
    enableSheetDB: true,   // Enable SheetDB integration
    enableAnalytics: false, // Set to true when analytics are configured
    debugMode: false       // Set to true for development
};

// Supabase Configuration (replace with your actual values)
window.SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anon_key: 'your-anon-key-here'
};

// SheetDB Configuration (your actual URL is already set in sheetdb.js)
window.SHEETDB_CONFIG = {
    url: 'https://sheetdb.io/api/v1/wlp0w5nfo35g5',
    enabled: true
};

// Analytics Configuration (optional)
window.ANALYTICS_CONFIG = {
    google_analytics_id: 'GA_MEASUREMENT_ID', // Replace with your GA4 ID
    facebook_pixel_id: 'FB_PIXEL_ID',         // Replace with your Facebook Pixel ID
    enabled: false
};

console.log('✅ Human Design Quiz Configuration Loaded');
console.log('📊 SheetDB Integration: ENABLED');
console.log('🎯 Ready to collect quiz data!');