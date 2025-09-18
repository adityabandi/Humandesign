// Location API Integration for Human Design Quiz
// Simple location autocomplete and geocoding functionality

/**
 * Initialize location functionality
 */
export function initializeLocationAPI() {
    const birthPlaceInput = document.getElementById('birthPlace');
    const suggestionsContainer = document.getElementById('locationSuggestions');
    
    if (!birthPlaceInput || !suggestionsContainer) {
        console.warn('Location elements not found');
        return;
    }

    let searchTimeout;
    
    birthPlaceInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        if (query.length < 3) {
            hideSuggestions();
            return;
        }
        
        // Debounce the search
        searchTimeout = setTimeout(() => {
            searchLocations(query);
        }, 300);
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.form-group')) {
            hideSuggestions();
        }
    });
    
    birthPlaceInput.addEventListener('focus', () => {
        if (birthPlaceInput.value.length >= 3) {
            showSuggestions();
        }
    });
}

/**
 * Search for locations using a free geocoding API
 */
async function searchLocations(query) {
    try {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'HumanDesignQuiz/1.0'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Location search failed');
        }
        
        const results = await response.json();
        displayLocationSuggestions(results);
        
    } catch (error) {
        console.error('Location search error:', error);
        // Fallback to common locations if API fails
        displayFallbackSuggestions(query);
    }
}

/**
 * Display location suggestions from API results
 */
function displayLocationSuggestions(results) {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    
    if (!results || results.length === 0) {
        hideSuggestions();
        return;
    }
    
    const suggestions = results.map(result => {
        const address = result.address || {};
        const parts = [];
        
        // Build a readable location string
        if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village);
        }
        if (address.state) {
            parts.push(address.state);
        }
        if (address.country) {
            parts.push(address.country);
        }
        
        return {
            display: parts.join(', ') || result.display_name,
            lat: result.lat,
            lon: result.lon,
            full: result.display_name
        };
    });
    
    renderSuggestions(suggestions);
}

/**
 * Display fallback suggestions if API fails
 */
function displayFallbackSuggestions(query) {
    const commonLocations = [
        'New York, NY, USA',
        'Los Angeles, CA, USA',
        'Chicago, IL, USA',
        'London, England, UK',
        'Paris, France',
        'Tokyo, Japan',
        'Sydney, Australia',
        'Toronto, Canada',
        'Berlin, Germany',
        'Rome, Italy'
    ];
    
    const filtered = commonLocations.filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        const suggestions = filtered.map(location => ({
            display: location,
            full: location
        }));
        renderSuggestions(suggestions);
    } else {
        hideSuggestions();
    }
}

/**
 * Render suggestions in the dropdown
 */
function renderSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'location-suggestion';
        suggestionElement.textContent = suggestion.display;
        
        suggestionElement.addEventListener('click', () => {
            selectLocation(suggestion);
        });
        
        suggestionsContainer.appendChild(suggestionElement);
    });
    
    showSuggestions();
}

/**
 * Handle location selection
 */
function selectLocation(location) {
    const birthPlaceInput = document.getElementById('birthPlace');
    birthPlaceInput.value = location.display;
    
    // Store additional location data if available
    if (location.lat && location.lon) {
        birthPlaceInput.dataset.latitude = location.lat;
        birthPlaceInput.dataset.longitude = location.lon;
    }
    
    hideSuggestions();
}

/**
 * Show suggestions dropdown
 */
function showSuggestions() {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    suggestionsContainer.classList.remove('hidden');
}

/**
 * Hide suggestions dropdown
 */
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    suggestionsContainer.classList.add('hidden');
}

/**
 * Get coordinates for the selected location
 */
export function getLocationCoordinates() {
    const birthPlaceInput = document.getElementById('birthPlace');
    
    if (birthPlaceInput.dataset.latitude && birthPlaceInput.dataset.longitude) {
        return {
            latitude: parseFloat(birthPlaceInput.dataset.latitude),
            longitude: parseFloat(birthPlaceInput.dataset.longitude),
            place: birthPlaceInput.value
        };
    }
    
    return {
        place: birthPlaceInput.value
    };
}