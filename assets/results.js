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
            document.title = `${user.name}'s Personality Report`;
        }
        
        // Render Big 5 personality results first
        this.renderBig5Results(quiz);
        
        // Render chart visualization
        this.renderChartVisualization(chart);
        
        // Render main results
        this.renderQuizResults(quiz);
        this.renderChartResults(chart);
        this.renderInsights(insights);
        
        // Render mismatch analysis preview
        this.renderMismatchAnalysis(quiz, chart);
        
        // Set up interactive features
        this.setupTabs();
        this.setupChartInteractions();
        
        // Show purchase status
        this.updatePurchaseStatus(purchased);
        
        // Add print functionality
        this.setupPrintButton();
    }
    
    renderBig5Results(quiz) {
        if (!quiz || !quiz.detailed || !quiz.detailed.percentileScores) {
            console.log('No Big 5 data available:', quiz);
            return;
        }
        
        const scores = quiz.detailed.percentileScores;
        const interpretations = quiz.detailed.interpretations;
        
        // Update personality summary
        const personalitySummary = document.getElementById('personalitySummary');
        if (personalitySummary && quiz.summary) {
            personalitySummary.innerHTML = `
                <h3>Your Personality Profile</h3>
                <p>${quiz.summary.overallProfile || 'Your unique personality assessment is complete.'}</p>
                <div class="summary-scores">
                    <strong>Big 5 Scores:</strong> ${quiz.profile || 'Loading...'}
                </div>
            `;
        }
        
        // Update each trait
        const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        
        traits.forEach(trait => {
            const score = scores[trait] || 0;
            const interpretation = interpretations[trait] || {};
            
            // Update score display
            const scoreElement = document.getElementById(`${trait}Score`);
            if (scoreElement) {
                scoreElement.textContent = `${score}%`;
            }
            
            // Update progress bar
            const fillElement = document.getElementById(`${trait}Fill`);
            if (fillElement) {
                setTimeout(() => {
                    fillElement.style.width = `${score}%`;
                    
                    // Color the bar based on score
                    if (score >= 70) {
                        fillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
                    } else if (score >= 40) {
                        fillElement.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
                    } else {
                        fillElement.style.background = 'linear-gradient(90deg, #f44336, #FF5722)';
                    }
                }, 500);
            }
            
            // Update description
            const descElement = document.getElementById(`${trait}Description`);
            if (descElement) {
                descElement.textContent = interpretation.description || `Your ${trait} score is ${score}%.`;
            }
        });
    }
    
    renderChartVisualization(chart) {
        if (!chart) return;
        
        // Update chart centers with gates and channels
        this.updateChartCenters(chart);
        
        // Render active gates
        this.renderActiveGates(chart);
        
        // Render channels
        this.renderChannels(chart);
        
        // Update chart details panel
        this.updateChartDetails(chart);
        
        // Update centers analysis
        this.renderCentersAnalysis(chart);
    }
    
    updateChartCenters(chart) {
        // Define all centers with their complete gate arrays
        const centersData = {
            head: { 
                defined: chart.centers?.head?.defined || false, 
                gates: ['64', '61'],
                activeGates: chart.activatedGates?.filter(g => ['64', '61'].includes(g.toString())) || []
            },
            ajna: { 
                defined: chart.centers?.ajna?.defined || false, 
                gates: ['47', '24', '4', '17', '43', '11'],
                activeGates: chart.activatedGates?.filter(g => ['47', '24', '4', '17', '43', '11'].includes(g.toString())) || []
            },
            throat: { 
                defined: chart.centers?.throat?.defined || false, 
                gates: ['62', '23', '56', '35', '12', '45', '33', '8', '31', '20', '16'],
                activeGates: chart.activatedGates?.filter(g => ['62', '23', '56', '35', '12', '45', '33', '8', '31', '20', '16'].includes(g.toString())) || []
            },
            g: { 
                defined: chart.centers?.g?.defined || false, 
                gates: ['7', '1', '13', '10', '15', '2', '46', '25'],
                activeGates: chart.activatedGates?.filter(g => ['7', '1', '13', '10', '15', '2', '46', '25'].includes(g.toString())) || []
            },
            heart: { 
                defined: chart.centers?.heart?.defined || false, 
                gates: ['21', '40', '26', '51'],
                activeGates: chart.activatedGates?.filter(g => ['21', '40', '26', '51'].includes(g.toString())) || []
            },
            spleen: { 
                defined: chart.centers?.spleen?.defined || false, 
                gates: ['50', '32', '28', '18', '57', '44', '48'],
                activeGates: chart.activatedGates?.filter(g => ['50', '32', '28', '18', '57', '44', '48'].includes(g.toString())) || []
            },
            sacral: { 
                defined: chart.centers?.sacral?.defined || false, 
                gates: ['5', '14', '29', '59', '9', '3', '42', '27', '34'],
                activeGates: chart.activatedGates?.filter(g => ['5', '14', '29', '59', '9', '3', '42', '27', '34'].includes(g.toString())) || []
            },
            solar: { 
                defined: chart.centers?.solar?.defined || false, 
                gates: ['6', '37', '63', '22', '36', '30', '55'],
                activeGates: chart.activatedGates?.filter(g => ['6', '37', '63', '22', '36', '30', '55'].includes(g.toString())) || []
            },
            root: { 
                defined: chart.centers?.root?.defined || false, 
                gates: ['54', '58', '38', '39', '53', '60', '52', '19', '41'],
                activeGates: chart.activatedGates?.filter(g => ['54', '58', '38', '39', '53', '60', '52', '19', '41'].includes(g.toString())) || []
            }
        };
        
        // Update each center in the visualization
        Object.keys(centersData).forEach(centerName => {
            const centerElement = document.querySelector(`[data-center="${centerName}"]`);
            const centerData = centersData[centerName];
            
            if (centerElement) {
                // Set defined/undefined state
                if (centerData.defined) {
                    centerElement.classList.add('defined');
                    centerElement.classList.remove('undefined');
                } else {
                    centerElement.classList.add('undefined');
                    centerElement.classList.remove('defined');
                }
                
                // Add click handler for center details
                centerElement.addEventListener('click', () => {
                    this.showCenterModal(centerName, centerData, chart);
                });
                
                // Add tooltip with center information
                this.addCenterTooltip(centerElement, centerName, centerData);
            }
        });
    }

    renderActiveGates(chart) {
        // Get activated gates from chart data
        const activatedGates = chart.activatedGates || this.generateSampleActivatedGates(chart);
        
        // Mark all gates as active that are in the activated gates list
        activatedGates.forEach(gateNumber => {
            const gateElement = document.querySelector(`.gate-${gateNumber}`);
            if (gateElement) {
                gateElement.classList.add('active');
                gateElement.title = `Gate ${gateNumber} - ${this.getGateName(gateNumber)}`;
            }
        });
    }

    generateSampleActivatedGates(chart) {
        // Generate sample activated gates based on defined centers
        const activatedGates = [];
        const centers = chart.centers || {};
        
        // Add some sample gates for defined centers
        Object.keys(centers).forEach(centerName => {
            if (centers[centerName]?.defined) {
                switch(centerName) {
                    case 'sacral':
                        activatedGates.push(34, 5, 14, 29);
                        break;
                    case 'throat':
                        activatedGates.push(31, 8, 33, 20);
                        break;
                    case 'g':
                        activatedGates.push(7, 1, 10, 25);
                        break;
                    case 'spleen':
                        activatedGates.push(50, 32, 57, 48);
                        break;
                    case 'root':
                        activatedGates.push(58, 38, 54, 19);
                        break;
                    case 'heart':
                        activatedGates.push(21, 40);
                        break;
                    case 'solar':
                        activatedGates.push(22, 36, 6);
                        break;
                    case 'ajna':
                        activatedGates.push(24, 47, 4);
                        break;
                    case 'head':
                        activatedGates.push(64, 61);
                        break;
                }
            }
        });
        
        return activatedGates;
    }

    updateChartDetails(chart) {
        // Update the chart details panel with comprehensive information
        const chartType = document.getElementById('chartType');
        const chartAuthority = document.getElementById('chartAuthority');
        const chartProfile = document.getElementById('chartProfile');
        const chartStrategy = document.getElementById('chartStrategy');
        const chartDefinition = document.getElementById('chartDefinition');
        
        if (chartType) chartType.textContent = chart.type || 'Generator';
        if (chartAuthority) chartAuthority.textContent = chart.authority || 'Sacral';
        if (chartProfile) chartProfile.textContent = chart.profile || '1/3';
        if (chartStrategy) chartStrategy.textContent = this.getStrategyText(chart.type);
        if (chartDefinition) chartDefinition.textContent = this.getDefinitionText(chart);
    }

    getDefinitionText(chart) {
        const definedCenters = Object.keys(chart.centers || {}).filter(center => 
            chart.centers[center]?.defined
        );
        
        const totalCenters = 9;
        const definedCount = definedCenters.length;
        
        if (definedCount === 0) return 'No Definition';
        if (definedCount === 1) return 'Single Definition';
        if (definedCount <= 3) return 'Simple Definition';
        if (definedCount <= 6) return 'Complex Definition';
        return 'Quad Definition';
    }

    showCenterModal(centerName, centerData, chart) {
        // Create detailed modal for center information
        const modal = document.createElement('div');
        modal.className = 'center-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${centerName.charAt(0).toUpperCase() + centerName.slice(1)} Center</h3>
                    <button class="modal-close" onclick="this.closest('.center-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="center-status ${centerData.defined ? 'defined' : 'undefined'}">
                        ${centerData.defined ? 'Defined' : 'Undefined'}
                    </div>
                    <p>${this.getCenterDescription(centerName)}</p>
                    
                    <div class="center-gates">
                        <h4>Gates in this Center:</h4>
                        <div class="gates-list">
                            ${centerData.gates.map(gate => `
                                <span class="gate-detail ${centerData.activeGates && centerData.activeGates.includes(gate) ? 'active' : ''}">
                                    ${gate} - ${this.getGateName(gate)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${centerData.defined ? `
                        <div class="center-guidance">
                            <h4>Living Your Design:</h4>
                            <p>${this.getCenterGuidance(centerName, true)}</p>
                        </div>
                    ` : `
                        <div class="center-guidance">
                            <h4>Wisdom & Conditioning:</h4>
                            <p>${this.getCenterGuidance(centerName, false)}</p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    getCenterDescription(centerName) {
        const descriptions = {
            'head': 'The center of mental pressure, inspiration, and the drive to answer questions. This is where concepts and ideas are born.',
            'ajna': 'The center of mental processing, analysis, and conceptualization. This is where you process information and form opinions.',
            'throat': 'The center of communication, manifestation, and expression. This is how you bring your inner world into reality.',
            'g': 'The center of identity, direction, and love. This is your sense of self and your direction in life.',
            'heart': 'The center of willpower, ego, and the material world. This is your capacity for commitment and promises.',
            'spleen': 'The center of intuition, survival instincts, and health. This is your body wisdom and spontaneous knowing.',
            'sacral': 'The center of life force energy, sexuality, and work. This is your vital energy and capacity for sustainable work.',
            'solar': 'The center of emotions, feelings, and sensitivity. This is your emotional wave and depth of feeling.',
            'root': 'The center of pressure, stress, and adrenaline. This is your driving force and motivation to act.'
        };
        return descriptions[centerName] || 'Energy center governing specific life themes.';
    }

    getCenterGuidance(centerName, defined) {
        const guidance = {
            'head': {
                defined: 'Trust your natural mental pressure and inspiration. You have consistent access to questions that need answering.',
                undefined: 'Be selective about what questions you take on. Your open head amplifies mental pressure from others.'
            },
            'ajna': {
                defined: 'Trust your consistent way of processing information and forming concepts. Your mental processing is reliable.',
                undefined: 'Stay flexible in your thinking. Your open mind can see from many different perspectives.'
            },
            'throat': {
                defined: 'You have a consistent way of communicating and expressing yourself. Trust your voice.',
                undefined: 'Wait for the right timing and invitation to speak. Your throat amplifies the voices of others.'
            },
            'g': {
                defined: 'Trust your consistent sense of identity and direction. You know who you are and where you\'re going.',
                undefined: 'Your identity is fluid and adaptive. You find yourself through relationships and environments.'
            },
            'heart': {
                defined: 'Trust your willpower and only make promises you can keep. Your ego energy is consistent.',
                undefined: 'Be careful about making promises and commitments. Your will varies and can be influenced by others.'
            },
            'spleen': {
                defined: 'Trust your intuitive insights and body wisdom. Your survival instincts are reliable.',
                undefined: 'Pay attention to what feels healthy vs unhealthy. Your intuition is enhanced by being around others.'
            },
            'sacral': {
                defined: 'Trust your gut responses to life. You have consistent life force energy for work and creativity.',
                undefined: 'Don\'t overcommit your energy. Rest when you need to and be selective about your involvements.'
            },
            'solar': {
                defined: 'Honor your emotional wave. Wait for emotional clarity before making important decisions.',
                undefined: 'Don\'t take on others\' emotions as your own. Create space to feel your own emotional truth.'
            },
            'root': {
                defined: 'You have consistent access to pressure and drive. Use this energy to fuel your actions.',
                undefined: 'Don\'t let external pressures rush you. Take time to feel what pressure is truly yours.'
            }
        };
        
        return guidance[centerName]?.[defined ? 'defined' : 'undefined'] || 'Follow your strategy and authority.';
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
        // Update existing result card elements
        const resultTypeEl = document.getElementById('resultType');
        const resultAuthorityEl = document.getElementById('resultAuthority');
        const resultProfileEl = document.getElementById('resultProfile');
        const typeDescriptionEl = document.getElementById('typeDescription');
        const authorityDescriptionEl = document.getElementById('authorityDescription');
        const profileDescriptionEl = document.getElementById('profileDescription');
        
        if (resultTypeEl) resultTypeEl.textContent = quiz.type || 'Calculating...';
        if (resultAuthorityEl) resultAuthorityEl.textContent = quiz.authority || 'Calculating...';
        if (resultProfileEl) resultProfileEl.textContent = quiz.profile || 'Calculating...';
        
        if (typeDescriptionEl) typeDescriptionEl.textContent = this.getTypeDescription(quiz.type);
        if (authorityDescriptionEl) authorityDescriptionEl.textContent = this.getAuthorityDescription(quiz.authority);
        if (profileDescriptionEl) profileDescriptionEl.textContent = this.getProfileDescription(quiz.profile);
    }
    
    renderChartResults(chart) {
        // Update existing result card elements with chart data
        const resultTypeEl = document.getElementById('resultType');
        const resultAuthorityEl = document.getElementById('resultAuthority');
        const resultProfileEl = document.getElementById('resultProfile');
        const typeDescriptionEl = document.getElementById('typeDescription');
        const authorityDescriptionEl = document.getElementById('authorityDescription');
        const profileDescriptionEl = document.getElementById('profileDescription');
        
        if (resultTypeEl) resultTypeEl.textContent = chart.type || 'Calculating...';
        if (resultAuthorityEl) resultAuthorityEl.textContent = chart.authority || 'Calculating...';
        if (resultProfileEl) resultProfileEl.textContent = chart.profile || 'Calculating...';
        
        if (typeDescriptionEl) typeDescriptionEl.textContent = this.getStrategyDetailedDescription(chart.type);
        if (authorityDescriptionEl) authorityDescriptionEl.textContent = this.getAuthorityDescription(chart.authority);
        if (profileDescriptionEl) profileDescriptionEl.textContent = this.getProfileDescription(chart.profile);
    }
    
    renderInsights(insights) {
        const insightsContent = document.getElementById('insightsContent');
        if (!insightsContent) return;
        
        const insightsList = insights.map(insight => 
            `<li class="insight-item">${insight}</li>`
        ).join('');
        
        insightsContent.innerHTML = `
            <div class="result-card">
                <h3>Quiz & Chart Integration</h3>
                <ul class="insights-list">
                    ${insightsList}
                </ul>
            </div>
        `;
    }
    
    setupBuyButtons() {
        // Set up buy button functionality
        const buyButtons = document.querySelectorAll('.buy-button, .cta-button[href*="buy"]');
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add the result ID to the buy URL for tracking
                const href = button.getAttribute('href');
                if (href && !href.includes('result_id=')) {
                    const separator = href.includes('?') ? '&' : '?';
                    button.setAttribute('href', `${href}${separator}result_id=${this.publicId}`);
                }
            });
        });
    }

    setupTabs() {
        // Set up tab functionality if tabs exist
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    
                    // Load content for specific tabs
                    this.loadTabContent(targetTab);
                }
            });
        });
    }

    loadTabContent(tabId) {
        // Load specific content based on tab
        switch(tabId) {
            case 'chartTab':
                this.loadChartContent(this.resultData.chart);
                break;
            case 'strategyTab':
                this.loadStrategyContent(this.resultData.chart, this.resultData.quiz);
                break;
            case 'relationshipsTab':
                this.loadRelationshipsContent(this.resultData.chart);
                break;
        }
    }

    updatePurchaseStatus(purchased) {
        // Update purchase-related UI elements
        const purchaseElements = document.querySelectorAll('.purchase-required');
        const fullReportElements = document.querySelectorAll('.full-report-only');
        const purchaseButtons = document.querySelectorAll('.purchase-button');
        
        if (purchased) {
            // User has purchased, show full content
            purchaseElements.forEach(el => el.style.display = 'block');
            fullReportElements.forEach(el => el.style.display = 'block');
            purchaseButtons.forEach(btn => btn.style.display = 'none');
            
            // Add purchased badge
            const resultsHeader = document.querySelector('.results-header');
            if (resultsHeader && !resultsHeader.querySelector('.purchased-badge')) {
                const badge = document.createElement('div');
                badge.className = 'purchased-badge';
                badge.innerHTML = '✓ Full Report Activated';
                resultsHeader.appendChild(badge);
            }
        } else {
            // User hasn't purchased, show preview with purchase prompts
            purchaseElements.forEach(el => el.style.display = 'none');
            fullReportElements.forEach(el => el.style.display = 'none');
            purchaseButtons.forEach(btn => btn.style.display = 'block');
        }
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
    
    renderMismatchAnalysis(quiz, chart) {
        // Render psychological profile with more compelling descriptions
        if (quiz) {
            const psychType = document.getElementById('psychType');
            const psychAuthority = document.getElementById('psychAuthority');
            const psychPattern = document.getElementById('psychPattern');
            
            if (psychType) psychType.textContent = this.getConditionedType(quiz.type) || 'Operating from conditioning';
            if (psychAuthority) psychAuthority.textContent = this.getConditionedAuthority(quiz.authority) || 'Mind-based decisions';
            if (psychPattern) psychPattern.textContent = quiz.energyPattern || 'Struggling with energy flow';
        }
        
        // Render actual design with authentic descriptions
        if (chart) {
            const designType = document.getElementById('designType');
            const designAuthority = document.getElementById('designAuthority');
            const designStrategy = document.getElementById('designStrategy');
            
            if (designType) designType.textContent = chart.type || 'Authentic Type Revealed';
            if (designAuthority) designAuthority.textContent = chart.authority || 'True Decision-Making';
            if (designStrategy) designStrategy.textContent = this.getStrategy(chart.type) || 'Natural Life Strategy';
        }
        
        // Render breakthrough insights with specific nuggets
        this.renderBreakthroughInsights(quiz, chart);
    }
    
    getConditionedType(type) {
        const conditioned = {
            'Generator': 'Pushing and forcing instead of responding',
            'Manifestor': 'Waiting for permission instead of initiating',
            'Projector': 'Working like a Generator instead of waiting for invitation',
            'Reflector': 'Making quick decisions instead of waiting a lunar cycle'
        };
        return conditioned[type] || 'Living from mental conditioning';
    }
    
    getConditionedAuthority(authority) {
        const conditioned = {
            'Emotional': 'Making decisions when emotional',
            'Sacral': 'Ignoring gut feelings',
            'Splenic': 'Overthinking intuitive hits',
            'Ego': 'Making promises you can\'t keep',
            'Self-Projected': 'Not trusting your voice',
            'Mental': 'Trying to know everything'
        };
        return conditioned[authority] || 'Making decisions from the mind';
    }
    
    getStrategy(type) {
        const strategies = {
            'Generator': 'Respond to Life',
            'Manifestor': 'Initiate & Inform',
            'Projector': 'Wait for Invitation',
            'Reflector': 'Wait a Lunar Cycle'
        };
        return strategies[type] || 'Align with Your Nature';
    }
    
    renderBreakthroughInsights(quiz, chart) {
        const mismatchContent = document.getElementById('mismatchContent');
        const previewNuggets = document.getElementById('previewNuggets');
        
        if (!mismatchContent || !quiz || !chart) return;
        
        const insights = [];
        const nuggets = [];
        
        // Generate specific breakthrough insights
        if (quiz.type && chart.type && quiz.type !== chart.type) {
            insights.push(`🔥 <strong>Major Discovery:</strong> Your quiz shows you're operating like a ${quiz.type}, but your birth chart reveals you're actually a ${chart.type}. This explains why forcing things feels so exhausting!`);
            nuggets.push(`Your energy type determines how you're meant to interact with opportunities`);
        }
        
        if (quiz.authority && chart.authority && quiz.authority !== chart.authority) {
            insights.push(`⚡ <strong>Decision-Making Revolution:</strong> You've been making decisions with ${quiz.authority} energy, but your true authority is ${chart.authority}. No wonder some choices haven't worked out!`);
            nuggets.push(`Your inner authority is your personal GPS for making correct decisions`);
        }
        
        // Add location-specific insights
        if (chart.positions && chart.positions.sun) {
            insights.push(`🌟 <strong>Your Unique Gift:</strong> Gate ${Math.floor(chart.positions.sun.gate)} is activated by your Sun, giving you a specific life theme that most people don't understand about you.`);
            nuggets.push(`Your Sun gate reveals your core life purpose and how you're meant to shine`);
        }
        
        // Add general breakthrough insights if no specific mismatches
        if (insights.length === 0) {
            insights.push(`🎯 <strong>Alignment Opportunity:</strong> Your responses reveal conditioning patterns that are masking your natural gifts. Your birth chart shows exactly how to break free from these patterns.`);
            insights.push(`💎 <strong>Hidden Potential:</strong> You have specific gates and channels that activate when you align with your design - creating effortless success and fulfillment.`);
        }
        
        // Add powerful deconditioning insights
        insights.push(`🚀 <strong>Your Transformation Path:</strong> Your complete report reveals the exact conditioning patterns blocking your success and the specific steps to reclaim your authentic power.`);
        
        mismatchContent.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
        
        // Update nuggets with dynamic content
        if (previewNuggets) {
            const nuggetElements = previewNuggets.querySelectorAll('.nugget span:last-child');
            nuggetElements.forEach((element, index) => {
                if (nuggets[index]) {
                    element.textContent = nuggets[index];
                } else {
                    // Default compelling nuggets
                    const defaultNuggets = [
                        `Your chart reveals the exact centers where you've been conditioned away from your truth`,
                        `You have unique gifts that only emerge when you stop trying to be someone else`,
                        `There's a specific way you're designed to make decisions that bypasses mental confusion`
                    ];
                    element.textContent = defaultNuggets[index] || defaultNuggets[0];
                }
            });
        }
    }
    
    showError(message) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <h2>Unable to Load Results</h2>
                        <p>${message}</p>
                        <a href="quiz.html" class="btn btn-primary">Take Quiz Again</a>
                    </div>
                </div>
            `;
        }
    }

    getTypeDescription(type) {
        const descriptions = {
            'Generator': 'You have consistent life force energy and respond to life with your gut instinct.',
            'Manifestor': 'You are here to initiate and make things happen. You inform others of your actions.',
            'Projector': 'You have a gift for seeing others clearly and guiding them. You wait for invitation.',
            'Reflector': 'You reflect the health of your community and take time to feel into decisions.'
        };
        return descriptions[type] || 'Your unique energy type and how you interact with the world.';
    }
}

// Tab functionality for detailed analysis
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Center hover effects
    const centers = document.querySelectorAll('.center');
    centers.forEach(center => {
        center.addEventListener('click', () => {
            const centerName = center.dataset.center;
            showCenterModal(centerName);
        });
    });
});

function showCenterModal(centerName) {
    // Create modal for center details
    const modal = document.createElement('div');
    modal.className = 'center-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${centerName.charAt(0).toUpperCase() + centerName.slice(1)} Center</h3>
                <button class="modal-close" onclick="this.closest('.center-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="center-status ${Math.random() > 0.5 ? 'defined' : 'undefined'}">
                    ${Math.random() > 0.5 ? 'Defined' : 'Undefined'}
                </div>
                <p>This center governs ${getCenterDescription(centerName)}.</p>
                <div class="center-gates">
                    <h4>Active Gates:</h4>
                    <div class="gates-list">
                        ${generateRandomGates().map(gate => `<span class="gate-number">${gate}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function getCenterDescription(centerName) {
    const descriptions = {
        'head': 'mental pressure, inspiration, and conceptual thinking',
        'ajna': 'mental processing, analysis, and conceptualization',
        'throat': 'communication, manifestation, and expression',
        'g': 'identity, direction, and love',
        'heart': 'willpower, ego, and material world',
        'spleen': 'intuition, survival instincts, and health',
        'sacral': 'life force energy, sexuality, and work',
        'solar': 'emotions, feelings, and sensitivity',
        'root': 'pressure, stress, and adrenaline'
    };
    return descriptions[centerName] || 'energy and consciousness';
}

function generateRandomGates() {
    const gates = [];
    const numGates = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numGates; i++) {
        gates.push(Math.floor(Math.random() * 64) + 1);
    }
    return gates;
}

// Make markPurchase globally available for buy flow
window.markPurchase = markPurchase;

// Track purchase intent for analytics
function trackPurchaseIntent() {
    try {
        // Track analytics event if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase_intent', {
                'event_category': 'conversion',
                'event_label': 'full_report_cta',
                'value': 29
            });
        }
        
        // Track to console for debugging
        console.log('Purchase intent tracked:', {
            page: 'results',
            product: 'full_personality_report',
            price: 29,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log('Analytics tracking error:', error);
    }
}

// Make function globally available
window.trackPurchaseIntent = trackPurchaseIntent;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resultsDisplay = new ResultsDisplay();
});

export { ResultsDisplay };