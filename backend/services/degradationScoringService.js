/**
 * Sample degradation scoring model.
 *
 * Each factor is a normalized impact value from 0 to 100, where 0 means no
 * observed impact and 100 means the highest observed impact. The five factors
 * have equal weight, so the final score is their arithmetic mean:
 *
 * score = (vegetationLoss + fireImpact + biodiversityLoss +
 *          humanDisturbance + soilDegradation) / 5
 *
 * The inputs are intentionally provider-neutral. Future satellite, fire, or
 * AI integrations can map their measurements to these normalized factors
 * without changing the scoring or priority logic.
 */

const FACTOR_NAMES = [
  'vegetationLoss',
  'fireImpact',
  'biodiversityLoss',
  'humanDisturbance',
  'soilDegradation',
];

const RISK_LEVELS = {
  LOW: 'Green',
  MEDIUM: 'Yellow',
  HIGH: 'Red',
};

function validateFactorValue(name, value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${name} must be a finite number between 0 and 100`);
  }
}

function getPriority(score) {
  if (score < 40) {
    return { riskLevel: RISK_LEVELS.LOW, priority: 'Low Priority' };
  }

  if (score < 70) {
    return { riskLevel: RISK_LEVELS.MEDIUM, priority: 'Medium Priority' };
  }

  return { riskLevel: RISK_LEVELS.HIGH, priority: 'High Priority' };
}

export function calculateDegradationScore(factors) {
  if (!factors || typeof factors !== 'object') {
    throw new TypeError('Environmental factors must be provided as an object');
  }

  FACTOR_NAMES.forEach((factorName) => validateFactorValue(factorName, factors[factorName]));

  const total = FACTOR_NAMES.reduce((sum, factorName) => sum + factors[factorName], 0);
  const score = Math.round(total / FACTOR_NAMES.length);

  return {
    score,
    ...getPriority(score),
    factors: { ...factors },
  };
}

export { FACTOR_NAMES, RISK_LEVELS };