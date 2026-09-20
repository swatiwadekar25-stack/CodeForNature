const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Unable to reach the TeraPlus API. Check that the backend is running.', 0)
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `API request failed with status ${response.status}`,
      response.status,
      payload?.errors,
    )
  }

  return payload?.data
}

function jsonRequest(method, body) {
  return {
    method,
    body: JSON.stringify(body),
  }
}

export function getForests(filters = {}) {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })

  const queryString = query.toString()
  return apiRequest(`/forests${queryString ? `?${queryString}` : ''}`)
}

export function getForestById(id) {
  return apiRequest(`/forests/${encodeURIComponent(id)}`)
}

export function createForest(forest) {
  return apiRequest('/forests', jsonRequest('POST', forest))
}

export function updateForest(id, forest) {
  return apiRequest(`/forests/${encodeURIComponent(id)}`, jsonRequest('PUT', forest))
}

export function deleteForest(id) {
  return apiRequest(`/forests/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function getReports() {
  return apiRequest('/reports')
}

export function getReportById(id) {
  return apiRequest(`/reports/${encodeURIComponent(id)}`)
}

export function createReport(report) {
  return apiRequest('/reports', jsonRequest('POST', report))
}

export function updateReport(id, report) {
  return apiRequest(`/reports/${encodeURIComponent(id)}`, jsonRequest('PUT', report))
}

export function deleteReport(id) {
  return apiRequest(`/reports/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function getStatistics() {
  return apiRequest('/statistics')
}

export { API_URL }