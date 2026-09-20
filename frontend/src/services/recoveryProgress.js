function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

// Provider boundary for future satellite Proof of Recovery and RPI integrations.
// This first provider is a transparent sample estimate, not remote sensing data.
export const sampleRecoveryProvider = {
  source: 'Sample recovery data',
  getMetrics(forest) {
    return {
      progress: clamp(100 - forest.degradationScore, 0, 100),
      proofStatus: 'Sample only · no satellite proof',
      rpi: null,
    }
  },
}

export function getRecoveryMetrics(forest, provider = sampleRecoveryProvider) {
  return {
    source: provider.source,
    ...provider.getMetrics(forest),
  }
}