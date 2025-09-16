// Preview page functionality
class PreviewPage {
    constructor() {
        this.currentSection = 'introduction';
        this.userResults = null;
        this.init();
    }

    async init() {
        this.loadUserResults();
        this.setupEventListeners();
        this.personalizeContent();
        this.trackPreviewView();
    }

    loadUserResults() {
        // Try to get results from localStorage first
        this.userResults = getFromLocalStorage('quiz_results');
        
        if (!this.userResults) {
            // If no results found, use default values for demo
            this.userResults = {
                type: 'Generator',
                authority: 'Sacral',
                profile: '1/3',
                centers: {
                    sacral: true,
                    throat: true,
                    will: true,
                    emotional: false,
                    identity: false,
                    head: false,
                    ajna: false,
                    spleen: false,
                    root: false
                }
            };
        }
    }

    setupEventListeners() {
        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.textContent.toLowerCase().replace(' ', '-');
                this.showSection(section);
            });
        });

        // Track section views
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace('-section', '');
                    trackEvent('preview_section_viewed', {
                        section: sectionId,
                        type: this.userResults.type,
                        authority: this.userResults.authority
                    });
                }
            });
        }, { threshold: 0.5 });

        // Observe all sections
        document.querySelectorAll('.section-content').forEach(section => {
            observer.observe(section);
        });
    }

    personalizeContent() {
        // Update personalized content based on user results
        this.updateBasicInfo();
        this.updateTypeContent();
        this.updateAuthorityContent();
        this.updateCentersVisualization();
        this.updateCareerContent();
        this.updateRelationshipContent();
    }

    updateBasicInfo() {
        const typeElements = document.querySelectorAll('#preview-type, #type-title');
        const authorityElements = document.querySelectorAll('#preview-authority, #authority-title');
        const profileElement = document.getElementById('preview-profile');

        typeElements.forEach(el => el.textContent = this.userResults.type);
        authorityElements.forEach(el => el.textContent = this.userResults.authority);
        if (profileElement) profileElement.textContent = this.userResults.profile;
    }

    updateTypeContent() {
        const typeStrategies = {
            'Generator': "Your strategy is to RESPOND. This means waiting for life to come to you and then responding with your gut feeling - that immediate 'uh-huh' (yes) or 'uh-uh' (no) that comes from your Sacral center. When you respond correctly, you enter the flow state where work becomes play and you have unlimited energy.",
            'Manifestor': "Your strategy is to INFORM. Before you act on your urges to initiate or create change, inform those who will be impacted by your actions. This simple act of informing dramatically reduces resistance and allows your manifesting power to flow more smoothly.",
            'Projector': "Your strategy is to WAIT FOR INVITATION. This applies especially to major life areas like love, work, and where you live. When you're properly invited and recognized for your gifts, you have access to the energy you need to be successful.",
            'Reflector': "Your strategy is to WAIT A LUNAR CYCLE (about 28 days) before making major decisions. This allows you to experience all aspects of a decision and ensures you're making choices from your deep wisdom rather than temporary influences."
        };

        const famousExamples = {
            'Generator': ['Albert Einstein', 'Oprah Winfrey', 'Madonna', 'John Lennon', 'Marie Curie', 'Walt Disney'],
            'Manifestor': ['Johnny Depp', 'George W. Bush', 'Frida Kahlo', 'Jack Nicholson', 'Richard Burton', 'Robert De Niro'],
            'Projector': ['Barack Obama', 'Rami Malek', 'Mick Jagger', 'Napoleon Bonaparte', 'Woody Allen', 'Princess Diana'],
            'Reflector': ['Sandra Bullock', 'H.G. Wells', 'Ammachi', 'Fyodor Dostoevsky']
        };

        const strategyElement = document.getElementById('type-strategy');
        if (strategyElement) {
            strategyElement.textContent = typeStrategies[this.userResults.type];
        }

        const examplesElement = document.getElementById('famous-examples');
        if (examplesElement) {
            const examples = famousExamples[this.userResults.type] || famousExamples['Generator'];
            const exampleGrid = examplesElement.querySelector('.example-grid');
            if (exampleGrid) {
                exampleGrid.innerHTML = examples.slice(0, 3).map(name => 
                    `<div class="example-card">${name}</div>`
                ).join('');
            }
        }
    }

    updateAuthorityContent() {
        const authorityGuidance = {
            'Emotional': "Your authority lies in your emotional wave. You need to honor your emotional process and wait for clarity before making important decisions. Pay attention to your emotional state throughout the day and make decisions when you feel calm and clear.",
            'Sacral': "Your authority is in your gut response - that immediate 'uh-huh' or 'uh-uh' sound that comes from your belly before your mind can interfere. Ask yourself yes/no questions and listen for the immediate gut response.",
            'Splenic': "Your authority is in your spleen - intuitive, spontaneous knowing that speaks in the moment. It's quiet and speaks only once. Pay attention to subtle intuitive hits and trust your first instinct.",
            'Self-Projected': "Your authority comes through hearing yourself speak. You need to talk through decisions with trusted friends or even yourself to hear your truth. Don't just think about it - speak it out loud."
        };

        const guidanceElement = document.getElementById('authority-guidance');
        if (guidanceElement) {
            guidanceElement.textContent = authorityGuidance[this.userResults.authority];
        }
    }

    updateCentersVisualization() {
        const centerGrid = document.querySelector('.center-grid');
        if (!centerGrid) return;

        // Clear existing centers
        centerGrid.innerHTML = '';

        // Add centers based on user's configuration
        const centerNames = ['head', 'ajna', 'throat', 'identity', 'will', 'emotional', 'sacral', 'spleen', 'root'];
        
        centerNames.slice(0, 5).forEach(centerName => {
            const centerDiv = document.createElement('div');
            centerDiv.className = `center ${this.userResults.centers[centerName] ? 'defined' : 'undefined'}`;
            centerDiv.setAttribute('data-center', centerName);
            centerDiv.textContent = this.capitalize(centerName);
            centerGrid.appendChild(centerDiv);
        });
    }

    updateCareerContent() {
        const careerGuidance = {
            'Generator': "Your career should light you up and allow you to respond to opportunities that excite you. You have the sustainable energy to master your craft and build something lasting. Look for work that makes you say 'uh-huh!' and gives you satisfaction.",
            'Manifestor': "Your career should give you freedom to initiate and create impact. You work best when you can start things and move independently without micromanagement. Look for leadership roles where you can pioneer new directions.",
            'Projector': "Your career should recognize your natural guidance abilities and invite your wisdom. You excel in roles where you can guide and optimize systems or people. Wait for invitations to positions where your insights are valued.",
            'Reflector': "Your career should allow you to reflect the health of organizations and communities. You excel in roles where you can observe, evaluate, and provide wisdom about what's working and what isn't."
        };

        const careerElement = document.getElementById('career-guidance');
        if (careerElement) {
            careerElement.textContent = careerGuidance[this.userResults.type];
        }
    }

    updateRelationshipContent() {
        const relationshipGuidance = {
            'Generator': "As a Generator, you bring sustainable energy and magnetism to relationships. When you're lit up and following your passions, you naturally attract the right people. Focus on responding to relationship opportunities rather than chasing them.",
            'Manifestor': "As a Manifestor, you bring independence and initiating power to relationships. You need partners who understand your need for freedom and who appreciate your ability to start new things. Remember to inform your partners about your decisions.",
            'Projector': "As a Projector, you bring wisdom and guidance to relationships. You work best with partners who recognize and invite your insights. Don't try to force your guidance - wait for it to be welcomed and valued.",
            'Reflector': "As a Reflector, you bring deep wisdom about relationship dynamics to your connections. You need healthy, supportive relationships and should take time (a lunar cycle) before making major relationship decisions."
        };

        const relationshipElement = document.getElementById('relationship-guidance');
        if (relationshipElement) {
            relationshipElement.textContent = relationshipGuidance[this.userResults.type];
        }
    }

    showSection(sectionName) {
        // Remove active class from all tabs and sections
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section-content').forEach(section => section.classList.remove('active'));

        // Add active class to current tab and section
        const targetTab = Array.from(document.querySelectorAll('.tab-button')).find(btn => 
            btn.textContent.toLowerCase().replace(' ', '-').includes(sectionName.replace('-', ' '))
        );
        if (targetTab) targetTab.classList.add('active');

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.currentSection = sectionName;

        // Track section change
        trackEvent('preview_section_changed', {
            section: sectionName,
            type: this.userResults.type,
            authority: this.userResults.authority
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    trackPreviewView() {
        trackEvent('preview_page_viewed', {
            type: this.userResults.type,
            authority: this.userResults.authority,
            profile: this.userResults.profile,
            has_results: !!getFromLocalStorage('quiz_results'),
            timestamp: new Date().toISOString()
        });
    }
}

// Global function for tab switching (called from HTML)
function showSection(sectionName) {
    if (window.previewPage) {
        window.previewPage.showSection(sectionName);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.previewPage = new PreviewPage();
});

// CSS for preview-specific styles
const previewStyles = `
<style>
/* Preview Page Styles */
.preview-page {
    padding-top: 2rem;
}

.preview-header {
    text-align: center;
    margin-bottom: 3rem;
}

.preview-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.preview-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

.preview-navigation {
    margin-bottom: 3rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.section-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.tab-button {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.tab-button:hover {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
}

.tab-button.active {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
}

.section-content {
    display: none;
    margin-bottom: 3rem;
}

.section-content.active {
    display: block;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--accent-color);
}

.section-header h2 {
    color: var(--text-primary);
    margin: 0;
}

.page-count {
    background: var(--accent-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.preview-pages {
    display: grid;
    gap: 2rem;
}

.page-preview {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.page-header {
    background: linear-gradient(135deg, var(--accent-color), #357abd);
    color: white;
    padding: 1rem;
}

.page-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.page-content {
    padding: 1.5rem;
    position: relative;
    min-height: 200px;
}

.preview-text {
    color: var(--text-primary);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.highlight {
    color: var(--accent-color);
    font-weight: 600;
}

.blur-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(transparent, var(--card-bg));
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
}

.unlock-text {
    text-align: center;
    background: rgba(77, 163, 255, 0.1);
    border: 1px solid var(--accent-color);
    border-radius: 8px;
    padding: 1rem;
    color: var(--accent-color);
}

.lock-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    display: block;
}

.centers-visual {
    margin: 1rem 0;
}

.center-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
    max-width: 400px;
}

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