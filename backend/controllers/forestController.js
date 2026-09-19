import mongoose from 'mongoose';
import Forest from '../models/Forest.js';
import { calculateDegradationScore } from '../services/degradationScoringService.js';

const RISK_LEVELS = ['Green', 'Yellow', 'Red'];
const RESTORATION_STATUSES = ['Healthy', 'Recovering', 'Degraded', 'Restoration Initiated'];

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

function ensureValidId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError('Invalid forest ID', 400);
  }
}

function getExpectedRiskLevel(score) {
  if (score < 40) return 'Green';
  if (score < 70) return 'Yellow';
  return 'Red';
}

function validateDerivedScore(data) {
  const hasScore = data.degradationScore !== undefined;
  const hasRiskLevel = data.riskLevel !== undefined;

  if (!hasScore && !hasRiskLevel) {
    return;
  }

  if (!hasScore || !hasRiskLevel) {
    throw new AppError('degradationScore and riskLevel must be provided together', 400);
  }

  if (
    typeof data.degradationScore !== 'number'
    || !Number.isFinite(data.degradationScore)
    || data.degradationScore < 0
    || data.degradationScore > 100
  ) {
    throw new AppError('degradationScore must be a number between 0 and 100', 400);
  }

  if (!RISK_LEVELS.includes(data.riskLevel)) {
    throw new AppError(`riskLevel must be one of: ${RISK_LEVELS.join(', ')}`, 400);
  }

  if (getExpectedRiskLevel(data.degradationScore) !== data.riskLevel) {
    throw new AppError('riskLevel does not match degradationScore', 400);
  }
}

function prepareForestData(body, { requireDerivedFields = false } = {}) {
  const { environmentalFactors, ...forestData } = body;

  if (environmentalFactors !== undefined) {
    const scoring = calculateDegradationScore(environmentalFactors);
    forestData.degradationScore = scoring.score;
    forestData.riskLevel = scoring.riskLevel;
  } else {
    validateDerivedScore(forestData);
  }

  if (requireDerivedFields && (forestData.degradationScore === undefined || forestData.riskLevel === undefined)) {
    throw new AppError('degradationScore and riskLevel or environmentalFactors are required', 400);
  }

  if (forestData.restorationStatus !== undefined && !RESTORATION_STATUSES.includes(forestData.restorationStatus)) {
    throw new AppError(`restorationStatus must be one of: ${RESTORATION_STATUSES.join(', ')}`, 400);
  }

  return forestData;
}

function sendSuccess(response, data, statusCode = 200) {
  response.status(statusCode).json({ success: true, data });
}

export async function getForests(request, response) {
  const { search, riskLevel, restorationStatus } = request.query;
  const filter = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escapedSearch, $options: 'i' };
  }

  if (riskLevel) {
    if (!RISK_LEVELS.includes(riskLevel)) {
      throw new AppError(`riskLevel must be one of: ${RISK_LEVELS.join(', ')}`, 400);
    }
    filter.riskLevel = riskLevel;
  }

  if (restorationStatus) {
    if (!RESTORATION_STATUSES.includes(restorationStatus)) {
      throw new AppError(`restorationStatus must be one of: ${RESTORATION_STATUSES.join(', ')}`, 400);
    }
    filter.restorationStatus = restorationStatus;
  }

  const forests = await Forest.find(filter).sort({ createdAt: -1 });
  sendSuccess(response, forests);
}

export async function getForestById(request, response) {
  ensureValidId(request.params.id);
  const forest = await Forest.findById(request.params.id);

  if (!forest) {
    throw new AppError('Forest not found', 404);
  }

  sendSuccess(response, forest);
}

export async function createForest(request, response) {
  const forestData = prepareForestData(request.body, { requireDerivedFields: true });
  const forest = await Forest.create(forestData);
  sendSuccess(response, forest, 201);
}

export async function updateForest(request, response) {
  ensureValidId(request.params.id);
  const forest = await Forest.findById(request.params.id);

  if (!forest) {
    throw new AppError('Forest not found', 404);
  }

  const forestData = prepareForestData(request.body);
  Object.assign(forest, forestData);
  await forest.save();
  sendSuccess(response, forest);
}

export async function deleteForest(request, response) {
  ensureValidId(request.params.id);
  const forest = await Forest.findByIdAndDelete(request.params.id);

  if (!forest) {
    throw new AppError('Forest not found', 404);
  }

  sendSuccess(response, forest);
}