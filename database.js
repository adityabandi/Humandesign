// Simplified Database service layer (no authentication required)
class DatabaseService {
    constructor() {
        this.supabase = null;
        this.sessionId = null;
        this.init();
    }

    async init() {
        // Initialize Supabase client
        if (typeof window !== 'undefined' && window.supabase) {
            this.supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anon_key
            );
        }
        
        // Get or create session ID
        this.sessionId = this.getOrCreateSessionId();
        
        // Initialize session in database if available
        if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
            this.initializeSession();
        }
    }

    getOrCreateSessionId() {
        // Check if we already have a session ID
        let sessionId = localStorage.getItem('quiz_session_id');
        
        if (!sessionId) {
            // Create new session ID
            sessionId = window.QUIZ_CONFIG.generateSessionId();
            localStorage.setItem('quiz_session_id', sessionId);
            localStorage.setItem('quiz_session_created', new Date().toISOString());
        }
        
        return sessionId;
    }

    async initializeSession() {
        try {
            // Create session record in database
            const expiresAt = new Date();
            expiresAt.setTime(expiresAt.getTime() + window.QUIZ_CONFIG.sessionExpiration);
            
            const { error } = await this.supabase
                .from('quiz_sessions')
                .upsert({
                    session_id: this.sessionId,
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error && !error.message.includes('duplicate')) {
                console.warn('Could not initialize session in database:', error);
            }
        } catch (error) {
            console.warn('Database session initialization failed:', error);
        }
    }

    // Quiz response methods (no authentication needed)
    async saveQuizResponse(quizId, questionId, answerValue) {
        // Always save to localStorage first
        const localResult = this.saveToLocalStorage(quizId, questionId, answerValue);
        
        // Try to save to database if available
        if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
            try {
                const { error } = await this.supabase
                    .from('quiz_responses')
                    .upsert({
                        session_id: this.sessionId,
                        quiz_id: quizId,
                        question_id: questionId,
                        answer_value: answerValue,
                        created_at: new Date().toISOString()
                    });

                if (error) {
                    console.warn('Database save failed, using localStorage:', error);
                    return localResult;
                }
                
                return { success: true, storage: 'database' };
            } catch (error) {
                console.warn('Database save error, using localStorage:', error);
                return localResult;
            }
        }
        
        return localResult;
    }

    saveToLocalStorage(quizId, questionId, answerValue) {
        try {
            const key = `quiz_responses_${quizId}`;
            const existing = JSON.parse(localStorage.getItem(key) || '{}');
            existing[questionId] = answerValue;
            localStorage.setItem(key, JSON.stringify(existing));
            return { success: true, storage: 'local' };
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return { success: false, error: error.message };
        }
    }

    async getQuizResponses(quizId) {
        // Try database first if available
        if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
            try {
                const { data, error } = await this.supabase
                    .from('quiz_responses')
                    .select('*')
                    .eq('session_id', this.sessionId)
                    .eq('quiz_id', quizId);

                if (!error && data && data.length > 0) {
                    // Convert array to object for easier access
                    const responses = {};
                    data.forEach(response => {
                        responses[response.question_id] = response.answer_value;
                    });
                    
                    return { success: true, data: responses, storage: 'database' };
                }
            } catch (error) {
                console.warn('Database fetch failed, using localStorage:', error);
            }
        }
        
        // Fallback to localStorage
        try {
            const key = `quiz_responses_${quizId}`;
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return { success: true, data, storage: 'local' };
        } catch (error) {
            return { success: false, error: 'No responses found' };
        }
    }

    async saveQuizResults(quizId, results) {
        // Always save to localStorage
        localStorage.setItem('quiz_results', JSON.stringify(results));
        
        // Try to save to database if available
        if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
            try {
                const { error } = await this.supabase
                    .from('quiz_results')
                    .upsert({
                        session_id: this.sessionId,
                        quiz_id: quizId,
                        type: results.type,
                        authority: results.authority,
                        profile: results.profile,
                        centers: results.centers || {},
                        scores: results.scores || {},
                        summary: results.summary || '',
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    console.warn('Database results save failed, using localStorage:', error);
                    return { success: true, storage: 'local' };
                }
                
                return { success: true, storage: 'database' };
            } catch (error) {
                console.warn('Database results save error:', error);
            }
        }
        
        return { success: true, storage: 'local' };
    }

    async getQuizResults(quizId) {
        // Try database first if available
        if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
            try {
                const { data, error } = await this.supabase
                    .from('quiz_results')
                    .select('*')
                    .eq('session_id', this.sessionId)
                    .eq('quiz_id', quizId)
                    .single();

                if (!error && data) {
                    return { success: true, data, storage: 'database' };
                }
            } catch (error) {
                console.warn('Database results fetch failed, using localStorage:', error);
            }
        }
        
        // Fallback to localStorage
        try {
            const data = JSON.parse(localStorage.getItem('quiz_results') || '{}');
            return { success: true, data, storage: 'local' };
        } catch (error) {
            return { success: false, error: 'No results found' };
        }
    }

    async generateFullReport(quizResultId) {
        try {
            // Get the quiz results
            const resultsResponse = await this.getQuizResults(quizResultId);
            if (!resultsResponse.success) {
                throw new Error('Quiz results not found');
            }
            
            const quizResult = resultsResponse.data;

            // Generate the comprehensive report
            const reportData = this.generateReportContent(quizResult);

            // Save the full report to database if available
            if (this.supabase && window.QUIZ_CONFIG.enableDatabase) {
                try {
                    const { error } = await this.supabase
                        .from('quiz_reports')
                        .upsert({
                            session_id: this.sessionId,
                            quiz_result_id: quizResultId,
                            report_data: reportData,
                            updated_at: new Date().toISOString()
                        });

                    if (error) {
                        console.warn('Report save to database failed:', error);
                    }
                } catch (error) {
                    console.warn('Report database save error:', error);
                }
            }
            
            return { success: true, data: reportData };
        } catch (error) {
            console.error('Error generating full report:', error);
            return { success: false, error: error.message };
        }
    }

    generateReportContent(quizResult) {
        // This method generates the 40+ page report content
        const reportGenerator = new ReportGenerator(quizResult);
        return reportGenerator.generateFullReport();
    }

    getCurrentSessionId() {
        return this.sessionId;
    }

    // Utility method to check if database is available
    isDatabaseAvailable() {
        return !!(this.supabase && window.QUIZ_CONFIG.enableDatabase);
    }

    // Clean up expired sessions (utility method)
    async cleanupExpiredSessions() {
        if (!this.isDatabaseAvailable()) return;
        
        try {
            const { error } = await this.supabase
                .from('quiz_sessions')
                .delete()
                .lt('expires_at', new Date().toISOString());

            if (error) {
                console.warn('Session cleanup failed:', error);
            }
        } catch (error) {
            console.warn('Session cleanup error:', error);
        }
    }
}

// Global database instance
window.database = new DatabaseService();