import mongoose from 'mongoose';

const communityReportSchema = new mongoose.Schema(
  {
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    photo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: 'Pending',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const CommunityReport = mongoose.models.CommunityReport
  || mongoose.model('CommunityReport', communityReportSchema);

export default CommunityReport;