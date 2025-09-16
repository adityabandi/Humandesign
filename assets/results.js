import { fetchResult, markPurchase } from './db.js';

class ResultsDisplay {
    constructor() {
        this.publicId = null;
        this.resultData = null;
        this.init();
    }
    
    async init() {
        try {
            // Get public_id from URL parameter
            this.publicId = new URL(location.href).searchParams.get('id');
            
            if (!this.publicId) {
                this.showError('No result ID found in URL. Please complete the quiz first.');
                return;
            }
            
            // Load result data
            await this.loadResultData();
            
            // Render the results
            this.renderResults();
            
            // Set up buy button links
            this.setupBuyButtons();
            
        } catch (error) {
            console.error('Results initialization error:', error);
            this.showError('Failed to load your results. Please try again or retake the quiz.');
        }
    }
    
    async loadResultData() {
        try {
            this.resultData = await fetchResult(this.publicId);
            console.log('Loaded result data:', this.resultData);
        } catch (error) {
            console.error('Error loading result data:', error);
            
            if (error.message.includes('Missing secret')) {
                throw new Error('This result is not accessible on this device. Please complete the quiz on this device to view your results.');
            } else {
                throw new Error('Could not load your results. Please try again.');
            }
        }
    }
    
    renderResults() {
        if (!this.resultData) return;
        
        const { user, quiz, chart, insights, purchased, birth } = this.resultData;
        
        // Update page title with user name
        if (user.name) {
            document.title = `${user.name}'s Human Design Report`;
        }
        
        // Render quiz results
        this.renderQuizResults(quiz);
        
        // Render chart information
        this.renderChartResults(chart);
        
        // Render integration insights
        this.renderInsights(insights);
        
        // Show purchase status
        this.updatePurchaseStatus(purchased);
        
        // Add print functionality
        this.setupPrintButton();
    }
    
    renderQuizResults(quiz) {
        // Find or create quiz results section
        let quizSection = document.getElementById('quiz-results');
        if (!quizSection) {
            quizSection = this.createSection('quiz-results', 'Quiz Analysis');
        }
        
        const content = `
            <div class="result-card">
                <h3>Personality Assessment</h3>
                <div class="result-details">
                    <div class="result-item">
                        <span class="label">Type Indication:</span>
                        <span class="value">${quiz.type}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Authority Tendency:</span>
                        <span class="value">${quiz.authority}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Profile Candidates:</span>
                        <span class="value">${quiz.profileCandidates.join(', ')}</span>
                    </div>
                </div>
                <p class="summary">${quiz.summary}</p>
            </div>
        `;
        
        quizSection.innerHTML = content;
    }
    
    renderChartResults(chart) {
        let chartSection = document.getElementById('chart-results');
        if (!chartSection) {
            chartSection = this.createSection('chart-results', 'Birth Chart Analysis');
        }
        
        const definedCenters = Object.keys(chart.centers).filter(center => 
            chart.centers[center].defined
        ).join(', ') || 'None defined';
        
        const activeGates = Object.keys(chart.gates).filter(gate => 
            chart.gates[gate].active
        ).slice(0, 10).join(', '); // Show first 10 gates
        
        const content = `
            <div class="result-card">
                <h3>Human Design Chart</h3>
                <div class="result-details">
                    <div class="result-item">
                        <span class="label">Type:</span>
                        <span class="value">${chart.type}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Authority:</span>
                        <span class="value">${chart.authority}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Profile:</span>
                        <span class="value">${chart.profile}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Definition:</span>
                        <span class="value">${chart.definition}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Defined Centers:</span>
                        <span class="value">${definedCenters}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Key Gates:</span>
                        <span class="value">${activeGates}</span>
                    </div>
                </div>
            </div>
        `;
        
        chartSection.innerHTML = content;
    }
    
    renderInsights(insights) {
        let insightsSection = document.getElementById('integration-insights');
        if (!insightsSection) {
            insightsSection = this.createSection('integration-insights', 'Integration Insights');
        }
        
        const insightsList = insights.map(insight => 
            `<li class="insight-item">${insight}</li>`
        ).join('');
        
        const content = `
            <div class="result-card">
                <h3>Quiz & Chart Integration</h3>
                <ul class="insights-list">
                    ${insightsList}
                </ul>
            </div>
        `;
        
        insightsSection.innerHTML = content;
    }
    
    createSection(id, title) {
        const section = document.createElement('div');
        section.id = id;
        section.className = 'results-section';
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        section.appendChild(titleElement);
        
        // Insert before the upgrade section
        const upgradeSection = document.querySelector('.upgrade-section');
        if (upgradeSection) {
            upgradeSection.parentNode.insertBefore(section, upgradeSection);
        } else {
            document.querySelector('.main-content').appendChild(section);
        }
        
        return section;
    }
    
    updatePurchaseStatus(purchased) {
        const upgradeSection = document.querySelector('.upgrade-section');
        if (!upgradeSection) return;
        
        if (purchased) {
            upgradeSection.innerHTML = `
                <div class="purchased-status">
                    <h2>✅ Full Report Purchased</h2>
                    <p>Thank you for your purchase! You have access to the complete Human Design analysis.</p>
                    <button class="btn btn-primary large" onclick="window.print()">Print Full Report</button>
                </div>
            `;
        } else {
            // Keep existing upgrade section but update buy button links
            this.setupBuyButtons();
        }
    }
    
    setupBuyButtons() {
        // Update all buy button links to include the public_id
        const buyButtons = document.querySelectorAll('a[href="/buy.html"]');
        buyButtons.forEach(button => {
            button.href = `/buy.html?id=${this.publicId}`;
        });
        
        // Update preview button
        const previewButtons = document.querySelectorAll('a[href="/preview.html"]');
        previewButtons.forEach(button => {
            button.href = `/preview.html?id=${this.publicId}`;
        });
    }
    
    setupPrintButton() {
        // Add print functionality
        const printButton = document.createElement('button');
        printButton.className = 'btn btn-secondary';
        printButton.textContent = 'Print Preview';
        printButton.onclick = () => window.print();
        
        const actions = document.querySelector('.cta-buttons');
        if (actions) {
            actions.appendChild(printButton);
        }
    }
    
    showError(message) {
        const container = document.querySelector('.main-content .container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Unable to Load Results</h2>
                    <p>${message}</p>
                    <a href="/quiz.html" class="btn btn-primary">Take Quiz Again</a>
                </div>
            `;
        }
    }
}

// Make markPurchase globally available for buy flow
window.markPurchase = markPurchase;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resultsDisplay = new ResultsDisplay();
});

export { ResultsDisplay };