// SheetDB Integration for Human Design Quiz Data Collection
// Configuration for SheetDB API
const SHEETDB_CONFIG = {
    // SheetDB API URL as specified in requirements
    url: 'https://sheetdb.io/api/v1/wlp0w5nfo35g5',
    enabled: true // Enabled with the provided SheetDB URL
};

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
        const payload = {
            id: generateUniqueId(),
            name: data.name,
            email: data.email,
            birth_date: data.birth?.date || '',
            birth_time: data.birth?.time || '',
            location: data.birth?.place || '',
            human_design_output: JSON.stringify({
                // Big 5 Psychology Profile (as specified in requirements)
                big5_scores: data.quizDerived?.profile || '',
                
                // Detailed Big 5 analysis
                psychological_profile: {
                    assessment_type: 'Big 5 Personality Assessment',
                    openness: data.quizDerived?.detailed?.percentileScores?.openness || 0,
                    conscientiousness: data.quizDerived?.detailed?.percentileScores?.conscientiousness || 0,
                    extraversion: data.quizDerived?.detailed?.percentileScores?.extraversion || 0,
                    agreeableness: data.quizDerived?.detailed?.percentileScores?.agreeableness || 0,
                    neuroticism: data.quizDerived?.detailed?.percentileScores?.neuroticism || 0,
                    detailed_scores: data.quizDerived?.scores || {},
                    interpretations: data.quizDerived?.detailed?.interpretations || {},
                    summary: data.quizDerived?.summary || {}
                },
                
                // Human Design chart outputs (maintained for compatibility)
                chart_design: {
                    type: data.chartDerived?.type || '',
                    authority: data.chartDerived?.authority || '',
                    profile: data.chartDerived?.profile || '',
                    definition: data.chartDerived?.definition || '',
                    centers: data.chartDerived?.centers || {},
                    gates: data.chartDerived?.gates || {},
                    channels: data.chartDerived?.channels || []
                },
                
                // Integration analysis
                insights: data.insights || [],
                // Raw quiz answers for analysis
                raw_answers: data.answers || []
            }),
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