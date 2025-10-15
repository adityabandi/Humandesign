import { createFullResult } from './db.js';
import { scoreQuiz } from './scoring.js';
import { computeChart } from './hdcalc.js';
import { deriveIntegration } from './insights.js';
import { submitToSupabase } from './supabase-db.js';
import { initializeLocationAPI, getLocationCoordinates } from './location-api.js';

// Initialize Supabase configuration
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anon_key || 'your-anon-key-here';

class HumanDesignQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.isLoading = false;
        this.isAdvancing = false; // Prevent multiple concurrent advances
        this.quizId = this.generateQuizId();

        this.init();
    }
    
    generateQuizId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateResultId(name, email) {
        const nameHash = btoa(name.toLowerCase()).substr(0, 8);
        const emailHash = btoa(email.toLowerCase()).substr(0, 8);
        return `hd_${Date.now()}_${nameHash}_${emailHash}`;
    }
    
    async init() {
        await this.loadQuestions();
        this.loadSavedProgress();
        this.renderCurrentQuestion();
        this.updateProgress();
        this.setupEventListeners();
        
        // Initialize location API functionality
        initializeLocationAPI();
        
        // Track quiz start
        this.trackEvent('quiz_started', {
            quiz_id: this.quizId,
            total_questions: this.questions.length
        });
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('./assets/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.questions = await response.json();
            console.log(`✅ Loaded ${this.questions.length} questions successfully`);
        } catch (error) {
            console.error('Error loading questions:', error);
            // Try alternative path
            try {
                const response2 = await fetch('assets/questions.json');
                if (!response2.ok) {
                    throw new Error(`HTTP error! status: ${response2.status}`);
                }
                this.questions = await response2.json();
                console.log(`✅ Loaded ${this.questions.length} questions from alternative path`);
            } catch (error2) {
                console.error('Failed to load from alternative path:', error2);
                this.questions = this.getFallbackQuestions();
            }
        }
    }
    
    getFallbackQuestions() {
        // Fallback questions in case the JSON file fails to load
        const fallback = [];
        for (let i = 1; i <= 100; i++) {
            fallback.push({
                id: i,
                question: `Question ${i}: This is a fallback question for testing purposes.`,
                category: "general"
            });
        }
        return fallback;
    }
    
    loadSavedProgress() {
        try {
            const saved = localStorage.getItem(`quiz_answers_${this.quizId}`);
            if (saved) {
                this.answers = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load saved progress:', error);
        }
    }
    
    saveProgress() {
        try {
            localStorage.setItem(`quiz_answers_${this.quizId}`, JSON.stringify(this.answers));
        } catch (error) {
            console.warn('Could not save progress:', error);
        }
    }
    
    renderCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showBirthForm();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const questionCard = document.getElementById('questionCard');
        const birthFormCard = document.getElementById('birthFormCard');

        if (questionText) {
            questionText.textContent = question.question;
        }

        if (questionCard) {
            questionCard.classList.remove('hidden');
        }

        if (birthFormCard) {
            birthFormCard.classList.add('hidden');
        }

        // Clear previous answer selection
        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
            radio.addEventListener('change', () => this.handleAnswerSelect());
        });

        // Restore saved answer if exists
        const savedAnswer = this.answers[question.id];
        if (savedAnswer) {
            const savedRadio = document.querySelector(`input[name="answer"][value="${savedAnswer}"]`);
            if (savedRadio) {
                savedRadio.checked = true;
                this.enableNextButton();
            }
        }

        this.updateNavigationButtons();
    }
    
    handleAnswerSelect() {
        // Prevent multiple concurrent advances
        if (this.isAdvancing) {
            return;
        }
        
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const question = this.questions[this.currentQuestionIndex];
            this.answers[question.id] = parseInt(selectedAnswer.value);
            this.saveProgress();
            this.updateProgress();
            
            // Add visual feedback
            const selectedOption = selectedAnswer.closest('.scale-option');
            selectedOption.classList.add('selected-animation');
            
            // Set advancing flag and auto-advance after a short delay
            this.isAdvancing = true;
            setTimeout(() => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.nextQuestion();
                } else {
                    this.showBirthForm();
                }
                this.isAdvancing = false; // Reset flag after advancing
            }, 300); // Fast transition
        }
    }
    
    enableNextButton() {
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.disabled = false;
        }
    }
    
    updateNavigationButtons() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        if (prevButton) {
            prevButton.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextButton) {
            const hasAnswer = this.answers[this.questions[this.currentQuestionIndex]?.id];
            nextButton.disabled = !hasAnswer;
        }
    }
    
    updateProgress() {
        const totalQuestions = this.questions.length;
        const answeredQuestions = Object.keys(this.answers).length;
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;

        const progressFill = document.getElementById('progressFill');

        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
            this.updateProgress();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
            this.updateProgress();
        }
    }
    
    showBirthForm() {
        const questionCard = document.getElementById('questionCard');
        const birthFormCard = document.getElementById('birthFormCard');

        if (questionCard) {
            questionCard.classList.add('hidden');
        }

        if (birthFormCard) {
            birthFormCard.classList.remove('hidden');
        }

        this.updateProgress();
    }
    
    validateBirthForm() {
        const formData = {};

        // Get values from the input fields
        const name = document.getElementById('birthName')?.value?.trim();
        const email = document.getElementById('birthEmail')?.value?.trim();
        const date = document.getElementById('birthDate')?.value?.trim();
        const time = document.getElementById('birthTime')?.value?.trim();
        const place = document.getElementById('birthPlace')?.value?.trim();

        if (!name || !email || !date || !time || !place) {
            alert('Please fill in all required fields.');
            return null;
        }

        formData.name = name;
        formData.email = email;
        formData.date = date;
        formData.time = time;
        formData.place = place;
        formData.timezone = 'UTC+00:00'; // Default, will be calculated based on location

        return formData;
    }
    
    async submitQuizWithBirth() {
        console.log('🚀 Starting quiz submission...');

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'GENERATING...';
        }

        try {
            // Validate birth form
            console.log('📝 Validating birth form...');
            const birthData = this.validateBirthForm();
            if (!birthData) {
                console.error('❌ Birth form validation failed');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '✨ REVEAL MY HUMAN DESIGN ✨';
                }
                return;
            }
            console.log('✅ Birth form validated:', birthData);

            // Prepare answers array (1-100)
            const answersArray = [];
            for (let i = 1; i <= 100; i++) {
                answersArray.push(this.answers[i] || 3);
            }
            console.log('✅ Prepared answers array:', answersArray.length, 'answers');

            // Score the quiz
            console.log('🧮 Scoring quiz...');
            const quizDerived = await scoreQuiz(answersArray, { quizId: this.quizId });
            console.log('✅ Quiz scored:', quizDerived);

            // Calculate the chart with location data
            console.log('🌍 Getting location data...');
            const locationData = getLocationCoordinates();
            console.log('✅ Location data:', locationData);

            const birth = {
                name: birthData.name,
                date: birthData.date,
                time: birthData.time,
                tz: birthData.timezone,
                place: birthData.place,
                latitude: locationData.latitude,
                longitude: locationData.longitude
            };

            console.log('📊 Computing chart...');
            const chartDerived = await computeChart(birth);
            console.log('✅ Chart computed:', chartDerived);

            // Generate integration insights
            console.log('💡 Generating insights...');
            const insights = deriveIntegration(quizDerived, chartDerived);
            console.log('✅ Insights generated');

            // Generate local result ID
            const localResultId = this.generateResultId(birth.name, birthData.email);
            console.log('🆔 Generated result ID:', localResultId);

            // Store complete result locally for display
            const resultData = {
                id: localResultId,
                name: birth.name,
                email: birthData.email,
                birth,
                answers: answersArray,
                quiz_derived: quizDerived,
                chart_derived: chartDerived,
                insights,
                purchased: false,
                created_at: new Date().toISOString()
            };

            console.log('💾 Saving to localStorage...');
            localStorage.setItem(`hd_result_${localResultId}`, JSON.stringify(resultData));
            console.log('✅ Saved to localStorage');

            // Submit to Supabase (don't block redirect on this)
            console.log('📤 Submitting to Supabase...');
            submitToSupabase({
                name: birth.name,
                email: birthData.email,
                birth,
                answers: answersArray,
                quizDerived,
                chartDerived,
                insights
            }).then(result => {
                console.log('✅ Supabase submission successful:', result);
            }).catch(error => {
                console.error('⚠️ Supabase submission failed (non-blocking):', error);
            });

            // Track completion
            this.trackEvent('quiz_completed', {
                quiz_id: this.quizId,
                result_id: localResultId
            });

            // REDIRECT IMMEDIATELY - don't wait for SheetDB
            console.log('🔄 Redirecting to results page...');
            console.log('📍 Redirect URL:', `results.html?id=${localResultId}`);

            setTimeout(() => {
                window.location.href = `results.html?id=${localResultId}`;
            }, 500);

        } catch (error) {
            console.error('❌ CRITICAL ERROR in submission:', error);
            console.error('Error stack:', error.stack);

            alert(`Error generating report: ${error.message}\n\nPlease try again or contact support.`);

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '✨ REVEAL MY HUMAN DESIGN ✨';
            }
        }
    }
    
    setupEventListeners() {
        // Make functions globally available for onclick handlers
        window.nextQuestion = () => this.nextQuestion();
        window.previousQuestion = () => this.previousQuestion();
        window.submitQuizWithBirth = () => this.submitQuizWithBirth();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && !document.getElementById('nextButton')?.disabled) {
                this.nextQuestion();
            } else if (e.key === 'ArrowLeft' && !document.getElementById('prevButton')?.disabled) {
                this.previousQuestion();
            }
        });
    }
    
    trackEvent(eventName, data = {}) {
        // Simple event tracking
        console.log(`Event: ${eventName}`, data);
        
        // If you have analytics, integrate here
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hdQuiz = new HumanDesignQuiz();
});

// Export for testing
export { HumanDesignQuiz };
