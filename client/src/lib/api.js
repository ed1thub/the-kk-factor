// Base URL of the API.
// Local development: leave VITE_API_BASE_URL empty. Vite proxies /api to the Express server.
// Staging: set VITE_API_BASE_URL to the App Service URL at build time (T1.19).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // auth tokens will travel in httpOnly cookies (T1.09)
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}
