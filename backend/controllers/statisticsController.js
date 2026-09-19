import Forest from '../models/Forest.js';

const statisticsPipeline = [
  {
    $group: {
      _id: null,
      totalForestSites: { $sum: 1 },
      healthySites: {
        $sum: { $cond: [{ $eq: ['$restorationStatus', 'Healthy'] }, 1, 0] },
      },
      recoveringSites: {
        $sum: { $cond: [{ $eq: ['$restorationStatus', 'Recovering'] }, 1, 0] },
      },
      degradedSites: {
        $sum: { $cond: [{ $eq: ['$restorationStatus', 'Degraded'] }, 1, 0] },
      },
      restorationInitiatedSites: {
        $sum: { $cond: [{ $eq: ['$restorationStatus', 'Restoration Initiated'] }, 1, 0] },
      },
      greenPrioritySites: {
        $sum: { $cond: [{ $eq: ['$riskLevel', 'Green'] }, 1, 0] },
      },
      yellowPrioritySites: {
        $sum: { $cond: [{ $eq: ['$riskLevel', 'Yellow'] }, 1, 0] },
      },
      redPrioritySites: {
        $sum: { $cond: [{ $eq: ['$riskLevel', 'Red'] }, 1, 0] },
      },
      averageDegradationScore: { $avg: '$degradationScore' },
    },
  },
];

export async function getStatistics(request, response) {
  const [statistics] = await Forest.aggregate(statisticsPipeline);

  response.json({
    success: true,
    data: {
      totalForestSites: statistics?.totalForestSites || 0,
      healthySites: statistics?.healthySites || 0,
      recoveringSites: statistics?.recoveringSites || 0,
      degradedSites: statistics?.degradedSites || 0,
      restorationInitiatedSites: statistics?.restorationInitiatedSites || 0,
      greenPrioritySites: statistics?.greenPrioritySites || 0,
      yellowPrioritySites: statistics?.yellowPrioritySites || 0,
      redPrioritySites: statistics?.redPrioritySites || 0,
      averageDegradationScore: Number((statistics?.averageDegradationScore || 0).toFixed(2)),
    },
  });
}