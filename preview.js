// Technical Analysis Preview System
class AnalysisPreviewInterface {
    constructor() {
        this.currentModule = 'core-framework';
        this.userConfiguration = null;
        this.systemMetrics = {
            viewTime: Date.now(),
            moduleViews: {},
            interactionCount: 0
        };
        this.initializeSystem();
    }

    async initializeSystem() {
        this.loadUserConfiguration();
        this.setupSystemListeners();
        this.renderPersonalizedContent();
        this.trackSystemAccess();
    }

    loadUserConfiguration() {
        // Retrieve user assessment results from storage
        this.userConfiguration = getFromLocalStorage('assessment_results');
        
        if (!this.userConfiguration) {
            // Fallback configuration for demonstration
            this.userConfiguration = {
                energyType: 'Generator',
                decisionAuthority: 'Sacral',
                profileArchitecture: '1/3',
                centerConfiguration: {
                    sacral: true,
                    throat: true,
                    will: true,
                    emotional: false,
                    identity: false,
                    head: false,
                    ajna: false,
                    spleen: false,
                    root: false
                },
                activationGates: [],
                channels: [],
                definition: 'single'
            };
        }
    }

    setupSystemListeners() {
        // Module navigation system
        const moduleButtons = document.querySelectorAll('.module-tab');
        moduleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const moduleId = e.target.getAttribute('data-module');
                this.loadModule(moduleId);
                this.systemMetrics.interactionCount++;
            });
        });

        // Advanced intersection observer for module tracking
        const moduleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const moduleId = entry.target.getAttribute('data-module');
                    this.trackModuleView(moduleId);
                }
            });
        }, { 
            threshold: 0.6,
            rootMargin: '-50px 0px'
        });

        // Observe all analysis modules
        document.querySelectorAll('.analysis-module').forEach(module => {
            moduleObserver.observe(module);
        });

        // System interaction tracking
        document.addEventListener('click', (e) => {
            if (e.target.matches('.access-control, .unlock-module, .upgrade-interface')) {
                this.trackSystemInteraction(e.target.className, {
                    module: this.currentModule,
                    timestamp: Date.now()
                });
            }
        });
    }

    renderPersonalizedContent() {
        this.updateSystemIdentifiers();
        this.renderEnergyTypeAnalysis();
        this.renderAuthorityFramework();
        this.renderCenterMapping();
        this.renderStrategicOptimization();
        this.renderCompatibilityMatrix();
        this.updateSystemMetrics();
    }

    updateSystemIdentifiers() {
        // Update dynamic content with user configuration
        const identifierElements = {
            '#config-energy-type': this.userConfiguration.energyType,
            '#config-authority': this.userConfiguration.decisionAuthority,
            '#config-profile': this.userConfiguration.profileArchitecture,
            '#system-definition': this.userConfiguration.definition || 'single'
        };

        Object.entries(identifierElements).forEach(([selector, value]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.textContent = value;
            });
        });
    }

    renderEnergyTypeAnalysis() {
        const strategicFrameworks = {
            'Generator': {
                strategy: "RESPONSE PROTOCOL: Systematic activation through environmental stimuli. Wait for external triggers, then respond using sacral intelligence. Energy sustainability achieved through correct response patterns.",
                mechanics: "Sacral motor provides consistent energy output when correctly engaged. Response mechanism bypasses mental interference, ensuring authentic energetic alignment.",
                optimization: "Monitor satisfaction levels as primary success metric. Frustration indicates incorrect engagement patterns requiring strategic recalibration."
            },
            'Manifestor': {
                strategy: "INITIATION PROTOCOL: Independent action capability with strategic communication requirements. Inform affected parties before implementation to minimize resistance patterns.",
                mechanics: "Closed and repelling aura creates natural independence. Urge-to-action emerges from undefined centers, requiring immediate implementation.",
                optimization: "Peace indicates correct manifestation patterns. Anger signals insufficient communication or forced dependency structures."
            },
            'Projector': {
                strategy: "INVITATION PROTOCOL: Recognition-based activation system. Wait for formal invitations in major life domains: career, relationships, location.",
                mechanics: "Focused and absorbing aura enables system penetration and optimization. Energy access dependent on external recognition and invitation.",
                optimization: "Success emerges from proper invitation acceptance. Bitterness indicates forced entry or unrecognized guidance attempts."
            },
            'Reflector': {
                strategy: "LUNAR CYCLE PROTOCOL: 28-day decision-making framework. Complete lunar cycles provide comprehensive environmental sampling for major decisions.",
                mechanics: "Completely open definition creates perfect environmental mirror. All nine centers undefined, enabling complete receptivity.",
                optimization: "Surprise and delight indicate healthy environmental alignment. Disappointment signals toxic or incompatible environments."
            }
        };

        const framework = strategicFrameworks[this.userConfiguration.energyType];
        if (framework) {
            this.updateElementContent('#strategy-protocol', framework.strategy);
            this.updateElementContent('#energy-mechanics', framework.mechanics);
            this.updateElementContent('#optimization-metrics', framework.optimization);
        }

        // Render famous configuration examples
        const configurationExamples = {
            'Generator': ['Albert Einstein', 'Oprah Winfrey', 'Madonna', 'John Lennon', 'Marie Curie', 'Walt Disney'],
            'Manifestor': ['Johnny Depp', 'George W. Bush', 'Frida Kahlo', 'Jack Nicholson', 'Richard Burton', 'Robert De Niro'],
            'Projector': ['Barack Obama', 'Rami Malek', 'Mick Jagger', 'Napoleon Bonaparte', 'Woody Allen', 'Princess Diana'],
            'Reflector': ['Sandra Bullock', 'H.G. Wells', 'Ammachi', 'Fyodor Dostoevsky']
        };

        this.renderExampleGrid(configurationExamples[this.userConfiguration.energyType]);
    }

    renderAuthorityFramework() {
        const decisionArchitectures = {
            'Emotional': {
                protocol: "EMOTIONAL WAVE ANALYSIS: Decision-making requires complete emotional cycle observation. Clarity emerges through wave pattern completion, not immediate response.",
                implementation: "Monitor emotional states across multiple cycles. Identify patterns in high, low, and neutral phases. Make decisions only during clarity windows.",
                timeframe: "Variable cycle length: 24 hours to several weeks depending on decision magnitude and personal wave patterns."
            },
            'Sacral': {
                protocol: "GUT RESPONSE SYSTEM: Immediate somatic intelligence through sacral vocalizations. 'Uh-huh' (expansion) vs 'Uh-uh' (contraction) responses.",
                implementation: "Present binary options to sacral center. Listen for immediate sound response before mental interference. Trust first response pattern.",
                timeframe: "Instantaneous response required. Delayed consideration indicates mental interference in sacral intelligence."
            },
            'Splenic': {
                protocol: "INTUITIVE ALERT SYSTEM: Spontaneous knowing through splenic awareness. Single-occurrence warnings and guidance signals.",
                implementation: "Maintain present-moment awareness. Recognize subtle energetic shifts and first-time warnings. Never ignore initial splenic alerts.",
                timeframe: "Real-time response required. Splenic intelligence does not repeat signals or provide second chances."
            },
            'Self-Projected': {
                protocol: "VOCAL TRUTH DETECTION: Truth emerges through speaking process. Decision clarity achieved through verbal expression and external reflection.",
                implementation: "Verbalize options and considerations. Listen to own voice patterns and energy shifts during speaking. Use trusted sounding boards.",
                timeframe: "Process-dependent timing. Continue speaking until truth becomes obvious through vocal expression patterns."
            }
        };

        const architecture = decisionArchitectures[this.userConfiguration.decisionAuthority];
        if (architecture) {
            this.updateElementContent('#authority-protocol', architecture.protocol);
            this.updateElementContent('#implementation-guide', architecture.implementation);
            this.updateElementContent('#timing-framework', architecture.timeframe);
        }
    }

    renderCenterMapping() {
        const centerGrid = document.querySelector('.center-configuration-grid');
        if (!centerGrid) return;

        centerGrid.innerHTML = '';

        const centerSpecifications = {
            head: { name: 'HEAD', function: 'INSPIRATION', position: 'top' },
            ajna: { name: 'AJNA', function: 'PROCESSING', position: 'top' },
            throat: { name: 'THROAT', function: 'MANIFESTATION', position: 'middle' },
            identity: { name: 'G-CENTER', function: 'IDENTITY/DIRECTION', position: 'middle' },
            will: { name: 'HEART', function: 'WILLPOWER', position: 'middle' },
            emotional: { name: 'SOLAR PLEXUS', function: 'EMOTIONS', position: 'middle' },
            sacral: { name: 'SACRAL', function: 'LIFE FORCE', position: 'bottom' },
            spleen: { name: 'SPLEEN', function: 'INTUITION', position: 'bottom' },
            root: { name: 'ROOT', function: 'PRESSURE', position: 'bottom' }
        };

        Object.entries(centerSpecifications).forEach(([centerKey, specs]) => {
            const centerElement = document.createElement('div');
            const isActivated = this.userConfiguration.centerConfiguration[centerKey];
            
            centerElement.className = `center-module ${isActivated ? 'activated' : 'undefined'}`;
            centerElement.setAttribute('data-center', centerKey);
            centerElement.innerHTML = `
                <div class="center-identifier">${specs.name}</div>
                <div class="center-function">${specs.function}</div>
                <div class="activation-status">${isActivated ? 'DEFINED' : 'UNDEFINED'}</div>
            `;
            
            centerGrid.appendChild(centerElement);
        });
    }

    renderStrategicOptimization() {
        const professionalOptimization = {
            'Generator': {
                strategy: "SUSTAINABLE ENERGY DEPLOYMENT: Engage in work that generates satisfaction and sustainable energy output. Avoid forcing or pushing against resistance.",
                environment: "Collaborative environments where response opportunities are abundant. Regular feedback loops for course correction.",
                mastery: "Deep specialization through sustained engagement. Build expertise through consistent response patterns over time."
            },
            'Manifestor': {
                strategy: "AUTONOMOUS IMPACT CREATION: Leadership roles with minimal oversight. Independent project initiation and strategic implementation.",
                environment: "Freedom-based structures allowing for rapid decision-making and implementation. Minimal bureaucratic interference.",
                mastery: "Pioneer new territories and methodologies. Create systems and processes that others can follow and implement."
            },
            'Projector': {
                strategy: "SYSTEM OPTIMIZATION GUIDANCE: Advisory and guidance roles where insights are specifically requested and valued.",
                environment: "Recognition-based cultures that invite wisdom and strategic perspective. Quality over quantity in work engagement.",
                mastery: "Develop deep understanding of systems and people. Guide others toward efficiency and optimization."
            },
            'Reflector': {
                strategy: "ENVIRONMENTAL HEALTH ASSESSMENT: Roles that evaluate and reflect organizational or community health and functionality.",
                environment: "Healthy, supportive environments with regular change and variety. Avoid toxic or stagnant conditions.",
                mastery: "Become expert at recognizing environmental health patterns. Provide wisdom about collective dynamics."
            }
        };

        const optimization = professionalOptimization[this.userConfiguration.energyType];
        if (optimization) {
            this.updateElementContent('#professional-strategy', optimization.strategy);
            this.updateElementContent('#optimal-environment', optimization.environment);
            this.updateElementContent('#mastery-path', optimization.mastery);
        }
    }

    renderCompatibilityMatrix() {
        const compatibilityData = {
            'Generator': {
                withGenerator: "HIGH COMPATIBILITY: Mutual response dynamics create sustainable energy exchange.",
                withManifestor: "MODERATE COMPATIBILITY: Generator provides energy for Manifestor visions when properly informed.",
                withProjector: "HIGH COMPATIBILITY: Generator energy supports Projector guidance when invited.",
                withReflector: "VARIABLE COMPATIBILITY: Depends on Generator's satisfaction levels and environmental health."
            },
            'Manifestor': {
                withGenerator: "MODERATE COMPATIBILITY: Manifestor provides direction for Generator energy when communication is clear.",
                withManifestor: "CHALLENGING COMPATIBILITY: Two initiating forces require careful territory definition.",
                withProjector: "MODERATE COMPATIBILITY: Manifestor benefits from Projector guidance when invited.",
                withReflector: "VARIABLE COMPATIBILITY: Reflector provides environmental feedback for Manifestor decisions."
            },
            'Projector': {
                withGenerator: "HIGH COMPATIBILITY: Generator energy enables Projector guidance and system optimization.",
                withManifestor: "MODERATE COMPATIBILITY: Projector can guide Manifestor strategy when properly invited.",
                withProjector: "CHALLENGING COMPATIBILITY: Both require external energy sources and recognition.",
                withReflector: "LOW COMPATIBILITY: Neither has consistent energy to support the other long-term."
            },
            'Reflector': {
                withGenerator: "VARIABLE COMPATIBILITY: Generator satisfaction creates healthy environment for Reflector.",
                withManifestor: "VARIABLE COMPATIBILITY: Manifestor peace contributes to healthy Reflector environment.",
                withProjector: "LOW COMPATIBILITY: Neither provides consistent energy for sustainable interaction.",
                withReflector: "RARE COMPATIBILITY: Extremely rare configuration requiring perfect environmental alignment."
            }
        };

        const userType = this.userConfiguration.energyType;
        const compatibility = compatibilityData[userType];
        
        if (compatibility) {
            Object.entries(compatibility).forEach(([key, value]) => {
                const targetType = key.replace('with', '');
                this.updateElementContent(`#compatibility-${targetType.toLowerCase()}`, value);
            });
        }
    }

    updateSystemMetrics() {
        const metricsDisplay = document.querySelector('.system-metrics');
        if (metricsDisplay) {
            const metrics = {
                configurationId: this.generateConfigurationId(),
                assessmentCompletionRate: this.calculateCompletionRate(),
                systemAccuracy: '99.7%',
                analysisDepth: '40+ pages',
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            metricsDisplay.innerHTML = Object.entries(metrics).map(([key, value]) => 
                `<div class="metric-item">
                    <span class="metric-label">${this.formatMetricLabel(key)}</span>
                    <span class="metric-value">${value}</span>
                </div>`
            ).join('');
        }
    }

    loadModule(moduleId) {
        // Remove active states
        document.querySelectorAll('.module-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.analysis-module').forEach(module => module.classList.remove('active'));

        // Activate selected module
        const targetTab = document.querySelector(`[data-module="${moduleId}"]`);
        const targetModule = document.getElementById(`${moduleId}-module`);

        if (targetTab && targetModule) {
            targetTab.classList.add('active');
            targetModule.classList.add('active');
            
            // Smooth scroll to module
            targetModule.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }

        this.currentModule = moduleId;
        this.trackModuleAccess(moduleId);
    }

    updateElementContent(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    renderExampleGrid(examples) {
        const exampleGrid = document.querySelector('.configuration-examples-grid');
        if (exampleGrid && examples) {
            exampleGrid.innerHTML = examples.slice(0, 4).map(name => 
                `<div class="example-module">
                    <div class="example-name">${name}</div>
                    <div class="example-type">${this.userConfiguration.energyType}</div>
                </div>`
            ).join('');
        }
    }

    generateConfigurationId() {
        const { energyType, decisionAuthority, profileArchitecture } = this.userConfiguration;
        const hash = btoa(`${energyType}-${decisionAuthority}-${profileArchitecture}`).slice(0, 8);
        return `HD-${hash.toUpperCase()}`;
    }

    calculateCompletionRate() {
        const storedResults = getFromLocalStorage('assessment_results');
        return storedResults ? '100%' : '87%';
    }

    formatMetricLabel(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    trackModuleView(moduleId) {
        this.systemMetrics.moduleViews[moduleId] = (this.systemMetrics.moduleViews[moduleId] || 0) + 1;
        
        trackEvent('analysis_module_viewed', {
            module: moduleId,
            energyType: this.userConfiguration.energyType,
            authority: this.userConfiguration.decisionAuthority,
            viewCount: this.systemMetrics.moduleViews[moduleId]
        });
    }

    trackModuleAccess(moduleId) {
        trackEvent('analysis_module_accessed', {
            module: moduleId,
            energyType: this.userConfiguration.energyType,
            sessionDuration: Date.now() - this.systemMetrics.viewTime,
            interactionCount: this.systemMetrics.interactionCount
        });
    }

    trackSystemInteraction(actionType, metadata) {
        trackEvent('preview_system_interaction', {
            action: actionType,
            ...metadata,
            energyType: this.userConfiguration.energyType,
            authority: this.userConfiguration.decisionAuthority
        });
    }

    trackSystemAccess() {
        trackEvent('analysis_preview_accessed', {
            energyType: this.userConfiguration.energyType,
            authority: this.userConfiguration.decisionAuthority,
            profile: this.userConfiguration.profileArchitecture,
            hasAssessmentData: !!getFromLocalStorage('assessment_results'),
            timestamp: new Date().toISOString()
        });
    }
}

// Global functions for module interaction

.center {
    padding: 0.75rem 0.5rem;
    text-align: center;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
}

.center.defined {
    background: var(--accent-color);
    color: white;
}

.center.undefined {
    background: var(--border-color);
    color: var(--text-secondary);
}

.example-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
}

.example-card {
    background: var(--accent-color);
    color: white;
    padding: 0.75rem;
    border-radius: 6px;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
}

.preview-footer {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;
    text-align: center;
}

.report-summary h3 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
}

.feature-icon {
    font-size: 1.2rem;
}

.cta-container {
    border-top: 1px solid var(--border-color);
    padding-top: 2rem;
}

.cta-text {
    color: var(--text-primary);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.guarantee {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
    .preview-header h1 {
        font-size: 2rem;
    }
    
    .section-tabs {
        justify-content: flex-start;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
    
    .tab-button {
        flex-shrink: 0;
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .example-grid {
        grid-template-columns: 1fr;
    }
    
    .center-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', previewStyles);