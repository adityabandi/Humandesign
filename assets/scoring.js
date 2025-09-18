// Advanced Quiz scoring logic with detailed answer analysis
export function scoreQuiz(answers, meta = {}) {
  // Validate answers array
  if (!Array.isArray(answers) || answers.length !== 100) {
    throw new Error('Invalid answers: must be array of 100 responses');
  }
  
  // Initialize comprehensive scoring system
  const scores = {
    energyType: { generator: 0, manifestor: 0, projector: 0, reflector: 0 },
    authority: { emotional: 0, sacral: 0, splenic: 0, selfProjected: 0, mental: 0, ego: 0 },
    profile: { 
      investigator: 0, hermit: 0, martyr: 0, opportunist: 0, 
      heretic: 0, roleModel: 0 
    },
    centers: {
      head: 0, ajna: 0, throat: 0, g: 0, heart: 0,
      sacral: 0, solarPlexus: 0, spleen: 0, root: 0
    },
    detailed: {
      answerAnalysis: [],
      categoryBreakdown: {},
      strengthAreas: [],
      challengeAreas: [],
      alignmentFactors: []
    }
  };
  
  // Enhanced question mappings based on actual Human Design psychology
  const questionMappings = getAdvancedQuestionMappings();
  
  // Process each answer with detailed analysis
  answers.forEach((answer, index) => {
    const questionId = index + 1;
    const mapping = questionMappings[questionId];
    
    if (mapping) {
      const weight = answer; // 1-5 scale
      const responseStrength = getResponseStrength(answer);
      
      // Store detailed answer analysis
      scores.detailed.answerAnalysis.push({
        questionId,
        answer,
        category: mapping.primaryCategory,
        strength: responseStrength,
        implication: getAnswerImplication(mapping, answer),
        weight: weight
      });
      
      // Add weighted scores to relevant categories
      mapping.categories.forEach(category => {
        if (scores[category.type] && scores[category.type][category.value] !== undefined) {
          const categoryWeight = weight * category.weight * category.confidence;
          scores[category.type][category.value] += categoryWeight;
          
          // Track category breakdown
          if (!scores.detailed.categoryBreakdown[category.type]) {
            scores.detailed.categoryBreakdown[category.type] = {};
          }
          if (!scores.detailed.categoryBreakdown[category.type][category.value]) {
            scores.detailed.categoryBreakdown[category.type][category.value] = 0;
          }
          scores.detailed.categoryBreakdown[category.type][category.value] += categoryWeight;
        }
      });
    }
  });
  
  // Determine primary type with confidence scoring
  const typeResult = determineTypeWithConfidence(scores.energyType);
  
  // Determine authority with type-specific validation
  const authorityResult = determineAuthorityWithConfidence(scores.authority, typeResult.type);
  
  // Determine profile with sophisticated analysis
  const profileResult = determineProfileWithConfidence(scores.profile);
  
  // Analyze centers with nuanced scoring
  const centersResult = analyzeCentersConfiguration(scores.centers);
  
  // Generate strength and challenge analysis
  const strengthsAndChallenges = analyzeStrengthsAndChallenges(scores.detailed.answerAnalysis);
  
  // Calculate alignment factors
  const alignmentFactors = calculateAlignmentFactors(typeResult, authorityResult, profileResult);
  
  return {
    type: typeResult.type,
    typeConfidence: typeResult.confidence,
    authority: authorityResult.authority,
    authorityConfidence: authorityResult.confidence,
    profile: profileResult.profile,
    profileCandidates: profileResult.candidates,
    profileConfidence: profileResult.confidence,
    centersTendency: centersResult.tendency,
    centersStrength: centersResult.strength,
    scores: scores,
    detailed: {
      ...scores.detailed,
      strengthAreas: strengthsAndChallenges.strengths,
      challengeAreas: strengthsAndChallenges.challenges,
      alignmentFactors: alignmentFactors,
      typeAnalysis: generateTypeAnalysis(typeResult, scores.detailed.answerAnalysis),
      authorityAnalysis: generateAuthorityAnalysis(authorityResult, scores.detailed.answerAnalysis),
      profileAnalysis: generateProfileAnalysis(profileResult, scores.detailed.answerAnalysis)
    },
    summary: generateAdvancedSummary(typeResult, authorityResult, profileResult, strengthsAndChallenges)
  };
}

function getAdvancedQuestionMappings() {
  // Sophisticated question mappings based on actual Human Design categories
  const mappings = {};
  
  // Define the actual question categories and map them to Human Design elements
  const categoryMappings = {
    'energy_type': [
      { questions: [1, 8, 14, 20, 27, 31, 34, 42, 45], type: 'generator', confidence: 0.9 },
      { questions: [6, 16, 21, 41, 51], type: 'manifestor', confidence: 0.9 },
      { questions: [4, 7, 17, 21, 29, 34, 46, 50], type: 'projector', confidence: 0.9 },
      { questions: [9, 22, 35, 47], type: 'reflector', confidence: 0.9 }
    ],
    'authority': [
      { questions: [10, 22, 33, 40, 48, 53], type: 'emotional', confidence: 0.85 },
      { questions: [3, 18, 26, 44, 59], type: 'sacral', confidence: 0.85 },
      { questions: [25, 32, 36, 49, 57], type: 'splenic', confidence: 0.85 },
      { questions: [24, 52], type: 'selfProjected', confidence: 0.8 },
      { questions: [11, 17, 43, 55], type: 'mental', confidence: 0.8 },
      { questions: [23, 39, 70], type: 'ego', confidence: 0.8 }
    ],
    'centers': [
      { questions: [11, 24, 43, 61], center: 'head', confidence: 0.8 },
      { questions: [4, 11, 17, 24, 43], center: 'ajna', confidence: 0.8 },
      { questions: [8, 12, 16, 20, 23, 31, 33, 45], center: 'throat', confidence: 0.8 },
      { questions: [7, 10, 13, 15, 25], center: 'g', confidence: 0.8 },
      { questions: [21, 23, 26, 39, 40, 70], center: 'heart', confidence: 0.8 },
      { questions: [3, 5, 9, 14, 27, 29, 34, 42, 59], center: 'sacral', confidence: 0.8 },
      { questions: [6, 22, 30, 35, 36, 37, 48, 53], center: 'solarPlexus', confidence: 0.8 },
      { questions: [18, 28, 30, 32, 44, 49, 50], center: 'spleen', confidence: 0.8 },
      { questions: [19, 38, 39, 41, 54, 58], center: 'root', confidence: 0.8 }
    ],
    'profile': [
      { questions: [64, 76, 84, 88], type: 'investigator', confidence: 0.8 },
      { questions: [65, 67, 85, 91], type: 'hermit', confidence: 0.8 },
      { questions: [66, 68, 86, 87], type: 'martyr', confidence: 0.8 },
      { questions: [71, 81, 89], type: 'opportunist', confidence: 0.8 },
      { questions: [72, 82, 92, 98], type: 'heretic', confidence: 0.8 },
      { questions: [75, 83, 97, 99], type: 'roleModel', confidence: 0.8 }
    ]
  };
  
  // Initialize all mappings
  for (let i = 1; i <= 100; i++) {
    mappings[i] = {
      primaryCategory: getQuestionPrimaryCategory(i),
      categories: []
    };
  }
  
  // Apply energy type mappings
  categoryMappings.energy_type.forEach(mapping => {
    mapping.questions.forEach(qId => {
      if (mappings[qId]) {
        mappings[qId].categories.push({
          type: 'energyType',
          value: mapping.type,
          weight: 1.0,
          confidence: mapping.confidence
        });
      }
    });
  });
  
  // Apply authority mappings
  categoryMappings.authority.forEach(mapping => {
    mapping.questions.forEach(qId => {
      if (mappings[qId]) {
        mappings[qId].categories.push({
          type: 'authority',
          value: mapping.type,
          weight: 0.9,
          confidence: mapping.confidence
        });
      }
    });
  });
  
  // Apply centers mappings
  categoryMappings.centers.forEach(mapping => {
    mapping.questions.forEach(qId => {
      if (mappings[qId]) {
        mappings[qId].categories.push({
          type: 'centers',
          value: mapping.center,
          weight: 0.8,
          confidence: mapping.confidence
        });
      }
    });
  });
  
  // Apply profile mappings
  categoryMappings.profile.forEach(mapping => {
    mapping.questions.forEach(qId => {
      if (mappings[qId]) {
        mappings[qId].categories.push({
          type: 'profile',
          value: mapping.type,
          weight: 1.0,
          confidence: mapping.confidence
        });
      }
    });
  });
  
  return mappings;
}

function getQuestionPrimaryCategory(questionId) {
  // Map questions to their primary categories
  const categories = {
    1: 'energy_type', 2: 'strategy', 3: 'authority', 4: 'projector_traits',
    5: 'energy_sensitivity', 6: 'manifestor_traits', 7: 'projector_traits',
    8: 'generator_traits', 9: 'reflector_traits', 10: 'emotional_authority',
    // ... continue mapping based on the actual questions.json structure
  };
  
  return categories[questionId] || 'general_trait';
}

function getResponseStrength(answer) {
  if (answer >= 4) return 'strong';
  if (answer <= 2) return 'weak';
  return 'moderate';
}

function getAnswerImplication(mapping, answer) {
  const strength = getResponseStrength(answer);
  const category = mapping.primaryCategory;
  
  if (strength === 'strong') {
    return `Strong alignment with ${category} characteristics`;
  } else if (strength === 'weak') {
    return `Low resonance with ${category} patterns`;
  }
  return `Moderate expression of ${category} traits`;
}

function determineTypeWithConfidence(typeScores) {
  const types = Object.keys(typeScores);
  const sortedTypes = types.sort((a, b) => typeScores[b] - typeScores[a]);
  
  const winner = sortedTypes[0];
  const runnerUp = sortedTypes[1];
  
  const total = types.reduce((sum, type) => sum + typeScores[type], 0);
  const winnerPercentage = total > 0 ? (typeScores[winner] / total) * 100 : 0;
  
  let confidence = 'high';
  if (winnerPercentage < 35) confidence = 'low';
  else if (winnerPercentage < 50) confidence = 'moderate';
  
  return {
    type: capitalizeFirst(winner),
    confidence,
    percentage: Math.round(winnerPercentage),
    scores: typeScores,
    alternatives: sortedTypes.slice(1, 3).map(type => ({
      type: capitalizeFirst(type),
      percentage: Math.round((typeScores[type] / total) * 100)
    }))
  };
}

function determineAuthorityWithConfidence(authorityScores, type) {
  const validAuthorities = getValidAuthorities(type.toLowerCase());
  const filteredScores = {};
  
  validAuthorities.forEach(auth => {
    filteredScores[auth] = authorityScores[auth] || 0;
  });
  
  const authorities = Object.keys(filteredScores);
  const sortedAuthorities = authorities.sort((a, b) => filteredScores[b] - filteredScores[a]);
  
  const winner = sortedAuthorities[0];
  const total = authorities.reduce((sum, auth) => sum + filteredScores[auth], 0);
  const winnerPercentage = total > 0 ? (filteredScores[winner] / total) * 100 : 0;
  
  let confidence = 'high';
  if (winnerPercentage < 40) confidence = 'low';
  else if (winnerPercentage < 60) confidence = 'moderate';
  
  return {
    authority: formatAuthority(winner),
    confidence,
    percentage: Math.round(winnerPercentage),
    scores: filteredScores,
    alternatives: sortedAuthorities.slice(1, 2).map(auth => ({
      authority: formatAuthority(auth),
      percentage: Math.round((filteredScores[auth] / total) * 100)
    }))
  };
}

function determineProfileWithConfidence(profileScores) {
  const profiles = Object.keys(profileScores);
  const sortedProfiles = profiles.sort((a, b) => profileScores[b] - profileScores[a]);
  
  const line1 = sortedProfiles[0];
  const line2 = sortedProfiles[1];
  
  const profile = `${getProfileNumber(line1)}/${getProfileNumber(line2)}`;
  const alternativeProfile = `${getProfileNumber(line2)}/${getProfileNumber(line1)}`;
  
  const total = profiles.reduce((sum, prof) => sum + profileScores[prof], 0);
  const confidence = total > 50 ? 'high' : total > 30 ? 'moderate' : 'low';
  
  return {
    profile,
    confidence,
    candidates: [profile, alternativeProfile],
    scores: profileScores,
    line1Analysis: getLineAnalysis(1, line1),
    line2Analysis: getLineAnalysis(2, line2)
  };
}

function analyzeCentersConfiguration(centersScores) {
  const centers = Object.keys(centersScores);
  const definedThreshold = 25; // Adjusted threshold for more accurate determination
  
  const tendency = centers.reduce((acc, center) => {
    acc[center] = {
      defined: centersScores[center] > definedThreshold,
      strength: centersScores[center],
      level: centersScores[center] > definedThreshold ? 'defined' : 'undefined'
    };
    return acc;
  }, {});
  
  const definedCenters = centers.filter(center => tendency[center].defined);
  const undefinedCenters = centers.filter(center => !tendency[center].defined);
  
  return {
    tendency,
    strength: {
      defined: definedCenters,
      undefined: undefinedCenters,
      definitionPercentage: Math.round((definedCenters.length / centers.length) * 100)
    }
  };
}

function analyzeStrengthsAndChallenges(answerAnalysis) {
  const strongAnswers = answerAnalysis.filter(a => a.strength === 'strong');
  const weakAnswers = answerAnalysis.filter(a => a.strength === 'weak');
  
  const strengthCategories = {};
  const challengeCategories = {};
  
  strongAnswers.forEach(answer => {
    strengthCategories[answer.category] = (strengthCategories[answer.category] || 0) + 1;
  });
  
  weakAnswers.forEach(answer => {
    challengeCategories[answer.category] = (challengeCategories[answer.category] || 0) + 1;
  });
  
  return {
    strengths: Object.keys(strengthCategories)
      .sort((a, b) => strengthCategories[b] - strengthCategories[a])
      .slice(0, 5),
    challenges: Object.keys(challengeCategories)
      .sort((a, b) => challengeCategories[b] - challengeCategories[a])
      .slice(0, 3)
  };
}

function calculateAlignmentFactors(typeResult, authorityResult, profileResult) {
  const factors = [];
  
  if (typeResult.confidence === 'high') {
    factors.push(`Strong ${typeResult.type} energy signature (${typeResult.percentage}% alignment)`);
  }
  
  if (authorityResult.confidence === 'high') {
    factors.push(`Clear ${authorityResult.authority} decision-making pattern`);
  }
  
  if (profileResult.confidence === 'high') {
    factors.push(`Consistent ${profileResult.profile} life theme expression`);
  }
  
  return factors;
}

function generateTypeAnalysis(typeResult, answerAnalysis) {
  const typeQuestions = answerAnalysis.filter(a => 
    a.category.includes('energy_type') || a.category.includes(typeResult.type.toLowerCase())
  );
  
  const strongTypeResponses = typeQuestions.filter(q => q.strength === 'strong').length;
  const totalTypeQuestions = typeQuestions.length;
  
  return {
    consistency: totalTypeQuestions > 0 ? Math.round((strongTypeResponses / totalTypeQuestions) * 100) : 0,
    keyIndicators: typeQuestions.slice(0, 3).map(q => ({
      questionId: q.questionId,
      response: q.answer,
      implication: q.implication
    }))
  };
}

function generateAuthorityAnalysis(authorityResult, answerAnalysis) {
  const authorityQuestions = answerAnalysis.filter(a => 
    a.category.includes('authority') || a.category.includes(authorityResult.authority.toLowerCase())
  );
  
  return {
    clarity: authorityResult.confidence,
    supportingEvidence: authorityQuestions.slice(0, 3).map(q => ({
      questionId: q.questionId,
      response: q.answer,
      implication: q.implication
    }))
  };
}

function generateProfileAnalysis(profileResult, answerAnalysis) {
  const profileQuestions = answerAnalysis.filter(a => a.category.includes('profile'));
  
  return {
    themeClarity: profileResult.confidence,
    line1Expression: profileResult.line1Analysis,
    line2Expression: profileResult.line2Analysis,
    supportingPatterns: profileQuestions.slice(0, 2).map(q => ({
      questionId: q.questionId,
      response: q.answer
    }))
  };
}

function generateAdvancedSummary(typeResult, authorityResult, profileResult, strengthsAndChallenges) {
  return `You show ${typeResult.confidence} alignment as a ${typeResult.type} with ${authorityResult.authority} authority. Your ${profileResult.profile} profile suggests ${getProfileTheme(profileResult.profile)}. Key strengths appear in ${strengthsAndChallenges.strengths.slice(0, 2).join(' and ')} areas.`;
}

function getLineAnalysis(lineNumber, lineType) {
  const lineAnalyses = {
    1: { investigator: 'Deep foundation building', hermit: 'Natural gifts', martyr: 'Trial and error learning' },
    2: { investigator: 'Research and study', hermit: 'Withdrawal and emergence', martyr: 'Experience-based wisdom' }
  };
  
  return lineAnalyses[lineNumber]?.[lineType] || 'Unique expression pattern';
}

function getProfileTheme(profile) {
  const themes = {
    '1/3': 'a foundation-building approach with experiential learning',
    '1/4': 'deep research combined with influential networking',
    '2/4': 'natural gifts expressed through relationships',
    '2/5': 'innate talents with universal solutions',
    '3/5': 'experiential learning with practical solutions',
    '3/6': 'trial and error leading to wisdom',
    '4/6': 'influential networking with role model potential',
    '4/1': 'relationship-based learning with solid foundations',
    '5/1': 'practical solutions backed by research',
    '5/2': 'universal solutions with natural gifts',
    '6/2': 'wisdom development with innate talents',
    '6/3': 'role model emergence through experience'
  };
  
  return themes[profile] || 'a unique life theme';
}

function getValidAuthorities(type) {
  const authoritiesByType = {
    generator: ['emotional', 'sacral', 'splenic'],
    manifestor: ['emotional', 'splenic', 'selfProjected'],
    projector: ['emotional', 'splenic', 'selfProjected', 'mental'],
    reflector: ['mental']
  };
  
  return authoritiesByType[type] || ['emotional'];
}

function getProfileNumber(profileName) {
  const profileNumbers = {
    investigator: 1,
    hermit: 2, 
    martyr: 3,
    opportunist: 4,
    heretic: 5,
    roleModel: 6
  };
  return profileNumbers[profileName] || 1;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatAuthority(authority) {
  const formatted = {
    emotional: 'Emotional',
    sacral: 'Sacral',
    splenic: 'Splenic',
    selfProjected: 'Self-Projected',
    mental: 'Mental'
  };
  return formatted[authority] || 'Emotional';
}

function generateQuizSummary(type, authority, profile) {
  return `Based on your responses, you show strong ${type} characteristics with ${formatAuthority(authority)} authority. Your profile tendency suggests a ${profile} pattern, indicating how you interact with life themes and others.`;
}