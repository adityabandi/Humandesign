// Human Design Chart Calculation
// This module computes the Human Design chart from birth data

// Gate to I-Ching mapping (64 gates)
const gateWheel = {
  1: { name: "The Creative", center: "G", type: "expression" },
  2: { name: "The Receptive", center: "G", type: "expression" },
  3: { name: "Difficulty at the Beginning", center: "Sacral", type: "motor" },
  4: { name: "Youthful Folly", center: "Ajna", type: "pressure" },
  5: { name: "Waiting", center: "Sacral", type: "motor" },
  6: { name: "Conflict", center: "Solar Plexus", type: "motor" },
  7: { name: "The Army", center: "G", type: "expression" },
  8: { name: "Holding Together", center: "Throat", type: "expression" },
  9: { name: "The Taming Power of the Small", center: "Sacral", type: "motor" },
  10: { name: "Treading", center: "G", type: "expression" },
  11: { name: "Peace", center: "Ajna", type: "pressure" },
  12: { name: "Standstill", center: "Throat", type: "expression" },
  13: { name: "Fellowship with Men", center: "G", type: "expression" },
  14: { name: "Possession in Great Measure", center: "Sacral", type: "motor" },
  15: { name: "Modesty", center: "G", type: "expression" },
  16: { name: "Enthusiasm", center: "Throat", type: "expression" },
  17: { name: "Following", center: "Ajna", type: "pressure" },
  18: { name: "Work on What Has Been Spoiled", center: "Spleen", type: "awareness" },
  19: { name: "Approach", center: "Root", type: "pressure" },
  20: { name: "Contemplation", center: "Throat", type: "expression" },
  21: { name: "Biting Through", center: "Heart", type: "motor" },
  22: { name: "Grace", center: "Solar Plexus", type: "motor" },
  23: { name: "Splitting Apart", center: "Throat", type: "expression" },
  24: { name: "Return", center: "Ajna", type: "pressure" },
  25: { name: "Innocence", center: "G", type: "expression" },
  26: { name: "The Taming Power of the Great", center: "Heart", type: "motor" },
  27: { name: "The Corners of the Mouth", center: "Sacral", type: "motor" },
  28: { name: "Preponderance of the Great", center: "Spleen", type: "awareness" },
  29: { name: "The Abysmal", center: "Sacral", type: "motor" },
  30: { name: "The Clinging", center: "Solar Plexus", type: "motor" },
  31: { name: "Influence", center: "Throat", type: "expression" },
  32: { name: "Duration", center: "Spleen", type: "awareness" },
  33: { name: "Retreat", center: "Throat", type: "expression" },
  34: { name: "The Power of the Great", center: "Sacral", type: "motor" },
  35: { name: "Progress", center: "Solar Plexus", type: "motor" },
  36: { name: "Darkening of the Light", center: "Solar Plexus", type: "motor" },
  37: { name: "The Family", center: "Solar Plexus", type: "motor" },
  38: { name: "Opposition", center: "Root", type: "pressure" },
  39: { name: "Obstruction", center: "Root", type: "pressure" },
  40: { name: "Deliverance", center: "Heart", type: "motor" },
  41: { name: "Decrease", center: "Root", type: "pressure" },
  42: { name: "Increase", center: "Sacral", type: "motor" },
  43: { name: "Breakthrough", center: "Ajna", type: "pressure" },
  44: { name: "Coming to Meet", center: "Spleen", type: "awareness" },
  45: { name: "Gathering Together", center: "Throat", type: "expression" },
  46: { name: "Pushing Upward", center: "G", type: "expression" },
  47: { name: "Oppression", center: "Ajna", type: "pressure" },
  48: { name: "The Well", center: "Spleen", type: "awareness" },
  49: { name: "Revolution", center: "Solar Plexus", type: "motor" },
  50: { name: "The Cauldron", center: "Spleen", type: "awareness" },
  51: { name: "The Arousing", center: "Heart", type: "motor" },
  52: { name: "Keeping Still", center: "Root", type: "pressure" },
  53: { name: "Development", center: "Root", type: "pressure" },
  54: { name: "The Marrying Maiden", center: "Root", type: "pressure" },
  55: { name: "Abundance", center: "Solar Plexus", type: "motor" },
  56: { name: "The Wanderer", center: "Throat", type: "expression" },
  57: { name: "The Gentle", center: "Spleen", type: "awareness" },
  58: { name: "The Joyous", center: "Root", type: "pressure" },
  59: { name: "Dispersion", center: "Sacral", type: "motor" },
  60: { name: "Limitation", center: "Root", type: "pressure" },
  61: { name: "Inner Truth", center: "Head", type: "pressure" },
  62: { name: "Preponderance of the Small", center: "Throat", type: "expression" },
  63: { name: "After Completion", center: "Head", type: "pressure" },
  64: { name: "Before Completion", center: "Head", type: "pressure" }
};

// Center definitions
const centers = {
  "Head": { type: "pressure", color: "#E6F3FF" },
  "Ajna": { type: "awareness", color: "#E8F5E8" },
  "Throat": { type: "expression", color: "#FFF0E6" },
  "G": { type: "identity", color: "#FFE6F3" },
  "Heart": { type: "willpower", color: "#FFE6E6" },
  "Sacral": { type: "life-force", color: "#FFE6E6" },
  "Solar Plexus": { type: "emotional", color: "#FFFACD" },
  "Spleen": { type: "intuitive", color: "#E6F7FF" },
  "Root": { type: "pressure", color: "#F0E6FF" }
};

// 36 Channels (connections between gates)
const channels = [
  { gates: [1, 8], name: "Inspiration", connects: ["G", "Throat"] },
  { gates: [2, 14], name: "The Beat", connects: ["G", "Sacral"] },
  { gates: [3, 60], name: "Mutation", connects: ["Sacral", "Root"] },
  { gates: [4, 63], name: "Logic", connects: ["Ajna", "Head"] },
  { gates: [5, 15], name: "Rhythm", connects: ["Sacral", "G"] },
  { gates: [6, 59], name: "Mating", connects: ["Solar Plexus", "Sacral"] },
  { gates: [7, 31], name: "The Alpha", connects: ["G", "Throat"] },
  { gates: [9, 52], name: "Concentration", connects: ["Sacral", "Root"] },
  { gates: [10, 20], name: "Awakening", connects: ["G", "Throat"] },
  { gates: [10, 34], name: "Exploration", connects: ["G", "Sacral"] },
  { gates: [11, 56], name: "Curiosity", connects: ["Ajna", "Throat"] },
  { gates: [12, 22], name: "Openness", connects: ["Throat", "Solar Plexus"] },
  { gates: [13, 33], name: "The Prodigal", connects: ["G", "Throat"] },
  { gates: [16, 48], name: "Wavelength", connects: ["Throat", "Spleen"] },
  { gates: [17, 62], name: "Acceptance", connects: ["Ajna", "Throat"] },
  { gates: [18, 58], name: "Judgment", connects: ["Spleen", "Root"] },
  { gates: [19, 49], name: "Synthesis", connects: ["Root", "Solar Plexus"] },
  { gates: [21, 45], name: "Money Line", connects: ["Heart", "Throat"] },
  { gates: [23, 43], name: "Structuring", connects: ["Throat", "Ajna"] },
  { gates: [24, 61], name: "Awareness", connects: ["Ajna", "Head"] },
  { gates: [25, 51], name: "Initiation", connects: ["G", "Heart"] },
  { gates: [26, 44], name: "Surrender", connects: ["Heart", "Spleen"] },
  { gates: [27, 50], name: "Preservation", connects: ["Sacral", "Spleen"] },
  { gates: [28, 38], name: "Struggle", connects: ["Spleen", "Root"] },
  { gates: [29, 46], name: "Discovery", connects: ["Sacral", "G"] },
  { gates: [30, 41], name: "Recognition", connects: ["Solar Plexus", "Root"] },
  { gates: [32, 54], name: "Transformation", connects: ["Spleen", "Root"] },
  { gates: [35, 36], name: "Transitoriness", connects: ["Solar Plexus", "Solar Plexus"] },
  { gates: [37, 40], name: "Community", connects: ["Solar Plexus", "Heart"] },
  { gates: [39, 55], name: "Emoting", connects: ["Root", "Solar Plexus"] },
  { gates: [42, 53], name: "Maturation", connects: ["Sacral", "Root"] },
  { gates: [47, 64], name: "Abstraction", connects: ["Ajna", "Head"] },
  { gates: [57, 10], name: "Perfected Form", connects: ["Spleen", "G"] },
  { gates: [57, 20], name: "Brainwave", connects: ["Spleen", "Throat"] },
  { gates: [9, 52], name: "Concentration", connects: ["Sacral", "Root"] },
  { gates: [18, 58], name: "Judgment", connects: ["Spleen", "Root"] }
];

// Simplified ephemeris calculation (mock for demo)
function calculatePlanetaryPositions(birthData) {
  // In a real implementation, this would use swisseph-wasm or astronomia
  // For now, we'll return mock positions based on birth data
  const { date, time } = birthData;
  const birthDate = new Date(`${date}T${time}`);
  const dayOfYear = Math.floor((birthDate - new Date(birthDate.getFullYear(), 0, 0)) / 864000000);
  
  // Mock planetary positions (in real implementation, calculate actual ephemeris)
  return {
    sun: { gate: ((dayOfYear * 5.7) % 64) + 1, line: ((dayOfYear) % 6) + 1 },
    earth: { gate: (((dayOfYear * 5.7) + 32) % 64) + 1, line: ((dayOfYear + 3) % 6) + 1 },
    moon: { gate: ((dayOfYear * 13.3) % 64) + 1, line: ((dayOfYear * 2) % 6) + 1 },
    northNode: { gate: ((dayOfYear * 0.05) % 64) + 1, line: ((dayOfYear * 0.1) % 6) + 1 },
    southNode: { gate: (((dayOfYear * 0.05) + 32) % 64) + 1, line: (((dayOfYear * 0.1) + 3) % 6) + 1 },
    mercury: { gate: ((dayOfYear * 4.1) % 64) + 1, line: ((dayOfYear * 1.2) % 6) + 1 },
    venus: { gate: ((dayOfYear * 1.6) % 64) + 1, line: ((dayOfYear * 0.8) % 6) + 1 },
    mars: { gate: ((dayOfYear * 0.53) % 64) + 1, line: ((dayOfYear * 0.3) % 6) + 1 },
    jupiter: { gate: ((dayOfYear * 0.083) % 64) + 1, line: ((dayOfYear * 0.05) % 6) + 1 },
    saturn: { gate: ((dayOfYear * 0.034) % 64) + 1, line: ((dayOfYear * 0.02) % 6) + 1 },
    uranus: { gate: ((dayOfYear * 0.012) % 64) + 1, line: ((dayOfYear * 0.007) % 6) + 1 },
    neptune: { gate: ((dayOfYear * 0.006) % 64) + 1, line: ((dayOfYear * 0.003) % 6) + 1 },
    pluto: { gate: ((dayOfYear * 0.004) % 64) + 1, line: ((dayOfYear * 0.002) % 6) + 1 }
  };
}

function determineType(activatedCenters) {
  const sacralActive = activatedCenters.includes('Sacral');
  const throatActive = activatedCenters.includes('Throat');
  const heartActive = activatedCenters.includes('Heart');
  const rootActive = activatedCenters.includes('Root');
  const solarPlexusActive = activatedCenters.includes('Solar Plexus');
  
  if (sacralActive) {
    if (throatActive || heartActive) {
      return 'Manifesting Generator';
    }
    return 'Generator';
  }
  
  if (throatActive && (heartActive || rootActive)) {
    return 'Manifestor';
  }
  
  if (solarPlexusActive || sacralActive || heartActive || rootActive) {
    return 'Projector';
  }
  
  return 'Reflector';
}

function determineAuthority(activatedCenters, type) {
  if (activatedCenters.includes('Solar Plexus')) {
    return 'Emotional';
  }
  
  if (type === 'Generator' || type === 'Manifesting Generator') {
    if (activatedCenters.includes('Sacral')) {
      return 'Sacral';
    }
  }
  
  if (activatedCenters.includes('Spleen')) {
    return 'Splenic';
  }
  
  if (activatedCenters.includes('Heart')) {
    return 'Ego';
  }
  
  if (activatedCenters.includes('G')) {
    return 'Self-Projected';
  }
  
  if (activatedCenters.includes('Throat') && type === 'Projector') {
    return 'Mental';
  }
  
  return 'Lunar';
}

function determineProfile(sunLine, earthLine) {
  return `${sunLine}/${earthLine}`;
}

function calculateDefinition(activatedGates) {
  const activatedCenters = new Set();
  const activeChannels = [];
  
  // Find activated centers
  activatedGates.forEach(gate => {
    if (gateWheel[gate]) {
      activatedCenters.add(gateWheel[gate].center);
    }
  });
  
  // Find active channels
  channels.forEach(channel => {
    if (activatedGates.includes(channel.gates[0]) && activatedGates.includes(channel.gates[1])) {
      activeChannels.push(channel);
    }
  });
  
  // Determine definition type
  let definition = 'None';
  if (activeChannels.length > 0) {
    if (activeChannels.length <= 2) {
      definition = 'Single';
    } else if (activeChannels.length <= 4) {
      definition = 'Split';
    } else {
      definition = 'Triple Split';
    }
  }
  
  return {
    type: definition,
    activeChannels: activeChannels,
    activatedCenters: Array.from(activatedCenters)
  };
}

export async function computeChart(birthData) {
  try {
    // Calculate planetary positions
    const positions = calculatePlanetaryPositions(birthData);
    
    // Extract activated gates
    const activatedGates = Object.values(positions).map(pos => Math.floor(pos.gate));
    
    // Calculate definition
    const definition = calculateDefinition(activatedGates);
    
    // Determine type
    const type = determineType(definition.activatedCenters);
    
    // Determine authority
    const authority = determineAuthority(definition.activatedCenters, type);
    
    // Determine profile
    const profile = determineProfile(positions.sun.line, positions.earth.line);
    
    // Compile chart data
    const chartData = {
      type,
      authority,
      profile,
      definition: definition.type,
      centers: definition.activatedCenters.reduce((acc, center) => {
        acc[center] = { defined: true, gates: [] };
        return acc;
      }, {}),
      gates: activatedGates.reduce((acc, gate) => {
        acc[gate] = { active: true, center: gateWheel[gate]?.center };
        return acc;
      }, {}),
      channels: definition.activeChannels.map(ch => ({
        name: ch.name,
        gates: ch.gates,
        active: true
      })),
      positions
    };
    
    return chartData;
  } catch (error) {
    console.error('Chart calculation error:', error);
    throw new Error('Failed to compute chart: ' + error.message);
  }
}

// Export the gateWheel and other constants for use elsewhere
export { gateWheel, centers, channels };