// Database service layer
class DatabaseService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Initialize Supabase client
        if (typeof window !== 'undefined' && window.supabase) {
            this.supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anon_key
            );
            
            // Check if user is already logged in
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;
            
            // Listen for auth changes
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                this.handleAuthStateChange(event, session);
            });
        }
    }

    handleAuthStateChange(event, session) {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user);
            this.onUserSignedIn(session.user);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            this.onUserSignedOut();
        }
    }

    onUserSignedIn(user) {
        // Update UI to show user is logged in
        this.updateAuthUI(true, user);
        
        // If we're on the quiz page, we can now save responses
        if (window.location.pathname.includes('quiz')) {
            this.enableQuizSaving();
        }
    }

    onUserSignedOut() {
        // Update UI to show user is logged out
        this.updateAuthUI(false);
    }

    updateAuthUI(isSignedIn, user = null) {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;

        if (isSignedIn && user) {
            authContainer.innerHTML = `
                <div class="user-info">
                    <span>Welcome, ${user.email}</span>
                    <button onclick="database.signOut()" class="btn btn-secondary">Sign Out</button>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="auth-buttons">
                    <button onclick="showSignInModal()" class="btn btn-secondary">Sign In</button>
                    <button onclick="showSignUpModal()" class="btn btn-primary">Sign Up</button>
                </div>
            `;
        }
    }

    // Authentication methods
    async signUp(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password
            });

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Quiz response methods
    async saveQuizResponse(quizId, questionId, answerValue) {
        if (!this.currentUser) {
            console.log('User not authenticated, saving to localStorage');
            return this.saveToLocalStorage(quizId, questionId, answerValue);
        }

        try {
            const { data, error } = await this.supabase
                .from('quiz_responses')
                .upsert({
                    user_id: this.currentUser.id,
                    quiz_id: quizId,
                    question_id: questionId,
                    answer_value: answerValue,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error saving quiz response:', error);
            // Fallback to localStorage
            return this.saveToLocalStorage(quizId, questionId, answerValue);
        }
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
        if (!this.currentUser) {
            // Try to get from localStorage
            try {
                const key = `quiz_responses_${quizId}`;
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                return { success: true, data, storage: 'local' };
            } catch (error) {
                return { success: false, error: 'No responses found' };
            }
        }

        try {
            const { data, error } = await this.supabase
                .from('quiz_responses')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('quiz_id', quizId);

            if (error) throw error;
            
            // Convert array to object for easier access
            const responses = {};
            data.forEach(response => {
                responses[response.question_id] = response.answer_value;
            });
            
            return { success: true, data: responses };
        } catch (error) {
            console.error('Error getting quiz responses:', error);
            return { success: false, error: error.message };
        }
    }

    async saveQuizResults(quizId, results) {
        if (!this.currentUser) {
            console.log('User not authenticated, saving results to localStorage');
            localStorage.setItem('quiz_results', JSON.stringify(results));
            return { success: true, storage: 'local' };
        }

        try {
            const { data, error } = await this.supabase
                .from('quiz_results')
                .upsert({
                    user_id: this.currentUser.id,
                    quiz_id: quizId,
                    type: results.type,
                    authority: results.authority,
                    profile: results.profile,
                    centers: results.centers || {},
                    scores: results.scores || {},
                    summary: results.summary || '',
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error saving quiz results:', error);
            // Fallback to localStorage
            localStorage.setItem('quiz_results', JSON.stringify(results));
            return { success: false, error: error.message, storage: 'local' };
        }
    }

    async getQuizResults(quizId) {
        if (!this.currentUser) {
            // Try localStorage
            try {
                const data = JSON.parse(localStorage.getItem('quiz_results') || '{}');
                return { success: true, data, storage: 'local' };
            } catch (error) {
                return { success: false, error: 'No results found' };
            }
        }

        try {
            const { data, error } = await this.supabase
                .from('quiz_results')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('quiz_id', quizId)
                .single();

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error getting quiz results:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserReports() {
        if (!this.currentUser) {
            return { success: false, error: 'User not authenticated' };
        }

        try {
            const { data, error } = await this.supabase
                .from('user_reports')
                .select(`
                    *,
                    quiz_results (
                        type,
                        authority,
                        profile,
                        created_at
                    )
                `)
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Error getting user reports:', error);
            return { success: false, error: error.message };
        }
    }

    async generateFullReport(quizResultId) {
        if (!this.currentUser) {
            return { success: false, error: 'User not authenticated' };
        }

        try {
            // Get the quiz results first
            const { data: quizResult, error: quizError } = await this.supabase
                .from('quiz_results')
                .select('*')
                .eq('id', quizResultId)
                .eq('user_id', this.currentUser.id)
                .single();

            if (quizError) throw quizError;

            // Generate the comprehensive report
            const reportData = this.generateReportContent(quizResult);

            // Save the full report
            const { data, error } = await this.supabase
                .from('user_reports')
                .upsert({
                    user_id: this.currentUser.id,
                    quiz_result_id: quizResultId,
                    report_data: reportData,
                    is_purchased: false,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            
            return { success: true, data: reportData };
        } catch (error) {
            console.error('Error generating full report:', error);
            return { success: false, error: error.message };
        }
    }

    generateReportContent(quizResult) {
        // This method generates the 40+ page report content
        // In a real implementation, this would be much more sophisticated
        const reportGenerator = new ReportGenerator(quizResult);
        return reportGenerator.generateFullReport();
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    enableQuizSaving() {
        // Enable real-time saving for quiz responses
        if (window.quiz) {
            window.quiz.enableDatabaseSaving();
        }
    }
}

// Global database instance
window.database = new DatabaseService();