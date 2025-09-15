// Quiz functionality
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
        trackEvent('quiz_started', {
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
        return [
            {
                "id": 1,
                "question": "I feel most energized when I'm actively doing something.",
                "category": "energy_type"
            },
            {
                "id": 2,
                "question": "I prefer to wait for the right opportunity rather than forcing things to happen.",
                "category": "strategy"
            }
        ];
    }
    
    loadSavedProgress() {
        const savedData = getFromLocalStorage('quiz_progress');
        if (savedData && savedData.quiz_id === this.quizId) {
            this.answers = savedData.answers || {};
            this.currentQuestionIndex = savedData.currentQuestionIndex || 0;
        }
    }
    
    saveProgress() {
        const progressData = {
            quiz_id: this.quizId,
            answers: this.answers,
            currentQuestionIndex: this.currentQuestionIndex,
            timestamp: new Date().toISOString()
        };
        saveToLocalStorage('quiz_progress', progressData);
    }
    
    setupEventListeners() {
        // Answer selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'answer') {
                this.selectAnswer(parseInt(e.target.value));
            }
        });
        
        // Navigation buttons
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
        }
        
        // Add global functions for backward compatibility
        window.previousQuestion = () => this.previousQuestion();
        window.nextQuestion = () => this.nextQuestion();
    }
    
    renderCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showQuizComplete();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const answerInputs = document.querySelectorAll('input[name="answer"]');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        if (questionText) {
            questionText.textContent = question.question;
        }
        
        // Clear previous selections
        answerInputs.forEach(input => {
            input.checked = false;
        });
        
        // Restore saved answer if it exists
        const savedAnswer = this.answers[question.id];
        if (savedAnswer) {
            const savedInput = document.querySelector(`input[name="answer"][value="${savedAnswer}"]`);
            if (savedInput) {
                savedInput.checked = true;
            }
        }
        
        // Update button states
        if (prevButton) {
            prevButton.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextButton) {
            nextButton.disabled = !savedAnswer;
        }
        
        this.updateProgress();
    }
    
    selectAnswer(value) {
        const question = this.questions[this.currentQuestionIndex];
        this.answers[question.id] = value;
        
        // Enable next button
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Save progress
        this.saveProgress();
        
        // Track answer
        trackEvent('quiz_answer', {
            quiz_id: this.quizId,
            question_id: question.id,
            question_index: this.currentQuestionIndex + 1,
            answer: value,
            category: question.category
        });
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
            
            trackEvent('quiz_navigation', {
                quiz_id: this.quizId,
                direction: 'previous',
                question_index: this.currentQuestionIndex + 1
            });
        }
    }
    
    nextQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const currentAnswer = this.answers[question.id];
        
        if (!currentAnswer) {
            alert('Please select an answer before continuing.');
            return;
        }
        
        this.currentQuestionIndex++;
        
        trackEvent('quiz_navigation', {
            quiz_id: this.quizId,
            direction: 'next',
            question_index: this.currentQuestionIndex
        });
        
        this.renderCurrentQuestion();
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.currentQuestionIndex + 1}/${this.questions.length}`;
        }
    }
    
    showQuizComplete() {
        const quizContainer = document.getElementById('quizContainer');
        const quizComplete = document.getElementById('quizComplete');
        
        if (quizContainer) {
            quizContainer.style.display = 'none';
        }
        
        if (quizComplete) {
            quizComplete.classList.remove('hidden');
        }
        
        trackEvent('quiz_completed', {
            quiz_id: this.quizId,
            total_questions: this.questions.length,
            completion_time: new Date().toISOString()
        });
    }
    
    calculateResults() {
        const scores = {
            generator: 0,
            manifestor: 0,
            projector: 0,
            reflector: 0,
            emotional_authority: 0,
            sacral_authority: 0,
            spleen_authority: 0,
            throat_authority: 0,
            defined_centers: [],
            undefined_centers: []
        };
        
        // Analyze answers and calculate scores
        Object.entries(this.answers).forEach(([questionId, answer]) => {
            const question = this.questions.find(q => q.id == questionId);
            if (!question) return;
            
            const score = answer; // 1-5 Likert scale
            
            // Type scoring based on question categories
            switch (question.category) {
                case 'generator_traits':
                case 'sacral_defined':
                    scores.generator += score;
                    break;
                case 'manifestor_traits':
                    scores.manifestor += score;
                    break;
                case 'projector_traits':
                    scores.projector += score;
                    break;
                case 'reflector_traits':
                    scores.reflector += score;
                    break;
                case 'emotional_authority':
                    scores.emotional_authority += score;
                    break;
                case 'sacral_authority':
                    scores.sacral_authority += score;
                    break;
                case 'spleen_authority':
                    scores.spleen_authority += score;
                    break;
                case 'throat_authority':
                    scores.throat_authority += score;
                    break;
            }
        });
        
        // Determine primary type
        const typeScores = {
            'Generator': scores.generator,
            'Manifestor': scores.manifestor,
            'Projector': scores.projector,
            'Reflector': scores.reflector
        };
        
        const primaryType = Object.keys(typeScores).reduce((a, b) => 
            typeScores[a] > typeScores[b] ? a : b
        );
        
        // Determine authority
        const authorityScores = {
            'Emotional': scores.emotional_authority,
            'Sacral': scores.sacral_authority,
            'Splenic': scores.spleen_authority,
            'Self-Projected': scores.throat_authority
        };
        
        const primaryAuthority = Object.keys(authorityScores).reduce((a, b) => 
            authorityScores[a] > authorityScores[b] ? a : b
        );
        
        // Generate profile (simplified)
        const profiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
        const profileIndex = Math.floor(Math.random() * profiles.length);
        const profile = profiles[profileIndex];
        
        return {
            type: primaryType,
            authority: primaryAuthority,
            profile: profile,
            scores: scores,
            quiz_id: this.quizId
        };
    }
}

// Submit quiz and navigate to results
function submitQuiz() {
    if (window.quiz) {
        const results = window.quiz.calculateResults();
        
        // Save results
        saveToLocalStorage('quiz_results', results);
        
        trackEvent('quiz_submitted', {
            quiz_id: results.quiz_id,
            type: results.type,
            authority: results.authority,
            profile: results.profile
        });
        
        // Navigate to results page
        window.location.href = '/results.html';
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('quizContainer')) {
        window.quiz = new HumanDesignQuiz();
    }
});