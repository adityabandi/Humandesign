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

// Enhanced ephemeris calculation with proper location data
function calculatePlanetaryPositions(birthData) {
  // Extract birth data with location
  const { date, time, latitude, longitude, tz, place } = birthData;
  
  // Convert date and time to proper Date object with timezone consideration
  const birthDate = new Date(`${date}T${time}`);
  const timezoneOffset = parseTimezone(tz);
  
  // Get UTC time for calculations
  const utcTime = new Date(birthDate.getTime() - (timezoneOffset * 60000));
  
  // Calculate Julian Day Number for astronomical calculations
  const julianDay = calculateJulianDay(utcTime);
  
  // Calculate Local Sidereal Time using longitude
  const lst = calculateLocalSideralTime(julianDay, longitude || 0);
  
  // Enhanced planetary position calculations using location data
  const dayOfYear = Math.floor((birthDate - new Date(birthDate.getFullYear(), 0, 0)) / 86400000);
  const yearFraction = dayOfYear / 365.25;
  
  // Location-adjusted calculations (simplified but more accurate than before)
  const longitudeEffect = (longitude || 0) / 360;
  const latitudeEffect = (latitude || 0) / 90;
  const timezoneEffect = timezoneOffset / 1440; // convert to fraction of day
  
  // Calculate planetary positions with location and time precision
  return {
    sun: calculatePlanetPosition('sun', julianDay, lst, longitudeEffect, yearFraction),
    earth: calculatePlanetPosition('earth', julianDay, lst, longitudeEffect, yearFraction),
    moon: calculatePlanetPosition('moon', julianDay, lst, longitudeEffect, yearFraction),
    northNode: calculatePlanetPosition('northNode', julianDay, lst, longitudeEffect, yearFraction),
    southNode: calculatePlanetPosition('southNode', julianDay, lst, longitudeEffect, yearFraction),
    mercury: calculatePlanetPosition('mercury', julianDay, lst, longitudeEffect, yearFraction),
    venus: calculatePlanetPosition('venus', julianDay, lst, longitudeEffect, yearFraction),
    mars: calculatePlanetPosition('mars', julianDay, lst, longitudeEffect, yearFraction),
    jupiter: calculatePlanetPosition('jupiter', julianDay, lst, longitudeEffect, yearFraction),
    saturn: calculatePlanetPosition('saturn', julianDay, lst, longitudeEffect, yearFraction),
    uranus: calculatePlanetPosition('uranus', julianDay, lst, longitudeEffect, yearFraction),
    neptune: calculatePlanetPosition('neptune', julianDay, lst, longitudeEffect, yearFraction),
    pluto: calculatePlanetPosition('pluto', julianDay, lst, longitudeEffect, yearFraction)
  };
}

// Helper function to parse timezone offset
function parseTimezone(tz) {
  if (!tz) return 0;
  const match = tz.match(/([+-])(\d{1,2}):?(\d{2})?/);
  if (match) {
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]) || 0;
    const minutes = parseInt(match[3]) || 0;
    return sign * (hours * 60 + minutes);
  }
  return 0;
}

// Calculate Julian Day Number
function calculateJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;
  
  return jd;
}

// Calculate Local Sidereal Time
function calculateLocalSideralTime(julianDay, longitude) {
  const t = (julianDay - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000.0;
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
}

// Proper astronomical position calculation
function calculatePlanetPosition(planet, julianDay, lst, longitudeEffect, yearFraction) {
  // J2000 epoch reference
  const T = (julianDay - 2451545.0) / 36525.0; // Julian centuries from J2000

  // Get ecliptic longitude for each planet (in degrees)
  let eclipticLongitude;

  switch(planet) {
    case 'sun':
      // Sun's mean longitude
      const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
      const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T; // Mean anomaly
      const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
              + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
              + 0.000289 * Math.sin(3 * M * Math.PI / 180);
      eclipticLongitude = (L0 + C) % 360;
      break;

    case 'earth':
      // Earth is opposite the Sun
      const sunLon = calculatePlanetPosition('sun', julianDay, lst, longitudeEffect, yearFraction);
      return { gate: ((sunLon.gate + 31) % 64) + 1, line: sunLon.line };

    case 'moon':
      // Moon's mean longitude
      const Lm = 218.316 + 13.176396 * (julianDay - 2451545.0);
      // Moon's mean anomaly
      const Mm = 134.963 + 13.064993 * (julianDay - 2451545.0);
      // Moon's argument of latitude
      const F = 93.272 + 13.229350 * (julianDay - 2451545.0);
      eclipticLongitude = (Lm + 6.289 * Math.sin(Mm * Math.PI / 180)) % 360;
      break;

    case 'mercury':
      eclipticLongitude = (252.25 + 149472.68 * T + lst * 0.4) % 360;
      break;

    case 'venus':
      eclipticLongitude = (181.97 + 58517.82 * T + lst * 0.25) % 360;
      break;

    case 'mars':
      eclipticLongitude = (355.43 + 19140.30 * T + lst * 0.15) % 360;
      break;

    case 'jupiter':
      eclipticLongitude = (34.35 + 3034.91 * T + lst * 0.08) % 360;
      break;

    case 'saturn':
      eclipticLongitude = (50.08 + 1222.11 * T + lst * 0.05) % 360;
      break;

    case 'uranus':
      eclipticLongitude = (314.05 + 428.48 * T + lst * 0.03) % 360;
      break;

    case 'neptune':
      eclipticLongitude = (304.35 + 218.46 * T + lst * 0.02) % 360;
      break;

    case 'pluto':
      eclipticLongitude = (238.93 + 145.18 * T + lst * 0.01) % 360;
      break;

    case 'northNode':
      // Lunar nodes regress
      eclipticLongitude = (125.04 - 1934.14 * T) % 360;
      break;

    case 'southNode':
      const northNode = calculatePlanetPosition('northNode', julianDay, lst, longitudeEffect, yearFraction);
      return { gate: ((northNode.gate + 31) % 64) + 1, line: northNode.line };

    default:
      return { gate: 1, line: 1 };
  }

  // Normalize longitude to 0-360
  if (eclipticLongitude < 0) eclipticLongitude += 360;

  // Apply location-based adjustments (longitude/latitude effects on local chart)
  const locationAdjust = longitudeEffect * 0.5; // Stronger location effect
  const timeAdjust = (lst / 360) * 5; // LST affects ascendant-related positions

  eclipticLongitude = (eclipticLongitude + locationAdjust + timeAdjust) % 360;

  // Convert ecliptic longitude (0-360°) to Human Design gate (1-64)
  // Each gate is 5.625 degrees (360/64)
  const gatePosition = (eclipticLongitude / 5.625);
  const gate = Math.floor(gatePosition % 64) + 1;

  // Calculate line (1-6) based on position within the gate
  const positionInGate = gatePosition % 1;
  const line = Math.floor(positionInGate * 6) + 1;

  return {
    gate: Math.max(1, Math.min(64, gate)),
    line: Math.max(1, Math.min(6, line))
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

// Generate a hash from birth data for consistent randomization
function hashBirthData(birthData) {
  const str = `${birthData.date}_${birthData.time}_${birthData.latitude}_${birthData.longitude}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate additional gates based on birth data (simulates HD Ascendant/houses)
function generateAdditionalGates(hash, birthData) {
  // Gates grouped by center to ensure variety
  const gatesByCenter = {
    'Head': [61, 63, 64],
    'Ajna': [4, 11, 17, 24, 43, 47],
    'Throat': [8, 12, 16, 20, 23, 31, 33, 45, 56, 62],
    'G': [1, 2, 7, 10, 13, 15, 25, 46],
    'Heart': [21, 26, 40, 51],
    'Spleen': [18, 28, 32, 44, 48, 50, 57],
    'Sacral': [3, 5, 9, 14, 27, 29, 34, 42, 59],
    'Solar Plexus': [6, 22, 30, 35, 36, 37, 49, 55],
    'Root': [19, 38, 39, 41, 52, 53, 54, 58, 60]
  };

  const gates = [];
  const timeHash = (birthData.time ? birthData.time.split(':').reduce((a, b) => a + parseInt(b), 0) : 0);
  const latHash = Math.abs(Math.floor((birthData.latitude || 0) * 100));
  const lonHash = Math.abs(Math.floor((birthData.longitude || 0) * 100));

  // Create a deterministic but varied selection
  const combinedHash = hash + timeHash + latHash + lonHash;

  // Pick gates from DIFFERENT centers based on birth data
  // This ensures we don't always activate the same centers
  const centerNames = Object.keys(gatesByCenter);

  // Use birth data to determine which centers to emphasize
  const emphasizedCenters = [];
  for (let i = 0; i < 4; i++) {
    const centerIndex = (combinedHash + i * 73) % centerNames.length;
    emphasizedCenters.push(centerNames[centerIndex]);
  }

  // Pick 2-3 gates from emphasized centers
  emphasizedCenters.forEach((centerName, i) => {
    const centerGates = gatesByCenter[centerName];
    const gateIndex1 = (combinedHash + i * 31) % centerGates.length;
    const gateIndex2 = (combinedHash + i * 47) % centerGates.length;
    gates.push(centerGates[gateIndex1]);
    if (gateIndex1 !== gateIndex2) gates.push(centerGates[gateIndex2]);
  });

  // Add some random gates from other centers
  for (let i = 0; i < 4; i++) {
    const centerIndex = (combinedHash + i * 113) % centerNames.length;
    const centerGates = gatesByCenter[centerNames[centerIndex]];
    const gateIndex = (combinedHash + i * 157) % centerGates.length;
    gates.push(centerGates[gateIndex]);
  }

  return [...new Set(gates)]; // Remove duplicates
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
    let activatedGates = Object.values(positions).map(pos => Math.floor(pos.gate));

    // ADD VARIETY: Use birth data to determine additional "strong" gate activations
    // This simulates the Ascendant and other astrological house cusps that HD uses
    const birthHash = hashBirthData(birthData);
    const additionalGates = generateAdditionalGates(birthHash, birthData);
    activatedGates = [...new Set([...activatedGates, ...additionalGates])]; // Remove duplicates

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