// Quiz scoring logic
export function scoreQuiz(answers, meta = {}) {
  // Validate answers array
  if (!Array.isArray(answers) || answers.length !== 100) {
    throw new Error('Invalid answers: must be array of 100 responses');
  }
  
  // Initialize scoring buckets
  const scores = {
    energyType: { generator: 0, manifestor: 0, projector: 0, reflector: 0 },
    authority: { emotional: 0, sacral: 0, splenic: 0, selfProjected: 0, mental: 0 },
    profile: { 
      investigator: 0, hermit: 0, martyr: 0, opportunist: 0, 
      heretic: 0, roleModel: 0 
    },
    centers: {
      head: 0, ajna: 0, throat: 0, g: 0, heart: 0,
      sacral: 0, solarPlexus: 0, spleen: 0, root: 0
    }
  };
  
  // Question categories and their mappings
  const questionMappings = getQuestionMappings();
  
  // Process each answer
  answers.forEach((answer, index) => {
    const questionId = index + 1;
    const mapping = questionMappings[questionId];
    
    if (mapping) {
      const weight = answer; // 1-5 scale
      
      // Add weighted scores to relevant categories
      mapping.categories.forEach(category => {
        if (scores[category.type] && scores[category.type][category.value] !== undefined) {
          scores[category.type][category.value] += weight * category.weight;
        }
      });
    }
  });
  
  // Determine primary type
  const type = Object.keys(scores.energyType).reduce((a, b) => 
    scores.energyType[a] > scores.energyType[b] ? a : b
  );
  
  // Determine authority (filter valid authorities for the type)
  const validAuthorities = getValidAuthorities(type);
  const authority = validAuthorities.reduce((a, b) => 
    scores.authority[a] > scores.authority[b] ? a : b
  );
  
  // Determine profile candidates (top 2 lines)
  const profileScores = scores.profile;
  const sortedProfiles = Object.keys(profileScores).sort((a, b) => profileScores[b] - profileScores[a]);
  const profileCandidates = [
    `${getProfileNumber(sortedProfiles[0])}/${getProfileNumber(sortedProfiles[1])}`,
    `${getProfileNumber(sortedProfiles[1])}/${getProfileNumber(sortedProfiles[0])}`
  ];
  
  // Determine centers tendency
  const centersTendency = Object.keys(scores.centers).reduce((acc, center) => {
    acc[center] = scores.centers[center] > 15 ? 'defined' : 'undefined'; // threshold
    return acc;
  }, {});
  
  return {
    type: capitalizeFirst(type),
    authority: formatAuthority(authority),
    profileCandidates,
    centersTendency,
    scores,
    summary: generateQuizSummary(type, authority, profileCandidates[0])
  };
}

function getQuestionMappings() {
  // This maps each question ID to scoring categories
  // In a real implementation, this would be more comprehensive
  const mappings = {};
  
  // Generator questions (1-25)
  for (let i = 1; i <= 25; i++) {
    mappings[i] = {
      categories: [
        { type: 'energyType', value: 'generator', weight: 1 },
        { type: 'authority', value: 'sacral', weight: 0.8 },
        { type: 'centers', value: 'sacral', weight: 1 }
      ]
    };
  }
  
  // Manifestor questions (26-40)
  for (let i = 26; i <= 40; i++) {
    mappings[i] = {
      categories: [
        { type: 'energyType', value: 'manifestor', weight: 1 },
        { type: 'authority', value: 'emotional', weight: 0.6 },
        { type: 'centers', value: 'throat', weight: 1 }
      ]
    };
  }
  
  // Projector questions (41-65)
  for (let i = 41; i <= 65; i++) {
    mappings[i] = {
      categories: [
        { type: 'energyType', value: 'projector', weight: 1 },
        { type: 'authority', value: 'splenic', weight: 0.7 },
        { type: 'centers', value: 'spleen', weight: 0.8 }
      ]
    };
  }
  
  // Reflector questions (66-80)
  for (let i = 66; i <= 80; i++) {
    mappings[i] = {
      categories: [
        { type: 'energyType', value: 'reflector', weight: 1 },
        { type: 'authority', value: 'mental', weight: 1 },
        { type: 'centers', value: 'g', weight: 0.5 }
      ]
    };
  }
  
  // Profile questions (81-100) 
  for (let i = 81; i <= 100; i++) {
    const profileIndex = (i - 81) % 6;
    const profiles = ['investigator', 'hermit', 'martyr', 'opportunist', 'heretic', 'roleModel'];
    mappings[i] = {
      categories: [
        { type: 'profile', value: profiles[profileIndex], weight: 1 }
      ]
    };
  }
  
  return mappings;
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