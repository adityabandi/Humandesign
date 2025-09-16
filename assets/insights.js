// Integration insights between quiz and chart
export function deriveIntegration(quizDerived, chartDerived) {
  const insights = [];
  
  // Compare types
  const quizType = quizDerived.type.toLowerCase();
  const chartType = chartDerived.type.toLowerCase();
  
  if (quizType === chartType) {
    insights.push(`✅ Strong alignment: Your quiz responses confirm your ${chartType} nature from your birth chart. This suggests you're living authentically according to your design.`);
  } else {
    insights.push(`⚠️ Type exploration needed: Your quiz suggests ${quizType} tendencies while your chart shows ${chartType} design. This may indicate conditioning or growth opportunities.`);
  }
  
  // Compare authorities
  const quizAuthority = quizDerived.authority.toLowerCase();
  const chartAuthority = chartDerived.authority.toLowerCase();
  
  if (quizAuthority.includes(chartAuthority) || chartAuthority.includes(quizAuthority)) {
    insights.push(`✅ Authority reinforcement: Both your responses and chart point to ${chartAuthority} authority as your decision-making guidance system.`);
  } else {
    insights.push(`🔍 Authority development: Your chart suggests ${chartAuthority} authority, but your responses lean toward ${quizAuthority}. Consider experimenting with your chart's authority.`);
  }
  
  // Center analysis
  const definedCenters = Object.keys(chartDerived.centers).filter(center => 
    chartDerived.centers[center].defined
  );
  
  if (definedCenters.length > 0) {
    insights.push(`🎯 Focus areas: Your chart shows definition in ${definedCenters.join(', ')} center(s). These are your reliable, consistent energies to trust and express.`);
  }
  
  // Profile insight
  if (quizDerived.profileCandidates.includes(chartDerived.profile)) {
    insights.push(`✅ Profile harmony: Your ${chartDerived.profile} profile aligns with your quiz responses, suggesting authentic expression of your life theme.`);
  } else {
    insights.push(`📚 Profile exploration: Your chart shows ${chartDerived.profile} profile. Consider how this life theme might be emerging in your current experiences.`);
  }
  
  // Strategy insight based on type
  const strategyInsight = getStrategyInsight(chartDerived.type);
  if (strategyInsight) {
    insights.push(strategyInsight);
  }
  
  return insights;
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