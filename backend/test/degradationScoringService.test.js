import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDegradationScore } from '../services/degradationScoringService.js';

const healthyFactors = {
  vegetationLoss: 10,
  fireImpact: 5,
  biodiversityLoss: 15,
  humanDisturbance: 20,
  soilDegradation: 10,
};

test('calculates a low-priority Green score', () => {
  const result = calculateDegradationScore(healthyFactors);

  assert.equal(result.score, 12);
  assert.equal(result.riskLevel, 'Green');
  assert.equal(result.priority, 'Low Priority');
});

test('assigns Yellow at the medium-priority boundary', () => {
  const result = calculateDegradationScore({
    vegetationLoss: 40,
    fireImpact: 40,
    biodiversityLoss: 40,
    humanDisturbance: 40,
    soilDegradation: 40,
  });

  assert.equal(result.score, 40);
  assert.equal(result.riskLevel, 'Yellow');
  assert.equal(result.priority, 'Medium Priority');
});

test('assigns Red at the high-priority boundary', () => {
  const result = calculateDegradationScore({
    vegetationLoss: 70,
    fireImpact: 70,
    biodiversityLoss: 70,
    humanDisturbance: 70,
    soilDegradation: 70,
  });

  assert.equal(result.score, 70);
  assert.equal(result.riskLevel, 'Red');
  assert.equal(result.priority, 'High Priority');
});

test('rejects missing or out-of-range factors', () => {
  assert.throws(
    () => calculateDegradationScore({ ...healthyFactors, fireImpact: 101 }),
    RangeError,
  );
  assert.throws(
    () => calculateDegradationScore({ ...healthyFactors, soilDegradation: undefined }),
    RangeError,
  );
});