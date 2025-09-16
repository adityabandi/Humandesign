// Event tracking function
function trackEvent(eventName, data = {}) {
    console.log(`Event tracked: ${eventName}`, data);
    
    // Store events in localStorage for demo purposes
    const events = JSON.parse(localStorage.getItem('tracked_events') || '[]');
    events.push({
        event: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('tracked_events', JSON.stringify(events));
    
    // In a real application, this would send data to your analytics service
    // Example: gtag('event', eventName, data);
    // Example: analytics.track(eventName, data);
}

// Checkout functionality for buy page
function proceedToCheckout() {
    trackEvent('buy_click', {
        source: 'buy_page',
        product: 'complete_report',
        price: 47
    });
    
    // In a real application, this would redirect to Stripe checkout
    // For demo purposes, we'll show an alert and redirect to thank you page
    alert('Redirecting to secure Stripe checkout...\n\n(This is a demo - in production this would redirect to real Stripe checkout)');
    
    // Simulate successful checkout
    setTimeout(() => {
        window.location.href = '/thank-you.html';
    }, 1500);
}

// Social sharing functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent('I just discovered my Human Design type! Find out yours with this amazing assessment.');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    trackEvent('social_share', { platform: 'facebook' });
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent('I just discovered my Human Design type! Find out yours with this amazing assessment.');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    trackEvent('social_share', { platform: 'twitter' });
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    trackEvent('social_share', { platform: 'linkedin' });
}

// Mobile navigation toggle (if needed in future)
function initMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Initialize general functionality
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    
    // Track page views
    const page = window.location.pathname.replace(/\.html$/, '') || '/';
    trackEvent('page_view', { page: page });
    
    // Add click tracking to all CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('quiz')) {
                trackEvent('quiz_start', { source: 'cta_button' });
            } else if (href && href.includes('buy')) {
                trackEvent('buy_click', { source: 'cta_button' });
            } else if (href && href.includes('preview')) {
                trackEvent('preview_click', { source: 'cta_button' });
            }
        });
    });
});

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Export functions for use in other scripts
window.HumanDesign = {
    trackEvent,
    proceedToCheckout,
    shareOnFacebook,
    shareOnTwitter,
    shareOnLinkedIn,
    saveToLocalStorage,
    getFromLocalStorage,
    formatDate,
    generateUniqueId
};