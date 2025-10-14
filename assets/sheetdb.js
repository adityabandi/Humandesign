// SheetDB Integration for Human Design Quiz Data Collection
// Configuration for SheetDB API
const SHEETDB_CONFIG = {
    // SheetDB API URL as specified in requirements
    url: 'https://sheetdb.io/api/v1/wlp0w5nfo35g5',
    enabled: true // Enabled with the provided SheetDB URL
};

// Helper function for HD strategy
function getStrategy(type) {
    const strategies = {
        'Generator': 'Respond to Life',
        'Manifestor': 'Initiate & Inform',
        'Projector': 'Wait for Invitation',
        'Reflector': 'Wait a Lunar Cycle'
    };
    return strategies[type] || 'Respond to Life';
}

/**
 * Submit quiz data to SheetDB with required columns:
 * id, name, email, birth date, birth time, location, human design output
 */
export async function submitToSheetDB(data) {
    if (!SHEETDB_CONFIG.enabled) {
        console.log('SheetDB not configured, skipping submission');
        return { success: true, message: 'SheetDB disabled - using local storage' };
    }

    try {
        const resultId = generateUniqueId();

        // Format birth data properly
        const birthInfo = {
            date: data.birth?.date || '',
            time: data.birth?.time || '',
            place: data.birth?.place || '',
            timezone: data.birth?.tz || '',
            latitude: data.birth?.latitude || '',
            longitude: data.birth?.longitude || ''
        };

        // Extract Big 5 scores for easy reference
        const big5Scores = data.quizDerived?.detailed?.percentileScores || {};

        // Format Human Design output as readable text for report generation
        const hdSummary = `
=== PERSONALITY PROFILE ===
Name: ${data.name}
Email: ${data.email}
Birth Date: ${birthInfo.date}
Birth Time: ${birthInfo.time}
Birth Location: ${birthInfo.place}
Timezone: ${birthInfo.timezone}
Coordinates: ${birthInfo.latitude}, ${birthInfo.longitude}

=== BIG 5 PERSONALITY SCORES ===
Openness: ${big5Scores.openness || 0}%
Conscientiousness: ${big5Scores.conscientiousness || 0}%
Extraversion: ${big5Scores.extraversion || 0}%
Agreeableness: ${big5Scores.agreeableness || 0}%
Neuroticism: ${big5Scores.neuroticism || 0}%

=== HUMAN DESIGN CHART ===
Type: ${data.chartDerived?.type || 'Generator'}
Authority: ${data.chartDerived?.authority || 'Sacral'}
Profile: ${data.chartDerived?.profile || '1/3'}
Strategy: ${getStrategy(data.chartDerived?.type)}

=== PERSONALITY SUMMARY ===
${data.quizDerived?.summary?.overallProfile || 'Assessment complete'}

=== REPORT STATUS ===
Result ID: ${resultId}
Status: PENDING_REPORT_GENERATION
Upgrade Status: FREE_PREVIEW
Created: ${new Date().toISOString()}
        `.trim();

        const payload = {
            id: resultId,
            name: data.name,
            email: data.email,
            birth_date: birthInfo.date,
            birth_time: birthInfo.time,
            location: birthInfo.place,
            timezone: birthInfo.timezone,
            latitude: birthInfo.latitude,
            longitude: birthInfo.longitude,
            big5_openness: big5Scores.openness || 0,
            big5_conscientiousness: big5Scores.conscientiousness || 0,
            big5_extraversion: big5Scores.extraversion || 0,
            big5_agreeableness: big5Scores.agreeableness || 0,
            big5_neuroticism: big5Scores.neuroticism || 0,
            hd_type: data.chartDerived?.type || 'Generator',
            hd_authority: data.chartDerived?.authority || 'Sacral',
            hd_profile: data.chartDerived?.profile || '1/3',
            human_design_output: hdSummary,
            full_data: JSON.stringify({
                psychological_profile: data.quizDerived,
                chart_design: data.chartDerived,
                insights: data.insights || [],
                raw_answers: data.answers || []
            }),
            report_status: 'FREE_PREVIEW',
            created_at: new Date().toISOString()
        };

        const response = await fetch(SHEETDB_CONFIG.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`SheetDB API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data successfully submitted to SheetDB:', result);
        
        return { 
            success: true, 
            message: 'Data saved successfully',
            sheetdb_response: result 
        };

    } catch (error) {
        console.error('Error submitting to SheetDB:', error);
        
        // Fallback to local storage if SheetDB fails
        try {
            const fallbackKey = `hd.backup.${Date.now()}`;
            localStorage.setItem(fallbackKey, JSON.stringify(data));
            
            return { 
                success: true, 
                message: 'Data saved locally (SheetDB unavailable)',
                error: error.message 
            };
        } catch (localError) {
            return { 
                success: false, 
                message: 'Failed to save data both remotely and locally',
                error: error.message 
            };
        }
    }
}

/**
 * Generate a unique ID for the submission
 */
function generateUniqueId() {
    return 'hd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Configure SheetDB with your API URL
 */
export function configureSheetDB(apiUrl) {
    SHEETDB_CONFIG.url = apiUrl;
    SHEETDB_CONFIG.enabled = true;
    console.log('SheetDB configured with URL:', apiUrl);
}

/**
 * Test SheetDB connection
 */
export async function testSheetDBConnection() {
    if (!SHEETDB_CONFIG.enabled) {
        return { success: false, message: 'SheetDB not configured' };
    }

    try {
        const response = await fetch(SHEETDB_CONFIG.url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        return { 
            success: response.ok, 
            status: response.status,
            message: response.ok ? 'SheetDB connection successful' : 'SheetDB connection failed'
        };
    } catch (error) {
        return { 
            success: false, 
            message: 'SheetDB connection error: ' + error.message 
        };
    }
}