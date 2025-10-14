// Big 5 Personality Assessment scoring logic
// Cache for loaded questions
let questionsCache = null;

// Load questions from JSON file
async function loadQuestions() {
  if (questionsCache) return questionsCache;
  
  try {
    const response = await fetch('./assets/questions.json');
    questionsCache = await response.json();
    return questionsCache;
  } catch (error) {
    console.error('Failed to load questions:', error);
    // Try alternative path
    try {
      const response2 = await fetch('assets/questions.json');
      questionsCache = await response2.json();
      return questionsCache;
    } catch (error2) {
      console.error('Failed to load from alternative path:', error2);
      return null;
    }
  }
}

export async function scoreQuiz(answers, meta = {}) {
  // Validate answers array
  if (!Array.isArray(answers) || answers.length !== 100) {
    throw new Error('Invalid answers: must be array of 100 responses');
  }
  
  // Load actual questions for accurate scoring
  const questions = await loadQuestions();
  if (!questions) {
    throw new Error('Failed to load questions for scoring');
  }
  
  // Initialize Big 5 scoring system
  const scores = {
    big5: {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    },
    detailed: {
      answerAnalysis: [],
      categoryBreakdown: {},
      rawScores: {},
      percentileScores: {},
      interpretations: {}
    }
  };
  
  // Process each answer with Big 5 scoring using actual question data
  answers.forEach((answer, index) => {
    const questionId = index + 1;
    const question = questions.find(q => q.id === questionId);
    
    if (question) {
      const category = question.category;
      const isReversed = question.reverse_scored;
      
      // Calculate score (1-5 scale, reverse if needed)
      let score = answer;
      if (isReversed) {
        score = 6 - answer; // Reverse: 1->5, 2->4, 3->3, 4->2, 5->1
      }
      
      // Add to category total
      scores.big5[category] += score;
      
      // Store detailed analysis
      scores.detailed.answerAnalysis.push({
        questionId,
        answer,
        category: question.trait,
        isReversed,
        scoreContribution: score,
        question: question.question
      });
    }
  });

  // Calculate percentile scores (0-100 scale)
  // Each trait has 20 questions, so max score is 100, min is 20
  Object.keys(scores.big5).forEach(trait => {
    const rawScore = scores.big5[trait];
    const minPossible = 20; // 20 questions × 1 point minimum
    const maxPossible = 100; // 20 questions × 5 points maximum
    
    // Convert to 0-100 percentile
    const percentile = Math.round(((rawScore - minPossible) / (maxPossible - minPossible)) * 100);
    
    scores.detailed.rawScores[trait] = rawScore;
    scores.detailed.percentileScores[trait] = Math.max(0, Math.min(100, percentile));
  });

  // Generate interpretations for each trait
  scores.detailed.interpretations = generateBig5Interpretations(scores.detailed.percentileScores);

  // Format output string as specified in requirements
  const formattedScores = formatBig5Scores(scores.detailed.percentileScores);

  return {
    type: 'Big 5 Personality Assessment',
    authority: 'Statistical Analysis',
    profile: formattedScores,
    scores: scores.big5,
    detailed: scores.detailed,
    summary: generateBig5Summary(scores.detailed.percentileScores, scores.detailed.interpretations)
  };
}

// Format Big 5 scores as specified: "Openness=X Conscientiousness=Y, Extraversion=Z, Agreeableness=A, and Neuroticism=B"
function formatBig5Scores(percentileScores) {
  return `Openness=${percentileScores.openness} Conscientiousness=${percentileScores.conscientiousness}, Extraversion=${percentileScores.extraversion}, Agreeableness=${percentileScores.agreeableness}, and Neuroticism=${percentileScores.neuroticism}`;
}

// Generate interpretations for each Big 5 trait
function generateBig5Interpretations(percentileScores) {
  const interpretations = {};
  
  Object.keys(percentileScores).forEach(trait => {
    const score = percentileScores[trait];
    let level, description;
    
    if (score >= 80) {
      level = 'Very High';
    } else if (score >= 60) {
      level = 'High';
    } else if (score >= 40) {
      level = 'Moderate';
    } else if (score >= 20) {
      level = 'Low';
    } else {
      level = 'Very Low';
    }
    
    // Generate trait-specific descriptions
    switch (trait) {
      case 'openness':
        description = score >= 60 
          ? 'You are imaginative, curious, and open to new experiences. You enjoy exploring ideas and appreciate creativity.'
          : 'You prefer familiar routines and conventional approaches. You value tradition and practical solutions.';
        break;
      case 'conscientiousness':
        description = score >= 60
          ? 'You are organized, responsible, and goal-oriented. You plan ahead and work systematically toward your objectives.'
          : 'You are more flexible and spontaneous. You prefer to go with the flow rather than stick to rigid schedules.';
        break;
      case 'extraversion':
        description = score >= 60
          ? 'You are outgoing, energetic, and enjoy social interactions. You feel comfortable being the center of attention.'
          : 'You are more reserved and prefer quieter environments. You enjoy deep, meaningful conversations over large social gatherings.';
        break;
      case 'agreeableness':
        description = score >= 60
          ? 'You are compassionate, trusting, and cooperative. You prioritize harmony and consider others\' needs.'
          : 'You are more competitive and skeptical. You prioritize your own interests and question others\' motives.';
        break;
      case 'neuroticism':
        description = score >= 60
          ? 'You tend to experience negative emotions more intensely. You may worry frequently and feel stressed easily.'
          : 'You are emotionally stable and resilient. You handle stress well and maintain your composure under pressure.';
        break;
      default:
        description = `Your ${trait} score is ${score}.`;
    }
    
    interpretations[trait] = {
      score,
      level,
      description
    };
  });
  
  return interpretations;
}

// Generate overall Big 5 summary
function generateBig5Summary(percentileScores, interpretations) {
  const highestTrait = Object.keys(percentileScores).reduce((a, b) => 
    percentileScores[a] > percentileScores[b] ? a : b
  );
  
  const lowestTrait = Object.keys(percentileScores).reduce((a, b) => 
    percentileScores[a] < percentileScores[b] ? a : b
  );
  
  return {
    dominantTrait: {
      trait: highestTrait,
      score: percentileScores[highestTrait],
      description: interpretations[highestTrait].description
    },
    leastDominantTrait: {
      trait: lowestTrait, 
      score: percentileScores[lowestTrait],
      description: interpretations[lowestTrait].description
    },
    overallProfile: `Your personality profile shows ${interpretations[highestTrait].level} ${highestTrait} as your dominant trait, with ${interpretations[lowestTrait].level} ${lowestTrait} as your least dominant characteristic.`
  };
}