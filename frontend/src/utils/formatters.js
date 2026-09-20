export function formatScore(score) {
  return typeof score === 'number' ? `${score}/100` : 'Not available'
}