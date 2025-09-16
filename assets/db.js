// Initialize
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anon_key || 'your-anon-key-here';

let supabase = null;

// Only initialize Supabase if it's available and configured
if (window.supabase && window.QUIZ_CONFIG?.enableDatabase && 
    SUPABASE_URL !== 'https://your-project-id.supabase.co') {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
  }
}

// Save (create everything in one RPC)
export async function createFullResult({name,email,birth,answers,quizDerived,chartDerived,insights}) {
  if (!supabase) {
    // Fallback to localStorage for demo
    const publicId = generateUUID();
    const secret = generateSecret();
    
    const resultData = {
      user: { name, email },
      quiz: quizDerived,
      chart: chartDerived,
      insights,
      purchased: false,
      birth
    };
    
    localStorage.setItem(`hd.result.${publicId}`, JSON.stringify(resultData));
    localStorage.setItem(`hd.secret.${publicId}`, secret);
    
    return { public_id: publicId, secret };
  }
  
  const { data, error } = await supabase.rpc('create_full_result', {
    p_name: name || null,
    p_email: email || null,
    p_birth: birth,
    p_quiz_answers: answers,
    p_quiz_derived: quizDerived,
    p_chart_derived: chartDerived,
    p_insights: insights
  });
  if (error) throw error;
  // store secret locally for subsequent fetches
  localStorage.setItem(`hd.secret.${data[0].public_id}`, data[0].secret);
  return data[0]; // { public_id, secret }
}

export async function fetchResult(publicId) {
  if (!supabase) {
    // Fallback to localStorage
    const resultData = localStorage.getItem(`hd.result.${publicId}`);
    const secret = localStorage.getItem(`hd.secret.${publicId}`);
    
    if (!resultData || !secret) {
      throw new Error('Missing secret for this result on this device.');
    }
    
    return JSON.parse(resultData);
  }
  
  const secret = localStorage.getItem(`hd.secret.${publicId}`);
  if (!secret) throw new Error('Missing secret for this result on this device.');
  const { data, error } = await supabase.rpc('get_result', {
    p_public_id: publicId,
    p_secret: secret
  });
  if (error) throw error;
  return data; // { user, quiz, chart, insights, purchased, birth }
}

export async function markPurchase(publicId, status, raw={}) {
  if (!supabase) {
    // Fallback to localStorage
    const resultData = localStorage.getItem(`hd.result.${publicId}`);
    if (resultData) {
      const data = JSON.parse(resultData);
      data.purchased = (status === 'paid');
      localStorage.setItem(`hd.result.${publicId}`, JSON.stringify(data));
    }
    return;
  }
  
  const secret = localStorage.getItem(`hd.secret.${publicId}`);
  if (!secret) throw new Error('Missing secret');
  const { error } = await supabase.rpc('mark_purchase', {
    p_public_id: publicId,
    p_secret: secret,
    p_status: status,
    p_raw: raw
  });
  if (error) throw error;
}

// Helper functions
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateSecret() {
  return Array.from(crypto.getRandomValues(new Uint8Array(18)), byte => 
    byte.toString(16).padStart(2, '0')).join('');
}