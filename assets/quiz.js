import { createFullResult } from './db.js';
import { scoreQuiz } from './scoring.js';
import { computeChart } from './hdcalc.js';
import { deriveIntegration } from './insights.js';
import { submitToSheetDB } from './sheetdb.js';
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
            this.showQuizComplete();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const questionCategory = document.getElementById('questionCategory');
        const questionNumber = document.getElementById('questionNumber');
        const questionCard = document.getElementById('questionCard');
        const quizComplete = document.getElementById('quizComplete');
        
        if (questionText) {
            questionText.textContent = question.question;
        }
        
        if (questionCategory) {
            // Format category for display
            const categoryDisplay = question.category
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            questionCategory.textContent = categoryDisplay;
        }
        
        if (questionNumber) {
            questionNumber.textContent = `Question ${this.currentQuestionIndex + 1}`;
        }
        
        if (questionCard) {
            questionCard.classList.remove('hidden');
        }
        if (quizComplete) {
            quizComplete.classList.add('hidden');
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
                    this.showQuizComplete();
                }
                this.isAdvancing = false; // Reset flag after advancing
            }, 600); // Reduced delay for faster flow
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
        const progressText = document.getElementById('progressText');
        const progressPercentageEl = document.getElementById('progressPercentage');
        const progressMotivation = document.getElementById('progressMotivation');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        if (progressText) {
            const formattedCurrent = String(answeredQuestions).padStart(2, '0');
            const formattedTotal = String(totalQuestions).padStart(2, '0');
            progressText.textContent = `${formattedCurrent}/${formattedTotal}`;
        }
        
        if (progressPercentageEl) {
            const formattedPercentage = String(Math.round(progressPercentage)).padStart(2, '0');
            progressPercentageEl.textContent = `${formattedPercentage}%`;
        }
        
        // Update motivation messages
        if (progressMotivation) {
            const motivationMessages = [
                "Starting your personality assessment...",
                "Understanding your unique psychological patterns...",
                "Discovering your personality traits...",
                "Halfway through your psychology profile...",
                "Exploring your behavioral tendencies...",
                "Almost done with your personality questionnaire...",
                "Completing your Big 5 psychology profile...",
                "Ready to create your integrated personality report!"
            ];
            
            const messageIndex = Math.min(
                Math.floor(progressPercentage / 12.5),
                motivationMessages.length - 1
            );
            
            const motivationText = progressMotivation.querySelector('.motivation-text');
            if (motivationText) {
                motivationText.textContent = motivationMessages[messageIndex];
            }
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
    
    showQuizComplete() {
        const questionCard = document.getElementById('questionCard');
        const quizComplete = document.getElementById('quizComplete');
        
        if (questionCard) {
            questionCard.classList.add('hidden');
        }
        if (quizComplete) {
            quizComplete.classList.remove('hidden');
        }
        
        this.updateProgress();
    }
    
    validateBirthForm() {
        const requiredFields = ['birthName', 'birthEmail', 'birthDate', 'birthTime', 'birthPlace', 'birthTimezone'];
        const formData = {};
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                const value = field.value.trim();
                if (!value) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                    formData[fieldId.replace('birth', '').toLowerCase()] = value;
                }
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields including your email address.');
            return null;
        }
        
        return formData;
    }
    
    async submitQuizWithBirth() {
        try {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Generating...';
            }
            
            // Validate birth form
            const birthData = this.validateBirthForm();
            if (!birthData) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Generate My Human Design Report';
                }
                return;
            }
            
            // Prepare answers array (1-100)
            const answersArray = [];
            for (let i = 1; i <= 100; i++) {
                answersArray.push(this.answers[i] || 3); // default to neutral if missing
            }
            
            // Score the quiz (now async)
            const quizDerived = await scoreQuiz(answersArray, { quizId: this.quizId });
            
            // Calculate the chart with enhanced location data
            const locationData = getLocationCoordinates();
            const birth = {
                name: birthData.name,
                date: birthData.date,
                time: birthData.time,
                tz: birthData.timezone,
                place: birthData.place,
                latitude: locationData.latitude,
                longitude: locationData.longitude
            };
            
            const chartDerived = await computeChart(birth);
            
            // Generate integration insights
            const insights = deriveIntegration(quizDerived, chartDerived);

            // Generate local result ID (SheetDB-only mode)
            const localResultId = this.generateResultId(birth.name, birthData.email);

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
            localStorage.setItem(`hd_result_${localResultId}`, JSON.stringify(resultData));

            // Submit to SheetDB for data collection (non-blocking)
            if (window.SHEETDB_CONFIG?.enabled) {
                try {
                    const sheetdbResult = await submitToSheetDB({
                        name: birth.name,
                        email: birthData.email,
                        birth,
                        answers: answersArray,
                        quizDerived,
                        chartDerived,
                        insights
                    });
                    console.log('SheetDB submission result:', sheetdbResult);
                } catch (sheetdbError) {
                    console.warn('SheetDB submission failed, but continuing:', sheetdbError);
                }
            }

            // Track completion
            this.trackEvent('quiz_completed', {
                quiz_id: this.quizId,
                result_id: localResultId
            });

            // Redirect to results
            window.location.href = `/results.html?id=${localResultId}`;
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error generating your report. Please try again.');
            
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Generate My Human Design Report';
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
