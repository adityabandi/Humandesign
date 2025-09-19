// Technical Assessment Protocol System
class SystemAssessmentInterface {
    constructor() {
        this.assessmentQueries = [];
        this.currentQueryIndex = 0;
        this.responseData = {};
        this.systemState = 'initializing';
        this.assessmentId = this.generateAssessmentId();
        this.sessionMetrics = {
            startTime: Date.now(),
            responseLatencies: [],
            revisionCount: 0,
            accuracyIndicators: []
        };
        
        this.initializeAssessment();
    }
    
    generateAssessmentId() {
        const timestamp = Date.now();
        const randomComponent = Math.random().toString(36).substr(2, 9).toUpperCase();
        return `ASS-${timestamp.toString(36).toUpperCase()}-${randomComponent}`;
    }
    
    async initializeAssessment() {
        await this.loadAssessmentProtocol();
        this.restoreSessionProgress();
        this.renderCurrentQuery();
        this.updateSystemMetrics();
        this.setupInteractionListeners();
        
        // Track assessment initialization
        this.trackSystemEvent('assessment_protocol_initiated', {
            assessment_id: this.assessmentId,
            total_queries: this.assessmentQueries.length,
            protocol_version: '2.4.1'
        });
    }
    
    async loadAssessmentProtocol() {
        try {
            const response = await fetch('/assets/questions.json');
            const rawQuestions = await response.json();
            
            // Transform questions to match expected format
            this.assessmentQueries = rawQuestions.map(q => ({
                id: q.id.toString(), // Convert to string
                query: q.question || q.query, // Support both formats
                category: q.category,
                classification: q.classification || 'standard'
            }));
            
            this.systemState = 'protocol_loaded';
            console.log(`Loaded ${this.assessmentQueries.length} assessment queries`);
        } catch (error) {
            console.error('Protocol loading error:', error);
            this.assessmentQueries = this.getEmergencyProtocol();
            this.systemState = 'emergency_protocol';
        }
    }
    
    getEmergencyProtocol() {
        // Emergency fallback assessment queries
        return [
            {
                "id": "EQ001",
                "query": "Sustained energy activation occurs most efficiently through active engagement with environmental stimuli.",
                "category": "energy_dynamics",
                "classification": "core_framework"
            },
            {
                "id": "EQ002", 
                "query": "Decision-making processes require external recognition and formal invitation before implementation.",
                "category": "decision_architecture",
                "classification": "strategic_framework"
            },
            {
                "id": "EQ003",
                "query": "Internal response mechanisms provide immediate directional guidance without cognitive interference.",
                "category": "authority_systems",
                "classification": "operational_framework"
            }
        ];
    }
    
    restoreSessionProgress() {
        const sessionData = getFromLocalStorage('assessment_session');
        if (sessionData && sessionData.assessment_id === this.assessmentId) {
            this.responseData = sessionData.responses || {};
            this.currentQueryIndex = sessionData.currentQueryIndex || 0;
            this.sessionMetrics = { ...this.sessionMetrics, ...sessionData.metrics };
        }
    }
    
    persistSessionData() {
        const sessionData = {
            assessment_id: this.assessmentId,
            responses: this.responseData,
            currentQueryIndex: this.currentQueryIndex,
            metrics: this.sessionMetrics,
            timestamp: new Date().toISOString(),
            systemState: this.systemState
        };
        
        // Local storage persistence
        saveToLocalStorage('assessment_session', sessionData);
        
        // Database persistence if available
        if (window.database && this.currentQuery) {
            const queryId = this.currentQuery.id;
            const response = this.responseData[queryId];
            
            if (response) {
                window.database.saveAssessmentResponse(this.assessmentId, queryId, response)
                    .then(result => {
                        if (result.success) {
                            console.log(`Response archived: ${result.storage || 'database'}`);
                        }
                    })
                    .catch(error => {
                        console.log('Database archival failed, localStorage maintained:', error);
                    });
            }
        }
    }
    
    setupInteractionListeners() {
        // Response selection handlers
        document.addEventListener('change', (e) => {
            if (e.target.name === 'response_value') {
                this.processResponse(parseInt(e.target.value));
            }
        });
        
        // Navigation control handlers
        const previousControl = document.getElementById('previousQuery');
        const nextControl = document.getElementById('nextQuery');
        
        if (previousControl) {
            previousControl.addEventListener('click', () => this.navigatePrevious());
        }
        
        if (nextControl) {
            nextControl.addEventListener('click', () => this.navigateNext());
        }
        
        // Global compatibility functions
        window.navigatePreviousQuery = () => this.navigatePrevious();
        window.navigateNextQuery = () => this.navigateNext();
        window.submitAssessmentProtocol = () => this.finalizeAssessment();
    }
    
    renderCurrentQuery() {
        if (this.currentQueryIndex >= this.assessmentQueries.length) {
            this.displayAssessmentCompletion();
            return;
        }
        
        const currentQuery = this.assessmentQueries[this.currentQueryIndex];
        const queryDisplay = document.getElementById('queryStatement');
        const responseInputs = document.querySelectorAll('input[name="response_value"]');
        const previousControl = document.getElementById('previousQuery');
        const nextControl = document.getElementById('nextQuery');
        
        // Update query display
        if (queryDisplay) {
            queryDisplay.textContent = currentQuery.query;
        }
        
        // Update query metadata
        this.updateQueryMetadata(currentQuery);
        
        // Clear previous response selections
        responseInputs.forEach(input => {
            input.checked = false;
        });
        
        // Restore saved response if exists
        const savedResponse = this.responseData[currentQuery.id];
        if (savedResponse) {
            const savedInput = document.querySelector(`input[name="response_value"][value="${savedResponse}"]`);
            if (savedInput) {
                savedInput.checked = true;
            }
        }
        
        // Update navigation controls
        if (previousControl) {
            previousControl.disabled = this.currentQueryIndex === 0;
        }
        
        if (nextControl) {
            nextControl.disabled = !savedResponse;
        }
        
        this.updateSystemMetrics();
    }
    
    updateQueryMetadata(query) {
        const queryId = document.getElementById('queryId');
        const queryCategory = document.getElementById('queryCategory');
        const queryClassification = document.getElementById('queryClassification');
        
        if (queryId) queryId.textContent = query.id;
        if (queryCategory) queryCategory.textContent = query.category?.toUpperCase().replace('_', ' ');
        if (queryClassification) queryClassification.textContent = query.classification?.toUpperCase().replace('_', ' ');
    }
    
    processResponse(responseValue) {
        const responseStartTime = Date.now();
        const currentQuery = this.assessmentQueries[this.currentQueryIndex];
        
        // Record response
        this.responseData[currentQuery.id] = responseValue;
        
        // Calculate response latency
        const responseLatency = responseStartTime - (this.lastQueryRenderTime || responseStartTime);
        this.sessionMetrics.responseLatencies.push(responseLatency);
        
        // Enable navigation
        const nextControl = document.getElementById('nextQuery');
        if (nextControl) {
            nextControl.disabled = false;
        }
        
        // Persist session data
        this.persistSessionData();
        
        // Track response event
        this.trackSystemEvent('assessment_response_recorded', {
            assessment_id: this.assessmentId,
            query_id: currentQuery.id,
            query_index: this.currentQueryIndex + 1,
            response_value: responseValue,
            response_latency: responseLatency,
            category: currentQuery.category,
            classification: currentQuery.classification
        });
    }
    
    navigatePrevious() {
        if (this.currentQueryIndex > 0) {
            this.currentQueryIndex--;
            this.sessionMetrics.revisionCount++;
            this.renderCurrentQuery();
            
            this.trackSystemEvent('assessment_navigation', {
                assessment_id: this.assessmentId,
                direction: 'previous',
                query_index: this.currentQueryIndex + 1,
                revision_count: this.sessionMetrics.revisionCount
            });
        }
    }
    
    navigateNext() {
        const currentQuery = this.assessmentQueries[this.currentQueryIndex];
        const currentResponse = this.responseData[currentQuery.id];
        
        if (!currentResponse) {
            this.displayValidationAlert('RESPONSE REQUIRED: Please provide response value before proceeding to next query.');
            return;
        }
        
        // Track navigation before moving
        this.trackSystemEvent('assessment_navigation', {
            assessment_id: this.assessmentId,
            direction: 'next',
            query_index: this.currentQueryIndex + 1
        });
        
        // Only increment AFTER we know we're not on the last question
        if (this.currentQueryIndex < this.assessmentQueries.length - 1) {
            this.currentQueryIndex++;
            this.lastQueryRenderTime = Date.now();
            this.renderCurrentQuery();
        } else {
            // We're on the last question, go to completion
            this.displayAssessmentCompletion();
        }
    }
    
    updateSystemMetrics() {
        const progressIndicator = document.getElementById('assessmentProgress');
        const progressLabel = document.getElementById('progressLabel');
        const completionMetric = document.getElementById('completionPercentage');
        
        const completionPercentage = ((this.currentQueryIndex + 1) / this.assessmentQueries.length) * 100;
        
        if (progressIndicator) {
            progressIndicator.style.width = `${completionPercentage}%`;
        }
        
        if (progressLabel) {
            progressLabel.textContent = `QUERY ${this.currentQueryIndex + 1}/${this.assessmentQueries.length}`;
        }
        
        if (completionMetric) {
            completionMetric.textContent = `${Math.round(completionPercentage)}%`;
        }
        
        // Update session metrics display
        this.updateSessionMetricsDisplay();
    }
    
    updateSessionMetricsDisplay() {
        const metricsDisplay = document.querySelector('.session-metrics');
        if (metricsDisplay) {
            const sessionDuration = Date.now() - this.sessionMetrics.startTime;
            const averageLatency = this.sessionMetrics.responseLatencies.length > 0 
                ? this.sessionMetrics.responseLatencies.reduce((a, b) => a + b, 0) / this.sessionMetrics.responseLatencies.length 
                : 0;
            
            metricsDisplay.innerHTML = `
                <div class="metric-item">
                    <span class="metric-label">SESSION DURATION</span>
                    <span class="metric-value">${this.formatDuration(sessionDuration)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">AVG RESPONSE TIME</span>
                    <span class="metric-value">${Math.round(averageLatency)}ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">REVISION COUNT</span>
                    <span class="metric-value">${this.sessionMetrics.revisionCount}</span>
                </div>
            `;
        }
    }
    
    displayAssessmentCompletion() {
        const assessmentInterface = document.getElementById('assessmentInterface');
        const completionInterface = document.getElementById('assessmentCompletion');
        
        if (assessmentInterface) {
            assessmentInterface.style.display = 'none';
        }
        
        if (completionInterface) {
            completionInterface.classList.remove('hidden');
        }
        
        // Calculate final metrics
        const sessionDuration = Date.now() - this.sessionMetrics.startTime;
        const totalResponses = Object.keys(this.responseData).length;
        
        this.trackSystemEvent('assessment_protocol_completed', {
            assessment_id: this.assessmentId,
            total_queries: this.assessmentQueries.length,
            total_responses: totalResponses,
            session_duration: sessionDuration,
            completion_rate: (totalResponses / this.assessmentQueries.length) * 100,
            system_state: this.systemState
        });
    }
    
    calculateSystemConfiguration() {
        const configurationScores = {
            generator_indicators: 0,
            manifestor_indicators: 0,
            projector_indicators: 0,
            reflector_indicators: 0,
            emotional_authority: 0,
            sacral_authority: 0,
            splenic_authority: 0,
            projected_authority: 0,
            center_definitions: {},
            strategic_indicators: {}
        };
        
        // Process response data for configuration analysis
        Object.entries(this.responseData).forEach(([queryId, responseValue]) => {
            const query = this.assessmentQueries.find(q => q.id === queryId);
            if (!query) return;
            
            const responseWeight = responseValue; // 1-5 scale
            
            // Configuration scoring based on actual question categories
            switch (query.category) {
                case 'energy_type':
                case 'generator_traits':
                case 'sacral_defined':
                    configurationScores.generator_indicators += responseWeight;
                    break;
                case 'manifestor_traits':
                case 'throat_defined':
                    configurationScores.manifestor_indicators += responseWeight;
                    break;
                case 'projector_traits':
                case 'guidance_systems':
                case 'recognition_patterns':
                case 'systems_thinking':
                    configurationScores.projector_indicators += responseWeight;
                    break;
                case 'reflector_traits':
                case 'environmental_sensitivity':
                case 'energy_sensitivity':
                    configurationScores.reflector_indicators += responseWeight;
                    break;
                case 'emotional_authority':
                case 'emotional_response':
                case 'emotional_expression':
                case 'emotional_undefined':
                    configurationScores.emotional_authority += responseWeight;
                    break;
                case 'sacral_authority':
                case 'gut_response_systems':
                case 'sacral_undefined':
                    configurationScores.sacral_authority += responseWeight;
                    break;
                case 'spleen_authority':
                case 'spleen_defined':
                case 'intuitive_authority':
                case 'intuitive_perception':
                case 'intuitive_trust':
                    configurationScores.splenic_authority += responseWeight;
                    break;
                case 'throat_authority':
                case 'vocal_truth_detection':
                    configurationScores.projected_authority += responseWeight;
                    break;
            }
        });
        
        // Determine primary energy type
        const energyTypeScores = {
            'Generator': configurationScores.generator_indicators,
            'Manifestor': configurationScores.manifestor_indicators,
            'Projector': configurationScores.projector_indicators,
            'Reflector': configurationScores.reflector_indicators
        };
        
        const primaryEnergyType = Object.keys(energyTypeScores).reduce((a, b) => 
            energyTypeScores[a] > energyTypeScores[b] ? a : b
        );
        
        // Determine decision authority
        const authorityScores = {
            'Emotional': configurationScores.emotional_authority,
            'Sacral': configurationScores.sacral_authority,
            'Splenic': configurationScores.splenic_authority,
            'Self-Projected': configurationScores.projected_authority
        };
        
        const primaryAuthority = Object.keys(authorityScores).reduce((a, b) => 
            authorityScores[a] > authorityScores[b] ? a : b
        );
        
        // Generate profile architecture (systematic assignment)
        const profileArchitectures = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
        const profileSeed = this.assessmentId.charCodeAt(4) % profileArchitectures.length;
        const profileArchitecture = profileArchitectures[profileSeed];
        
        return {
            energyType: primaryEnergyType,
            decisionAuthority: primaryAuthority,
            profileArchitecture: profileArchitecture,
            configurationScores: configurationScores,
            energyTypeScores: energyTypeScores,
            authorityScores: authorityScores,
            assessment_id: this.assessmentId,
            systemMetrics: this.sessionMetrics,
            totalResponses: Object.keys(this.responseData).length
        };
    }
    
    displayValidationAlert(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'system-alert validation-alert';
        alertContainer.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">⚠</div>
                <div class="alert-message">${message}</div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(alertContainer);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.parentNode.removeChild(alertContainer);
            }
        }, 5000);
    }
    
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }
    
    trackSystemEvent(eventType, eventData) {
        trackEvent(eventType, {
            ...eventData,
            timestamp: new Date().toISOString(),
            protocol_version: '2.4.1'
        });
    }
}

// Assessment finalization and results processing
async function finalizeAssessment() {
    if (window.systemAssessment) {
        const configuration = window.systemAssessment.calculateSystemConfiguration();
        
        // Archive results to local storage
        saveToLocalStorage('assessment_results', configuration);
        
        // Archive to database if available
        if (window.database) {
            try {
                const dbResult = await window.database.saveAssessmentResults(configuration.assessment_id, configuration);
                if (dbResult.success) {
                    console.log(`Configuration archived: ${dbResult.storage || 'database'}`);
                } else {
                    console.log('Configuration archived to localStorage only');
                }
            } catch (error) {
                console.log('Database archival failed, localStorage maintained:', error);
            }
        }
        
        window.systemAssessment.trackSystemEvent('assessment_finalized', {
            assessment_id: configuration.assessment_id,
            energy_type: configuration.energyType,
            decision_authority: configuration.decisionAuthority,
            profile_architecture: configuration.profileArchitecture,
            session_id: window.database ? window.database.getCurrentSessionId() : 'local_session'
        });
        
        // Navigate to results analysis
        window.location.href = '/results.html';
    }
}

// System initialization
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('assessmentInterface')) {
        window.systemAssessment = new SystemAssessmentInterface();
    }
});