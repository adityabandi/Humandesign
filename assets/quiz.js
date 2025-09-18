import { createFullResult } from './db.js';
import { scoreQuiz } from './scoring.js';
import { computeChart } from './hdcalc.js';
import { deriveIntegration } from './insights.js';

// Initialize Supabase configuration
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anon_key || 'your-anon-key-here';

class HumanDesignQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.isLoading = false;
        this.quizId = this.generateQuizId();
        
        this.init();
    }
    
    generateQuizId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async init() {
        await this.loadQuestions();
        this.loadSavedProgress();
        this.renderCurrentQuestion();
        this.updateProgress();
        this.setupEventListeners();
        
        // Track quiz start
        this.trackEvent('quiz_started', {
            quiz_id: this.quizId,
            total_questions: this.questions.length
        });
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/assets/questions.json');
            this.questions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = this.getFallbackQuestions();
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
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const question = this.questions[this.currentQuestionIndex];
            this.answers[question.id] = parseInt(selectedAnswer.value);
            this.saveProgress();
            this.enableNextButton();
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
            progressText.textContent = `${answeredQuestions}/${totalQuestions}`;
        }
        
        if (progressPercentageEl) {
            progressPercentageEl.textContent = `${Math.round(progressPercentage)}%`;
        }
        
        // Update motivation message based on progress
        if (progressMotivation) {
            const motivationMessages = [
                "Every answer brings you closer to your true self ✨",
                "You're doing great! Keep discovering yourself 🌟",
                "Amazing progress! Your authentic design is emerging 🎯",
                "Fantastic! You're more than halfway there 🚀",
                "Outstanding! Your Human Design is almost complete 💫",
                "Incredible! Just a few more questions to go 🎉",
                "Wow! You're so close to your breakthrough 🔥",
                "Almost there! Your transformation awaits ⭐"
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
        const requiredFields = ['birthName', 'birthDate', 'birthTime', 'birthPlace', 'birthTimezone'];
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
        
        // Email is optional
        const emailField = document.getElementById('birthEmail');
        if (emailField && emailField.value.trim()) {
            formData.email = emailField.value.trim();
        }
        
        if (!isValid) {
            alert('Please fill in all required birth information fields.');
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
            
            // Score the quiz
            const quizDerived = scoreQuiz(answersArray, { quizId: this.quizId });
            
            // Calculate the chart
            const birth = {
                name: birthData.name,
                date: birthData.date,
                time: birthData.time,
                tz: birthData.timezone,
                place: birthData.place
            };
            
            const chartDerived = await computeChart(birth);
            
            // Generate integration insights
            const insights = deriveIntegration(quizDerived, chartDerived);
            
            // Create the full result
            const { public_id } = await createFullResult({
                name: birth.name,
                email: birthData.email,
                birth,
                answers: answersArray,
                quizDerived,
                chartDerived,
                insights
            });
            
            // Track completion
            this.trackEvent('quiz_completed', {
                quiz_id: this.quizId,
                public_id: public_id
            });
            
            // Redirect to results
            window.location.href = `/results.html?id=${public_id}`;
            
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