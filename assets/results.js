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
        
        // Render chart visualization first
        this.renderChartVisualization(chart);
        
        // Render main results
        this.renderQuizResults(quiz);
        this.renderChartResults(chart);
        this.renderInsights(insights);
        
        // Set up interactive features
        this.setupTabs();
        this.setupChartInteractions();
        
        // Show purchase status
        this.updatePurchaseStatus(purchased);
        
        // Add print functionality
        this.setupPrintButton();
    }
    
    renderChartVisualization(chart) {
        if (!chart) return;
        
        // Update chart centers
        this.updateChartCenters(chart);
        
        // Render channels
        this.renderChannels(chart);
        
        // Update centers analysis
        this.renderCentersAnalysis(chart);
    }
    
    updateChartCenters(chart) {
        const centersData = {
            head: { defined: chart.centers?.head?.defined || false, gates: ['64', '61'] },
            ajna: { defined: chart.centers?.ajna?.defined || false, gates: ['47', '24'] },
            throat: { defined: chart.centers?.throat?.defined || false, gates: ['31', '8'] },
            g: { defined: chart.centers?.g?.defined || false, gates: ['7', '1'] },
            heart: { defined: chart.centers?.heart?.defined || false, gates: ['21', '40'] },
            spleen: { defined: chart.centers?.spleen?.defined || false, gates: ['50', '32'] },
            sacral: { defined: chart.centers?.sacral?.defined || false, gates: ['34', '5'] },
            solar: { defined: chart.centers?.solar?.defined || false, gates: ['36', '22'] },
            root: { defined: chart.centers?.root?.defined || false, gates: ['58', '38'] }
        };
        
        // Update each center in the visualization
        Object.keys(centersData).forEach(centerName => {
            const centerElement = document.querySelector(`[data-center="${centerName}"]`);
            const centerData = centersData[centerName];
            
            if (centerElement) {
                if (centerData.defined) {
                    centerElement.classList.add('defined');
                    centerElement.classList.remove('undefined');
                } else {
                    centerElement.classList.add('undefined');
                    centerElement.classList.remove('defined');
                }
                
                // Add tooltip with center information
                this.addCenterTooltip(centerElement, centerName, centerData);
            }
        });
    }
    
    addCenterTooltip(element, centerName, centerData) {
        const centerInfo = this.getCenterInfo(centerName);
        const status = centerData.defined ? 'Defined' : 'Undefined';
        const description = centerData.defined ? centerInfo.definedDesc : centerInfo.undefinedDesc;
        
        element.title = `${centerInfo.displayName} - ${status}\n${description}`;
        
        // Add click handler for detailed info
        element.addEventListener('click', () => {
            this.showCenterDetails(centerName, centerData, centerInfo);
        });
    }
    
    getCenterInfo(centerName) {
        const centerInfoMap = {
            head: {
                displayName: 'Head Center',
                definedDesc: 'Consistent mental pressure and inspiration. You have reliable access to mental energy.',
                undefinedDesc: 'Variable mental pressure. You amplify and reflect the mental energy of others.'
            },
            ajna: {
                displayName: 'Ajna Center',
                definedDesc: 'Fixed way of thinking and processing information. Consistent mental patterns.',
                undefinedDesc: 'Flexible thinking. You can see from multiple perspectives and adapt your mental approach.'
            },
            throat: {
                displayName: 'Throat Center',
                definedDesc: 'Consistent way of communicating and manifesting. Reliable voice and expression.',
                undefinedDesc: 'Variable communication style. You adapt your voice to different situations and people.'
            },
            g: {
                displayName: 'G Center (Identity)',
                definedDesc: 'Fixed sense of identity, direction, and love. Consistent core self.',
                undefinedDesc: 'Flexible identity. You adapt and reflect the identity and direction of others.'
            },
            heart: {
                displayName: 'Heart Center (Ego/Will)',
                definedDesc: 'Consistent willpower and ego strength. Reliable access to determination.',
                undefinedDesc: 'Variable willpower. You amplify and prove yourself through the will of others.'
            },
            spleen: {
                displayName: 'Spleen Center',
                definedDesc: 'Consistent intuition, health awareness, and survival instincts.',
                undefinedDesc: 'Variable intuition. You amplify and reflect the fears and intuitions of others.'
            },
            sacral: {
                displayName: 'Sacral Center',
                definedDesc: 'Consistent life force energy and sexuality. Generator or Manifesting Generator.',
                undefinedDesc: 'No consistent life force. You amplify and reflect the life force of others.'
            },
            solar: {
                displayName: 'Solar Plexus Center',
                definedDesc: 'Emotional authority. You experience consistent emotional waves and need time for clarity.',
                undefinedDesc: 'Variable emotions. You amplify and reflect the emotions of others.'
            },
            root: {
                displayName: 'Root Center',
                definedDesc: 'Consistent pressure and drive to act. Reliable adrenal energy.',
                undefinedDesc: 'Variable pressure. You amplify and feel urgency from the pressure of others.'
            }
        };
        
        return centerInfoMap[centerName] || { displayName: centerName, definedDesc: '', undefinedDesc: '' };
    }
    
    renderChannels(chart) {
        const channelsContainer = document.getElementById('channelsContainer');
        if (!channelsContainer || !chart.channels) return;
        
        // Clear existing channels
        channelsContainer.innerHTML = '';
        
        // Add active channels
        chart.channels.forEach(channel => {
            if (channel.active) {
                const channelElement = document.createElement('div');
                channelElement.className = 'channel active';
                channelElement.title = `${channel.name} (Gates ${channel.gates.join('-')})`;
                channelsContainer.appendChild(channelElement);
            }
        });
    }
    
    renderCentersAnalysis(chart) {
        const centersGridDetailed = document.getElementById('centersGridDetailed');
        const centersSummary = document.getElementById('centersSummary');
        
        if (!centersGridDetailed || !chart.centers) return;
        
        // Clear existing content
        centersGridDetailed.innerHTML = '';
        
        // Count defined/undefined centers
        const definedCenters = Object.keys(chart.centers).filter(center => 
            chart.centers[center].defined
        );
        const undefinedCenters = Object.keys(chart.centers).filter(center => 
            !chart.centers[center].defined
        );
        
        // Update summary
        if (centersSummary) {
            centersSummary.innerHTML = `
                You have <strong>${definedCenters.length} defined centers</strong> and 
                <strong>${undefinedCenters.length} undefined centers</strong>. 
                Defined centers represent consistent, reliable energy that you can count on. 
                Undefined centers are where you're open to conditioning and can amplify the energy of others.
            `;
        }
        
        // Render detailed center cards
        Object.keys(chart.centers).forEach(centerName => {
            const centerData = chart.centers[centerName];
            const centerInfo = this.getCenterInfo(centerName);
            
            const centerCard = document.createElement('div');
            centerCard.className = `center-detail ${centerData.defined ? 'defined' : 'undefined'}`;
            centerCard.innerHTML = `
                <h4>${centerInfo.displayName}</h4>
                <div class="center-status-badge ${centerData.defined ? 'defined' : 'undefined'}">
                    ${centerData.defined ? 'Defined' : 'Undefined'}
                </div>
                <p>${centerData.defined ? centerInfo.definedDesc : centerInfo.undefinedDesc}</p>
            `;
            
            centersGridDetailed.appendChild(centerCard);
        });
    }
    
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // Load content for the selected tab
                this.loadTabContent(targetTab);
            });
        });
        
        // Load initial overview content
        this.loadTabContent('overview');
    }
    
    loadTabContent(tabName) {
        const { quiz, chart } = this.resultData;
        
        switch (tabName) {
            case 'overview':
                this.loadOverviewContent();
                break;
            case 'gates':
                this.loadGatesContent(chart);
                break;
            case 'strategy':
                this.loadStrategyContent(chart, quiz);
                break;
            case 'relationships':
                this.loadRelationshipsContent(chart);
                break;
        }
    }
    
    loadOverviewContent() {
        const overviewContent = document.getElementById('overviewContent');
        if (!overviewContent) return;
        
        const { chart, quiz } = this.resultData;
        
        overviewContent.innerHTML = `
            <div class="overview-section">
                <h3>Your Energy Type: ${chart.type}</h3>
                <p>As a ${chart.type}, your strategy is <strong>${this.getStrategyText(chart.type)}</strong>. 
                This is how you're designed to interact with life and make decisions that align with your true nature.</p>
            </div>
            
            <div class="overview-section">
                <h3>Your Decision-Making Authority: ${chart.authority}</h3>
                <p>${this.getAuthorityDescription(chart.authority)}</p>
            </div>
            
            <div class="overview-section">
                <h3>Your Profile: ${chart.profile}</h3>
                <p>${this.getProfileDescription(chart.profile)}</p>
            </div>
        `;
    }
    
    loadGatesContent(chart) {
        const gatesContent = document.getElementById('gatesContent');
        if (!gatesContent || !chart.gates) return;
        
        const activeGates = Object.keys(chart.gates).filter(gate => chart.gates[gate].active);
        
        gatesContent.innerHTML = `
            <div class="gates-overview">
                <h3>Your Active Gates</h3>
                <p>You have <strong>${activeGates.length} active gates</strong> in your chart. These represent specific energies and potentials that are consistently available to you.</p>
            </div>
            
            <div class="gates-grid">
                ${activeGates.slice(0, 12).map(gate => `
                    <div class="gate-card">
                        <div class="gate-number">Gate ${gate}</div>
                        <div class="gate-name">${this.getGateName(gate)}</div>
                        <div class="gate-center">Center: ${chart.gates[gate].center || 'Unknown'}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="channels-overview">
                <h3>Your Channels</h3>
                <p>Channels connect two centers and represent specific life themes and areas of mastery.</p>
                <div class="channels-list">
                    ${chart.channels?.filter(ch => ch.active).slice(0, 6).map(channel => `
                        <div class="channel-card">
                            <div class="channel-name">${channel.name}</div>
                            <div class="channel-gates">Gates ${channel.gates.join(' - ')}</div>
                        </div>
                    `).join('') || '<p>No fully defined channels detected in this preview.</p>'}
                </div>
            </div>
        `;
    }
    
    loadStrategyContent(chart, quiz) {
        const strategyContent = document.getElementById('strategyContent');
        if (!strategyContent) return;
        
        strategyContent.innerHTML = `
            <div class="strategy-section">
                <h3>Your Type Strategy</h3>
                <p><strong>${chart.type}</strong> - ${this.getStrategyText(chart.type)}</p>
                <p>${this.getStrategyDetailedDescription(chart.type)}</p>
            </div>
            
            <div class="authority-section">
                <h3>Your Decision-Making Authority</h3>
                <p><strong>${chart.authority}</strong></p>
                <p>${this.getAuthorityDescription(chart.authority)}</p>
                <div class="authority-tips">
                    <h4>How to Use Your Authority:</h4>
                    ${this.getAuthorityTips(chart.authority)}
                </div>
            </div>
            
            <div class="alignment-section">
                <h3>Quiz Alignment Analysis</h3>
                <p>Based on your quiz responses, here's how aligned you are with your natural design:</p>
                <div class="alignment-insights">
                    ${this.generateAlignmentInsights(chart, quiz)}
                </div>
            </div>
        `;
    }
    
    loadRelationshipsContent(chart) {
        const relationshipsContent = document.getElementById('relationshipsContent');
        if (!relationshipsContent) return;
        
        relationshipsContent.innerHTML = `
            <div class="relationships-section">
                <h3>Your Relationship Style</h3>
                <p>As a ${chart.type} with ${chart.authority} authority, here's how you naturally operate in relationships:</p>
                <div class="relationship-insights">
                    ${this.getRelationshipInsights(chart)}
                </div>
            </div>
            
            <div class="communication-section">
                <h3>Communication Style</h3>
                <p>${this.getCommunicationStyle(chart)}</p>
            </div>
            
            <div class="compatibility-section">
                <h3>Compatibility Notes</h3>
                <p>${this.getCompatibilityNotes(chart)}</p>
            </div>
        `;
    }
    
    setupChartInteractions() {
        // Add hover effects and click handlers for chart elements
        const centers = document.querySelectorAll('.center');
        centers.forEach(center => {
            center.addEventListener('mouseenter', () => {
                center.style.transform = 'scale(1.05)';
            });
            
            center.addEventListener('mouseleave', () => {
                center.style.transform = 'scale(1)';
            });
        });
    }
    
    // Helper methods for content generation
    getStrategyText(type) {
        const strategies = {
            'Generator': 'to respond',
            'Manifestor': 'to inform',
            'Projector': 'to wait for invitation',
            'Reflector': 'to wait a lunar cycle'
        };
        return strategies[type] || 'to follow your design';
    }
    
    getStrategyDetailedDescription(type) {
        const descriptions = {
            'Generator': 'Wait for life to come to you and respond with your gut instinct. Your sacral energy is powerful when engaged with the right things.',
            'Manifestor': 'You are here to initiate and make things happen. Inform others of your actions to reduce resistance.',
            'Projector': 'You have a gift for seeing others clearly and guiding them. Wait for invitations to share your insights.',
            'Reflector': 'You reflect the health of your community. Take time to feel into decisions - ideally a full lunar cycle.'
        };
        return descriptions[type] || 'Follow your unique strategy based on your type.';
    }
    
    getAuthorityDescription(authority) {
        const descriptions = {
            'Sacral': 'Trust your gut responses - the immediate yes/no feeling from your sacral center.',
            'Emotional': 'You need time to feel your way through decisions. Avoid making decisions in emotional highs or lows.',
            'Splenic': 'Trust your intuitive knowing in the moment. Your first instinct is usually correct.',
            'Ego': 'Make decisions based on what you have the will and resources to commit to.',
            'Self-Projected': 'Talk through your decisions and listen to what you hear yourself saying.',
            'Environmental': 'Your environment and the people around you influence your decision-making process.'
        };
        return descriptions[authority] || 'Follow your unique decision-making process.';
    }
    
    getAuthorityTips(authority) {
        const tips = {
            'Sacral': '<ul><li>Pay attention to your immediate gut response</li><li>Notice the energy of "uh-huh" (yes) vs "uh-uh" (no)</li><li>Don\'t overthink - trust the first response</li></ul>',
            'Emotional': '<ul><li>Avoid making important decisions when highly emotional</li><li>Sleep on major decisions</li><li>Feel your way through options over time</li></ul>',
            'Splenic': '<ul><li>Trust your first instinct</li><li>Don\'t second-guess yourself</li><li>Pay attention to what feels healthy vs unhealthy</li></ul>',
            'Ego': '<ul><li>Only commit to what you truly want</li><li>Consider your resources and energy</li><li>Make promises you can keep</li></ul>',
            'Self-Projected': '<ul><li>Talk through decisions with trusted people</li><li>Listen to what you hear yourself saying</li><li>Notice what feels true when you speak</li></ul>',
            'Environmental': '<ul><li>Pay attention to how different environments affect you</li><li>Notice how different people influence your clarity</li><li>Seek environments that support your decision-making</li></ul>'
        };
        return tips[authority] || '<p>Follow your unique decision-making process.</p>';
    }
    
    getProfileDescription(profile) {
        const profiles = {
            '1/3': 'The Investigator/Martyr - You need a solid foundation of knowledge and learn through trial and error.',
            '1/4': 'The Investigator/Opportunist - You research deeply and share knowledge through your network.',
            '2/4': 'The Hermit/Opportunist - You have natural gifts that emerge when called upon by others.',
            '2/5': 'The Hermit/Heretic - You have natural talents and are seen as having practical solutions.',
            '3/5': 'The Martyr/Heretic - You learn through experience and others expect you to have solutions.',
            '3/6': 'The Martyr/Role Model - You learn through trial and error and eventually become wise.',
            '4/6': 'The Opportunist/Role Model - You influence through your network and serve as an example.',
            '4/1': 'The Opportunist/Investigator - You share knowledge through personal connections.',
            '5/1': 'The Heretic/Investigator - You provide solutions based on solid research.',
            '5/2': 'The Heretic/Hermit - You\'re called upon for solutions but need alone time.',
            '6/2': 'The Role Model/Hermit - You develop wisdom over time and have natural gifts.',
            '6/3': 'The Role Model/Martyr - You go through three life phases and eventually embody wisdom.'
        };
        return profiles[profile] || `Profile ${profile} - Your unique life theme and learning style.`;
    }
    
    getGateName(gateNumber) {
        const gateNames = {
            '1': 'The Creative', '2': 'The Receptive', '3': 'Ordering', '4': 'Answers', '5': 'Fixed Rhythms',
            '6': 'Friction', '7': 'The Role of Self', '8': 'Contribution', '9': 'Focus', '10': 'Behavior of Self',
            '11': 'Ideas', '12': 'Caution', '13': 'The Listener', '14': 'Power Skills', '15': 'Extremes',
            '16': 'Skills', '17': 'Opinions', '18': 'Correction', '19': 'Wanting', '20': 'The Now',
            '21': 'The Hunter', '22': 'Grace', '23': 'Assimilation', '24': 'Return', '25': 'Spirit of Self',
            '26': 'The Egoist', '27': 'Caring', '28': 'The Player', '29': 'The Abysmal', '30': 'Recognition',
            '31': 'Influence', '32': 'Duration', '33': 'Privacy', '34': 'Power', '35': 'Change',
            '36': 'Darkening', '37': 'Friendship', '38': 'Opposition', '39': 'Provocation', '40': 'Aloneness',
            '41': 'Contraction', '42': 'Growth', '43': 'Insight', '44': 'Coming to Meet', '45': 'Gathering',
            '46': 'Determination', '47': 'Oppression', '48': 'The Well', '49': 'Principles', '50': 'Values',
            '51': 'The Arousing', '52': 'Inaction', '53': 'Beginnings', '54': 'Ambition', '55': 'Spirit',
            '56': 'Stimulation', '57': 'Intuitive Clarity', '58': 'Vitality', '59': 'Sexuality', '60': 'Acceptance',
            '61': 'Mystery', '62': 'Details', '63': 'Doubt', '64': 'Confusion'
        };
        return gateNames[gateNumber] || `Gate ${gateNumber}`;
    }
    
    generateAlignmentInsights(chart, quiz) {
        let insights = '<ul>';
        
        if (quiz.type === chart.type) {
            insights += '<li class="positive">✅ Your quiz responses align with your chart type - you\'re living authentically!</li>';
        } else {
            insights += '<li class="attention">⚠️ Your quiz suggests different patterns than your chart type - this may indicate conditioning or growth areas.</li>';
        }
        
        if (quiz.authority && quiz.authority.toLowerCase().includes(chart.authority.toLowerCase())) {
            insights += '<li class="positive">✅ Your decision-making patterns match your natural authority.</li>';
        } else {
            insights += '<li class="attention">⚠️ Consider experimenting with your chart\'s authority in decision-making.</li>';
        }
        
        insights += '</ul>';
        return insights;
    }
    
    getRelationshipInsights(chart) {
        let insights = '<ul>';
        
        if (chart.type === 'Generator') {
            insights += '<li>You thrive in relationships where you can respond and engage your energy</li>';
            insights += '<li>You need partners who respect your need to follow your gut responses</li>';
        } else if (chart.type === 'Projector') {
            insights += '<li>You need recognition and invitation in relationships</li>';
            insights += '<li>You excel at seeing your partner clearly and offering guidance</li>';
        } else if (chart.type === 'Manifestor') {
            insights += '<li>You need freedom and independence in relationships</li>';
            insights += '<li>Informing your partner about your actions reduces resistance</li>';
        } else if (chart.type === 'Reflector') {
            insights += '<li>You need time and space to feel into relationship decisions</li>';
            insights += '<li>You reflect the health of your relationships and community</li>';
        }
        
        insights += '</ul>';
        return insights;
    }
    
    getCommunicationStyle(chart) {
        if (chart.centers?.throat?.defined) {
            return 'You have a defined Throat center, giving you a consistent way of communicating and expressing yourself. You have reliable access to your voice.';
        } else {
            return 'You have an undefined Throat center, making you adaptable in how you communicate. You can adjust your communication style to different people and situations.';
        }
    }
    
    getCompatibilityNotes(chart) {
        return `As a ${chart.type}, you're most compatible with people who understand and respect your strategy and authority. Look for partners who appreciate your unique design and support your authentic expression.`;
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