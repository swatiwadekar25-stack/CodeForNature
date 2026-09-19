import mongoose from 'mongoose';

const forestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    area: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    degradationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['Green', 'Yellow', 'Red'],
      required: true,
    },
    restorationStatus: {
      type: String,
      enum: ['Healthy', 'Recovering', 'Degraded', 'Restoration Initiated'],
      required: true,
    },
    damageTypes: {
      type: [String],
      default: [],
    },
    biodiversityStatus: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Forest = mongoose.models.Forest || mongoose.model('Forest', forestSchema);

export default Forest;