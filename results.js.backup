// System Configuration Analysis Interface
class ConfigurationAnalysisSystem {
    constructor() {
        this.configurationData = null;
        this.systemConfigurations = {
            'Generator': {
                analysis: "GENERATOR CONFIGURATION DETECTED: Sustainable energy generation system with consistent operational capacity. Primary function involves responsive activation through environmental stimuli engagement. Strategic protocol: Response-based activation sequences optimize satisfaction metrics and operational efficiency.",
                characteristics: ['Sustained Energy Generation', 'Mastery-Oriented Processing', 'Systematic Construction Protocols', 'Satisfaction-Based Optimization']
            },
            'Manifestor': {
                analysis: "MANIFESTOR CONFIGURATION DETECTED: Autonomous initiation system with high-impact generation capabilities. Primary function involves independent action sequences and strategic impact creation. Strategic protocol: Information distribution before action implementation ensures optimal operational flow.",
                characteristics: ['Autonomous Initiation Systems', 'Independent Operation Protocols', 'High-Impact Generation', 'Freedom-Based Architecture']
            },
            'Projector': {
                analysis: "PROJECTOR CONFIGURATION DETECTED: System optimization and guidance architecture with specialized energy management protocols. Primary function involves efficiency analysis and directional guidance systems. Strategic protocol: Recognition-based activation through formal invitation protocols.",
                characteristics: ['System Optimization Protocols', 'Efficiency Analysis Systems', 'Strategic Guidance Architecture', 'Recognition-Based Activation']
            },
            'Reflector': {
                analysis: "REFLECTOR CONFIGURATION DETECTED: Environmental monitoring and community health assessment system. Primary function involves collective reflection and environmental quality evaluation. Strategic protocol: Lunar cycle analysis for major decision implementation.",
                characteristics: ['Environmental Assessment Systems', 'Community Health Monitoring', 'Collective Reflection Protocols', 'Temporal Decision Architecture']
            }
        };
        
        this.authorityProtocols = {
            'Emotional': "EMOTIONAL WAVE AUTHORITY: Decision-making requires emotional spectrum analysis through complete wave cycles. Implementation protocol: Avoid decisions during emotional peaks or valleys. Optimal timing occurs during wave neutrality points.",
            'Sacral': "SACRAL RESPONSE AUTHORITY: Instantaneous gut response system provides binary directional guidance. Implementation protocol: Monitor for immediate 'affirmative' or 'negative' somatic responses. First response maintains highest accuracy.",
            'Splenic': "SPLENIC INTUITION AUTHORITY: Real-time intuitive alert system providing immediate environmental awareness. Implementation protocol: Trust instantaneous knowing signals. Secondary analysis may compromise accuracy.",
            'Self-Projected': "SELF-PROJECTED AUTHORITY: Vocal truth detection through external mirror engagement. Implementation protocol: Verbalize decision scenarios to trusted operators. Truth recognition occurs through vocal expression analysis."
        };
        
        this.profileArchitectures = {
            '1/3': "Investigator/Martyr - You're here to deeply understand foundations and learn through trial and error.",
            '1/4': "Investigator/Opportunist - You build solid foundations and share wisdom through your network.",
            '2/4': "Hermit/Opportunist - You have natural gifts that emerge through relationships and networks.",
            '2/5': "Hermit/Heretic - You're called out for your natural gifts and projected upon by others.",
            '3/5': "Martyr/Heretic - You learn through experience and are projected upon to provide solutions.",
            '3/6': "Martyr/Role Model - You learn through trial and error in the first half of life, then become a wise role model.",
            '4/6': "Opportunist/Role Model - You build networks in youth and become an influential role model later.",
            '4/1': "Opportunist/Investigator - You network and influence while building solid foundations.",
            '5/1': "Heretic/Investigator - You're projected upon to provide solutions backed by solid research.",
            '5/2': "Heretic/Hermit - You're called to provide solutions but need alone time to develop your gifts.",
            '6/2': "Role Model/Hermit - You're here to be an example while honoring your need for solitude.",
            '6/3': "Role Model/Martyr - You become a wise role model through learning from life's experiences."
        };
        
        this.init();
    }
    
    init() {
        this.loadResults();
        this.displayResults();
        this.trackResultsView();
    }
    
    loadResults() {
        this.results = getFromLocalStorage('quiz_results');
        
        if (!this.results) {
            // Redirect to quiz if no results found
            alert('No quiz results found. Please take the assessment first.');
            window.location.href = '/quiz.html';
            return;
        }
    }
    
    displayResults() {
        if (!this.results) return;
        
        this.displayType();
        this.displayAuthority();
        this.displayProfile();
        this.displayCenters();
        this.generateSummary();
    }
    
    displayType() {
        const typeElement = document.getElementById('resultType');
        const typeDescElement = document.getElementById('typeDescription');
        
        if (typeElement) {
            typeElement.textContent = this.results.type;
        }
        
        if (typeDescElement && this.typeDescriptions[this.results.type]) {
            typeDescElement.textContent = this.typeDescriptions[this.results.type].description;
        }
    }
    
    displayAuthority() {
        const authorityElement = document.getElementById('resultAuthority');
        const authorityDescElement = document.getElementById('authorityDescription');
        
        if (authorityElement) {
            authorityElement.textContent = this.results.authority;
        }
        
        if (authorityDescElement && this.authorityDescriptions[this.results.authority]) {
            authorityDescElement.textContent = this.authorityDescriptions[this.results.authority];
        }
    }
    
    displayProfile() {
        const profileElement = document.getElementById('resultProfile');
        const profileDescElement = document.getElementById('profileDescription');
        
        if (profileElement) {
            profileElement.textContent = this.results.profile;
        }
        
        if (profileDescElement && this.profileDescriptions[this.results.profile]) {
            profileDescElement.textContent = this.profileDescriptions[this.results.profile];
        }
    }
    
    displayCenters() {
        const centersGrid = document.getElementById('centersGrid');
        if (!centersGrid) return;
        
        // Simulate center definition based on type and scores
        const centerDefinitions = this.calculateCenterDefinitions();
        
        const centers = centersGrid.querySelectorAll('.center');
        centers.forEach(center => {
            const centerName = center.getAttribute('data-center');
            if (centerDefinitions[centerName]) {
                center.classList.remove('undefined');
                center.classList.add('defined');
            } else {
                center.classList.remove('defined');
                center.classList.add('undefined');
            }
        });
    }
    
    calculateCenterDefinitions() {
        // This is a simplified calculation - in a real app this would be more complex
        const definitions = {};
        
        // Base definitions on type
        switch (this.results.type) {
            case 'Generator':
                definitions.sacral = true;
                definitions.throat = Math.random() > 0.5;
                definitions.emotional = this.results.authority === 'Emotional';
                break;
            case 'Manifestor':
                definitions.throat = true;
                definitions.emotional = this.results.authority === 'Emotional';
                definitions.will = Math.random() > 0.6;
                break;
            case 'Projector':
                definitions.throat = Math.random() > 0.7;
                definitions.identity = Math.random() > 0.5;
                definitions.spleen = this.results.authority === 'Splenic';
                break;
            case 'Reflector':
                // Reflectors have no defined centers
                break;
        }
        
        // Add some randomization for other centers
        const allCenters = ['head', 'ajna', 'throat', 'identity', 'will', 'emotional', 'sacral', 'spleen', 'root'];
        allCenters.forEach(center => {
            if (definitions[center] === undefined) {
                definitions[center] = Math.random() > 0.7; // 30% chance of definition
            }
        });
        
        return definitions;
    }
    
    generateSummary() {
        const summaryElement = document.getElementById('summaryContent');
        if (!summaryElement) return;
        
        const typeInfo = this.typeDescriptions[this.results.type];
        const summary = this.createPersonalizedSummary(typeInfo);
        
        summaryElement.innerHTML = summary;
    }
    
    createPersonalizedSummary(typeInfo) {
        const name = this.getPersonalizedName();
        
        return `
            <h3>Hello ${name}!</h3>
            <p>Based on your assessment responses, you are a <strong>${this.results.type}</strong> with <strong>${this.results.authority}</strong> authority and a <strong>${this.results.profile}</strong> profile.</p>
            
            <p>${typeInfo.description}</p>
            
            <h4>Your Key Traits:</h4>
            <ul>
                ${typeInfo.traits.map(trait => `<li>${trait}</li>`).join('')}
            </ul>
            
            <h4>Your Decision-Making Process:</h4>
            <p>${this.authorityDescriptions[this.results.authority]}</p>
            
            <h4>Your Life Theme:</h4>
            <p>${this.profileDescriptions[this.results.profile]}</p>
            
            <div class="summary-cta">
                <p><strong>This is just the beginning of your Human Design journey.</strong> Your complete report includes detailed analysis of all your gates, channels, and how to apply this wisdom in relationships, career, and personal growth.</p>
            </div>
        `;
    }
    
    getPersonalizedName() {
        // In a real app, this would come from user input
        return 'Friend';
    }
    
    trackResultsView() {
        trackEvent('results_viewed', {
            quiz_id: this.results.quiz_id,
            type: this.results.type,
            authority: this.results.authority,
            profile: this.results.profile,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize results when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('resultType')) {
        window.results = new HumanDesignResults();
    }
});

// Additional results page functions
function retakeQuiz() {
    // Clear saved results and redirect to quiz
    localStorage.removeItem('quiz_results');
    localStorage.removeItem('quiz_progress');
    
    trackEvent('quiz_retake', {
        source: 'results_page'
    });
    
    window.location.href = '/quiz.html';
}

function shareResults() {
    if (window.results && window.results.results) {
        const results = window.results.results;
        const shareText = `I just discovered I'm a ${results.type} with ${results.authority} authority in Human Design! Find out your type: ${window.location.origin}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Human Design Results',
                text: shareText,
                url: window.location.origin
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard!');
            });
        }
        
        trackEvent('results_shared', {
            type: results.type,
            authority: results.authority,
            method: navigator.share ? 'native_share' : 'clipboard'
        });
    }
}