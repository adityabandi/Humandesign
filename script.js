// System Event Monitoring and Protocol Management Interface
function trackSystemEvent(eventIdentifier, eventData = {}) {
    console.log(`SYSTEM EVENT LOGGED: ${eventIdentifier}`, eventData);
    
    // Event storage in local memory banks for demonstration protocols
    const systemEvents = JSON.parse(localStorage.getItem('system_event_log') || '[]');
    systemEvents.push({
        event_type: eventIdentifier,
        event_data: eventData,
        event_timestamp: new Date().toISOString(),
        session_id: generateSessionIdentifier(),
        interface_version: 'HELSING_V2.4'
    });
    localStorage.setItem('system_event_log', JSON.stringify(systemEvents));
    
    // Production environment integration protocols
    // Implementation: gtag('event', eventIdentifier, eventData);
    // Implementation: analytics.track(eventIdentifier, eventData);
}

// Enhanced analysis acquisition protocol
function initiateAnalysisAcquisition() {
    trackSystemEvent('analysis_acquisition_initiated', {
        source: 'acquisition_interface',
        product_code: 'COMPLETE_SYSTEM_ANALYSIS',
        price_point: 47,
        currency: 'USD'
    });
    
    // Production environment: Secure payment gateway integration
    // Demonstration mode: Simulated transaction flow
    displaySystemAlert('INITIATING SECURE PAYMENT GATEWAY CONNECTION...\n\n[DEMONSTRATION MODE: Production system connects to verified Stripe payment processing]');
    
    // Simulate successful transaction processing
    setTimeout(() => {
        window.location.href = '/thank-you.html';
    }, 1500);
}

// Social network distribution protocols
function distributeThroughFacebook() {
    const systemUrl = encodeURIComponent(window.location.origin);
    const distributionMessage = encodeURIComponent('SYSTEM CONFIGURATION DISCOVERED: Advanced analysis reveals operational patterns and strategic protocols. Analyze your configuration with this comprehensive assessment system.');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${systemUrl}&quote=${distributionMessage}`, '_blank');
    trackSystemEvent('social_distribution', { platform: 'facebook', distribution_type: 'configuration_sharing' });
}

function distributeThroughTwitter() {
    const systemUrl = encodeURIComponent(window.location.origin);
    const distributionMessage = encodeURIComponent('SYSTEM CONFIGURATION DISCOVERED: Advanced analysis reveals operational patterns and strategic protocols. Analyze your configuration: ');
    window.open(`https://twitter.com/intent/tweet?url=${systemUrl}&text=${distributionMessage}`, '_blank');
    trackSystemEvent('social_distribution', { platform: 'twitter', distribution_type: 'configuration_sharing' });
}

function distributeThroughLinkedIn() {
    const systemUrl = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${systemUrl}`, '_blank');
    trackSystemEvent('social_distribution', { platform: 'linkedin', distribution_type: 'professional_sharing' });
}

// Mobile interface navigation protocol
function initializeMobileNavigation() {
    const navigationMenu = document.querySelector('.nav-menu');
    const navigationToggle = document.querySelector('.nav-toggle');
    
    if (navigationToggle && navigationMenu) {
        navigationToggle.addEventListener('click', () => {
            navigationMenu.classList.toggle('active');
            trackSystemEvent('mobile_navigation_toggled', { 
                state: navigationMenu.classList.contains('active') ? 'expanded' : 'collapsed' 
            });
        });
    }
}

// System initialization and monitoring protocols
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNavigation();
    
    // Interface access monitoring
    const interfacePage = window.location.pathname.replace(/\.html$/, '') || '/';
    trackSystemEvent('interface_accessed', { 
        interface_page: interfacePage,
        access_timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent.substring(0, 100)
    });
    
    // Strategic action button monitoring
    const actionButtons = document.querySelectorAll('.cta-button, .system-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const buttonText = this.textContent.trim();
            
            if (targetHref && targetHref.includes('quiz')) {
                trackSystemEvent('assessment_initiation', { 
                    source: 'action_button',
                    button_text: buttonText,
                    interface_page: interfacePage
                });
            } else if (targetHref && targetHref.includes('buy')) {
                trackSystemEvent('acquisition_interest', { 
                    source: 'action_button',
                    button_text: buttonText,
                    interface_page: interfacePage
                });
            } else if (targetHref && targetHref.includes('preview')) {
                trackSystemEvent('preview_access', { 
                    source: 'action_button',
                    button_text: buttonText,
                    interface_page: interfacePage
                });
            }
        });
    });
    
    // Form interaction monitoring
    const formElements = document.querySelectorAll('form');
    formElements.forEach(form => {
        form.addEventListener('submit', function(e) {
            trackSystemEvent('form_submission', {
                form_id: this.id || 'unnamed_form',
                interface_page: interfacePage,
                submission_timestamp: new Date().toISOString()
            });
        });
    });
});

// System utility functions
function formatSystemTimestamp(timestampString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return new Date(timestampString).toLocaleDateString(undefined, options);
}

function generateSessionIdentifier() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomComponent = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `SES-${timestamp}-${randomComponent}`;
}

function generateOperatorIdentifier() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomComponent = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `OP-${timestamp}-${randomComponent}`;
}

function saveToSystemStorage(storageKey, storageData) {
    try {
        const dataPacket = {
            data: storageData,
            stored_timestamp: new Date().toISOString(),
            storage_version: '2.4.1'
        };
        localStorage.setItem(storageKey, JSON.stringify(dataPacket));
        return true;
    } catch (error) {
        console.error('SYSTEM STORAGE ERROR:', error);
        trackSystemEvent('storage_error', { 
            error_type: 'save_failure',
            storage_key: storageKey,
            error_message: error.message
        });
        return false;
    }
}

function retrieveFromSystemStorage(storageKey, defaultValue = null) {
    try {
        const storedItem = localStorage.getItem(storageKey);
        if (!storedItem) return defaultValue;
        
        const dataPacket = JSON.parse(storedItem);
        
        // Return the actual data, maintaining backward compatibility
        return dataPacket.data !== undefined ? dataPacket.data : dataPacket;
    } catch (error) {
        console.error('SYSTEM RETRIEVAL ERROR:', error);
        trackSystemEvent('storage_error', { 
            error_type: 'retrieval_failure',
            storage_key: storageKey,
            error_message: error.message
        });
        return defaultValue;
    }
}

function displaySystemAlert(alertMessage, alertType = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `system-alert ${alertType}-alert`;
    alertContainer.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">${alertType === 'error' ? '⚠' : alertType === 'success' ? '✓' : 'ℹ'}</div>
            <div class="alert-message">${alertMessage}</div>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto-remove after 5 seconds for info alerts
    if (alertType === 'info') {
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.parentNode.removeChild(alertContainer);
            }
        }, 5000);
    }
    
    trackSystemEvent('system_alert_displayed', {
        alert_type: alertType,
        alert_message: alertMessage.substring(0, 100)
    });
}

function clearSystemData() {
    const confirmClear = confirm('SYSTEM DATA PURGE: This action will remove all stored configuration data and session information. Proceed with system reset?');
    
    if (confirmClear) {
        localStorage.removeItem('assessment_results');
        localStorage.removeItem('assessment_session');
        localStorage.removeItem('system_event_log');
        localStorage.removeItem('quiz_results');
        
        trackSystemEvent('system_data_purged', {
            purge_timestamp: new Date().toISOString(),
            purge_source: 'manual_reset'
        });
        
        displaySystemAlert('SYSTEM DATA SUCCESSFULLY PURGED: All configuration data and session information cleared.', 'success');
        
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
    }
}

// Export system functions for cross-module integration
window.SystemControl = {
    trackSystemEvent,
    initiateAnalysisAcquisition,
    distributeThroughFacebook,
    distributeThroughTwitter,
    distributeThroughLinkedIn,
    saveToSystemStorage,
    retrieveFromSystemStorage,
    formatSystemTimestamp,
    generateSessionIdentifier,
    generateOperatorIdentifier,
    displaySystemAlert,
    clearSystemData
};

// Maintain backward compatibility
window.HumanDesign = {
    trackEvent: trackSystemEvent,
    proceedToCheckout: initiateAnalysisAcquisition,
    shareOnFacebook: distributeThroughFacebook,
    shareOnTwitter: distributeThroughTwitter,
    shareOnLinkedIn: distributeThroughLinkedIn,
    saveToLocalStorage: saveToSystemStorage,
    getFromLocalStorage: retrieveFromSystemStorage,
    formatDate: formatSystemTimestamp,
    generateUniqueId: generateOperatorIdentifier
};