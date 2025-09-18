// Advanced integration insights between quiz and chart
export function deriveIntegration(quizDerived, chartDerived) {
  const insights = [];
  
  // Deep type analysis
  const typeInsight = analyzeTypeAlignment(quizDerived, chartDerived);
  insights.push(typeInsight);
  
  // Authority comparison
  const authorityInsight = analyzeAuthorityAlignment(quizDerived, chartDerived);
  insights.push(authorityInsight);
  
  // Profile analysis
  const profileInsight = analyzeProfileAlignment(quizDerived, chartDerived);
  insights.push(profileInsight);
  
  // Centers configuration analysis
  const centersInsight = analyzeCentersAlignment(quizDerived, chartDerived);
  insights.push(centersInsight);
  
  // Integration recommendations
  const strategicInsight = generateStrategicRecommendations(quizDerived, chartDerived);
  insights.push(strategicInsight);
  
  // Detailed answer analysis vs chart
  const answerAnalysis = analyzeAnswerVsChart(quizDerived, chartDerived);
  insights.push(...answerAnalysis);
  
  return insights;
}

function analyzeTypeAlignment(quiz, chart) {
  const quizType = quiz.type.toLowerCase();
  const chartType = chart.type.toLowerCase();
  const quizConfidence = quiz.typeConfidence || 'moderate';
  
  if (quizType === chartType) {
    if (quizConfidence === 'high') {
      return `✅ Excellent type alignment: Your quiz responses strongly confirm your ${chartType} nature from your birth chart (${quiz.typeAnalysis?.consistency || 0}% consistency). You're living very authentically according to your design.`;
    } else {
      return `✅ Good type alignment: Your quiz responses confirm your ${chartType} nature, though with some variations (${quiz.typeAnalysis?.consistency || 0}% consistency). This suggests you're on the right track but may benefit from deeper exploration.`;
    }
  } else {
    const alternatives = quiz.detailed?.typeAnalysis?.alternatives || [];
    const chartInAlternatives = alternatives.some(alt => alt.type.toLowerCase() === chartType);
    
    if (chartInAlternatives) {
      return `⚠️ Mixed type signals: Your quiz suggests ${quizType} tendencies (${quiz.percentage || 0}%) while your chart shows ${chartType} design. Your chart type appeared as an alternative in your responses, suggesting you may be in transition or experiencing conditioning.`;
    } else {
      return `🔍 Significant type exploration needed: Your quiz strongly suggests ${quizType} patterns (confidence: ${quizConfidence}) while your chart shows ${chartType} design. This indicates either strong conditioning away from your natural design or you may be actively developing different aspects of yourself.`;
    }
  }
}

function analyzeAuthorityAlignment(quiz, chart) {
  const quizAuthority = quiz.authority.toLowerCase();
  const chartAuthority = chart.authority.toLowerCase();
  const quizConfidence = quiz.authorityConfidence || 'moderate';
  
  if (areAuthoritiesCompatible(quizAuthority, chartAuthority)) {
    return `✅ Authority alignment confirmed: Your quiz responses strongly support your ${chartAuthority} authority (confidence: ${quizConfidence}). Your decision-making patterns align with your natural design.`;
  } else {
    const quizAlternatives = quiz.detailed?.authorityAnalysis?.alternatives || [];
    const chartInAlternatives = quizAlternatives.some(alt => 
      areAuthoritiesCompatible(alt.authority.toLowerCase(), chartAuthority)
    );
    
    if (chartInAlternatives) {
      return `⚠️ Authority development opportunity: Your primary quiz pattern suggests ${quizAuthority} decision-making, but your chart's ${chartAuthority} authority appeared in your responses. Consider experimenting more with your chart's authority.`;
    } else {
      return `🔍 Authority reconditioning needed: Your quiz strongly indicates ${quizAuthority} decision-making patterns while your chart suggests ${chartAuthority} authority. This suggests you may be making decisions through conditioning rather than your natural authority.`;
    }
  }
}

function analyzeProfileAlignment(quiz, chart) {
  const quizProfile = quiz.profile;
  const chartProfile = chart.profile;
  const quizCandidates = quiz.profileCandidates || [];
  
  if (quizProfile === chartProfile || quizCandidates.includes(chartProfile)) {
    return `✅ Profile harmony: Your ${chartProfile} profile aligns with your quiz responses, suggesting authentic expression of your life theme. Your responses show consistent ${quiz.detailed?.profileAnalysis?.line1Expression || ''} and ${quiz.detailed?.profileAnalysis?.line2Expression || ''} patterns.`;
  } else {
    return `📚 Profile exploration opportunity: Your chart shows ${chartProfile} profile while your quiz suggests ${quizProfile}. Your life theme may be emerging differently than expected. Consider how the ${getProfileDescription(chartProfile)} theme might be developing in your experiences.`;
  }
}

function analyzeCentersAlignment(quiz, chart) {
  const quizCenters = quiz.centersTendency || {};
  const chartCenters = chart.centers || {};
  
  let alignedCenters = 0;
  let totalCenters = 0;
  const misalignments = [];
  
  Object.keys(chartCenters).forEach(center => {
    if (quizCenters[center] && chartCenters[center]) {
      totalCenters++;
      const quizDefined = quizCenters[center].defined || quizCenters[center] === 'defined';
      const chartDefined = chartCenters[center].defined;
      
      if (quizDefined === chartDefined) {
        alignedCenters++;
      } else {
        misalignments.push({
          center,
          quiz: quizDefined ? 'defined' : 'undefined',
          chart: chartDefined ? 'defined' : 'undefined'
        });
      }
    }
  });
  
  const alignmentPercentage = totalCenters > 0 ? Math.round((alignedCenters / totalCenters) * 100) : 0;
  
  if (alignmentPercentage >= 80) {
    return `✅ Excellent centers alignment: ${alignmentPercentage}% of your centers match between quiz and chart. You're expressing your defined centers consistently and working appropriately with your undefined centers.`;
  } else if (alignmentPercentage >= 60) {
    return `⚠️ Good centers alignment with growth areas: ${alignmentPercentage}% centers alignment. Some misalignments in ${misalignments.slice(0, 2).map(m => m.center).join(', ')} may indicate conditioning or areas for development.`;
  } else {
    return `🔍 Centers reconditioning opportunity: ${alignmentPercentage}% centers alignment suggests significant conditioning. Focus on understanding your defined centers (${Object.keys(chartCenters).filter(c => chartCenters[c].defined).join(', ')}) as your reliable energy sources.`;
  }
}

function generateStrategicRecommendations(quiz, chart) {
  const recommendations = [];
  
  // Type-specific strategy
  const typeStrategy = getTypeStrategy(chart.type);
  recommendations.push(`🎯 Strategy focus: ${typeStrategy}`);
  
  // Authority development
  const authorityGuidance = getAuthorityGuidance(chart.authority, quiz.authority);
  recommendations.push(`🧭 Authority development: ${authorityGuidance}`);
  
  // Profile integration
  const profileGuidance = getProfileGuidance(chart.profile);
  recommendations.push(`🌟 Profile integration: ${profileGuidance}`);
  
  return recommendations.join(' ');
}

function analyzeAnswerVsChart(quiz, chart) {
  const insights = [];
  const answerAnalysis = quiz.detailed?.answerAnalysis || [];
  
  // Find questions where quiz answers strongly contradict chart
  const contradictions = answerAnalysis.filter(answer => {
    if (answer.strength === 'strong') {
      // Check if this strong answer contradicts the chart
      return checkAnswerChartContradiction(answer, chart);
    }
    return false;
  });
  
  if (contradictions.length > 0) {
    insights.push(`🔍 Reconditioning opportunities: Found ${contradictions.length} strong responses that differ from your chart design. This suggests areas where you might be operating from conditioning rather than your natural design.`);
  }
  
  // Find areas of strong alignment
  const alignments = answerAnalysis.filter(answer => 
    answer.strength === 'strong' && checkAnswerChartAlignment(answer, chart)
  );
  
  if (alignments.length > 0) {
    insights.push(`✅ Authentic expression areas: You show strong authentic patterns in ${Math.round((alignments.length / answerAnalysis.length) * 100)}% of your responses, particularly in areas related to your chart's defined centers.`);
  }
  
  return insights;
}

function areAuthoritiesCompatible(auth1, auth2) {
  const compatibilityMap = {
    'emotional': ['emotional', 'solar plexus'],
    'sacral': ['sacral', 'gut'],
    'splenic': ['splenic', 'spleen', 'intuitive'],
    'self-projected': ['self-projected', 'self projected', 'throat'],
    'mental': ['mental', 'outer', 'environmental'],
    'ego': ['ego', 'heart', 'will']
  };
  
  const auth1Variations = compatibilityMap[auth1] || [auth1];
  const auth2Variations = compatibilityMap[auth2] || [auth2];
  
  return auth1Variations.some(a1 => 
    auth2Variations.some(a2 => 
      a1.includes(a2) || a2.includes(a1)
    )
  );
}

function getProfileDescription(profile) {
  const descriptions = {
    '1/3': 'Investigator/Martyr - foundation building through trial and error',
    '1/4': 'Investigator/Opportunist - research and networking',
    '2/4': 'Hermit/Opportunist - natural gifts through relationships',
    '2/5': 'Hermit/Heretic - innate talents with universal solutions',
    '3/5': 'Martyr/Heretic - experiential learning with practical solutions',
    '3/6': 'Martyr/Role Model - trial and error leading to wisdom',
    '4/6': 'Opportunist/Role Model - influential networking with wisdom',
    '4/1': 'Opportunist/Investigator - relationship-based foundations',
    '5/1': 'Heretic/Investigator - researched practical solutions',
    '5/2': 'Heretic/Hermit - universal solutions with natural gifts',
    '6/2': 'Role Model/Hermit - wisdom with innate talents',
    '6/3': 'Role Model/Martyr - wisdom through experience'
  };
  
  return descriptions[profile] || `Profile ${profile}`;
}

function getTypeStrategy(type) {
  const strategies = {
    'Generator': 'Respond to life with your sacral gut instinct. Wait for things to come to you and respond with your energy.',
    'Manifestor': 'Initiate action and inform others. Your role is to make things happen and communicate your intentions.',
    'Projector': 'Wait for invitations and recognition. Focus on mastering systems and guiding others when invited.',
    'Reflector': 'Wait a lunar cycle for major decisions. Sample your environment and reflect the health of your community.'
  };
  return strategies[type] || 'Follow your unique strategy';
}

function getAuthorityGuidance(chartAuthority, quizAuthority) {
  if (areAuthoritiesCompatible(chartAuthority.toLowerCase(), quizAuthority.toLowerCase())) {
    return `Continue developing your ${chartAuthority} authority as shown in your responses.`;
  } else {
    return `Practice using your ${chartAuthority} authority instead of your conditioned ${quizAuthority} patterns.`;
  }
}

function getProfileGuidance(profile) {
  const guidance = {
    '1/3': 'Build solid foundations through research and learn from your experiences',
    '1/4': 'Combine deep study with networking and sharing your knowledge',
    '2/4': 'Honor your need for alone time while building meaningful relationships',
    '2/5': 'Develop your natural gifts and share practical solutions when called',
    '3/5': 'Learn through experience and provide solutions based on what you\'ve tried',
    '3/6': 'In your first Saturn return, focus on experimentation; later, become a wise role model',
    '4/6': 'Build your network while developing wisdom to share later in life',
    '4/1': 'Ground your networking in solid research and foundations',
    '5/1': 'Back your universal solutions with thorough investigation',
    '5/2': 'Balance your calling to provide solutions with your need for solitude',
    '6/2': 'Develop your wisdom while honoring your natural gifts',
    '6/3': 'Use your life experiences to become a wise example for others'
  };
  
  return guidance[profile] || 'Live according to your unique profile theme';
}

function checkAnswerChartContradiction(answer, chart) {
  // Simplified logic - in reality this would be much more sophisticated
  // Check if strong answers contradict chart elements
  if (answer.category.includes('authority')) {
    return !areAuthoritiesCompatible(answer.category, chart.authority.toLowerCase());
  }
  
  if (answer.category.includes('energy_type')) {
    return !answer.category.includes(chart.type.toLowerCase());
  }
  
  return false; // Default to no contradiction
}

function checkAnswerChartAlignment(answer, chart) {
  // Check if strong answers align with chart elements
  if (answer.category.includes('authority')) {
    return areAuthoritiesCompatible(answer.category, chart.authority.toLowerCase());
  }
  
  if (answer.category.includes('energy_type')) {
    return answer.category.includes(chart.type.toLowerCase());
  }
  
  return true; // Default to alignment
}

function getStrategyInsight(type) {
  const strategies = {
    'Generator': '⚡ Strategy: Respond to life rather than initiating. Wait for things to come to you, then follow your gut response.',
    'Manifesting Generator': '🚀 Strategy: Respond first, then inform. You can move quickly but need to communicate your actions to others.',
    'Manifestor': '🎯 Strategy: Inform before you act. Your power to initiate requires keeping others in the loop to avoid resistance.',
    'Projector': '🔍 Strategy: Wait for invitation and recognition. Your gift is guidance, but it must be invited to be received.',
    'Reflector': '🌙 Strategy: Wait a lunar cycle before major decisions. You reflect the health of your community and environment.'
  };
  
  return strategies[type] || null;
}