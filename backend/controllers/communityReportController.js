import mongoose from 'mongoose';
import CommunityReport from '../models/CommunityReport.js';

const REPORT_FIELDS = [
  'reporterName',
  'email',
  'title',
  'description',
  'reportType',
  'location',
  'latitude',
  'longitude',
  'photo',
  'status',
];

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

function ensureValidId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError('Invalid report ID', 400);
  }
}

function pickReportFields(body = {}) {
  return REPORT_FIELDS.reduce((reportData, field) => {
    if (body[field] !== undefined) {
      reportData[field] = body[field];
    }
    return reportData;
  }, {});
}

function sendSuccess(response, data, statusCode = 200) {
  response.status(statusCode).json({ success: true, data });
}

export async function getReports(request, response) {
  const reports = await CommunityReport.find().sort({ createdAt: -1 });
  sendSuccess(response, reports);
}

export async function getReportById(request, response) {
  ensureValidId(request.params.id);
  const report = await CommunityReport.findById(request.params.id);

  if (!report) {
    throw new AppError('Community report not found', 404);
  }

  sendSuccess(response, report);
}

export async function createReport(request, response) {
  const report = await CommunityReport.create(pickReportFields(request.body));
  sendSuccess(response, report, 201);
}

export async function updateReport(request, response) {
  ensureValidId(request.params.id);
  const report = await CommunityReport.findById(request.params.id);

  if (!report) {
    throw new AppError('Community report not found', 404);
  }

  Object.assign(report, pickReportFields(request.body));
  await report.save();
  sendSuccess(response, report);
}

export async function deleteReport(request, response) {
  ensureValidId(request.params.id);
  const report = await CommunityReport.findByIdAndDelete(request.params.id);

  if (!report) {
    throw new AppError('Community report not found', 404);
  }

  sendSuccess(response, report);
}