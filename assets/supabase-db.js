// Supabase Database Integration for Human Design Quiz
// Simple, direct database submission

let supabaseClient = null;

// Initialize Supabase client
function initSupabase() {
    if (supabaseClient) return supabaseClient;

    const { createClient } = supabase;

    supabaseClient = createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anon_key
    );

    console.log('✅ Supabase client initialized');
    return supabaseClient;
}

/**
 * Submit quiz results to Supabase
 */
export async function submitToSupabase(data) {
    console.log('📤 Submitting to Supabase...');

    try {
        const client = initSupabase();

        // Prepare the data payload
        const resultId = 'hd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const payload = {
            result_id: resultId,
            name: data.name,
            email: data.email,
            birth_date: data.birth?.date || '',
            birth_time: data.birth?.time || '',
            birth_location: data.birth?.place || '',
            birth_timezone: data.birth?.tz || '',
            latitude: data.birth?.latitude || 0,
            longitude: data.birth?.longitude || 0,

            // Big 5 Scores
            openness: data.quizDerived?.detailed?.percentileScores?.openness || 0,
            conscientiousness: data.quizDerived?.detailed?.percentileScores?.conscientiousness || 0,
            extraversion: data.quizDerived?.detailed?.percentileScores?.extraversion || 0,
            agreeableness: data.quizDerived?.detailed?.percentileScores?.agreeableness || 0,
            neuroticism: data.quizDerived?.detailed?.percentileScores?.neuroticism || 0,

            // Human Design
            hd_type: data.chartDerived?.type || 'Generator',
            hd_authority: data.chartDerived?.authority || 'Sacral',
            hd_profile: data.chartDerived?.profile || '1/3',

            // Full data as JSON
            full_data: {
                quiz_derived: data.quizDerived,
                chart_derived: data.chartDerived,
                insights: data.insights || [],
                answers: data.answers || []
            },

            report_status: 'FREE_PREVIEW',
            created_at: new Date().toISOString()
        };

        console.log('📊 Payload prepared:', payload);

        // Insert into Supabase
        const { data: result, error } = await client
            .from('quiz_results')
            .insert([payload])
            .select();

        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }

        console.log('✅ Successfully saved to Supabase:', result);

        return {
            success: true,
            result_id: resultId,
            data: result
        };

    } catch (error) {
        console.error('❌ Error submitting to Supabase:', error);

        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
    try {
        const client = initSupabase();

        const { data, error } = await client
            .from('quiz_results')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Supabase connection successful');
        return { success: true };

    } catch (error) {
        console.error('❌ Supabase connection error:', error);
        return { success: false, error: error.message };
    }
}
