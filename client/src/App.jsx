import { useEffect, useState } from 'react'
import { apiGet } from './lib/api.js'

// Placeholder page for the T1.03 scaffold. It proves the client can reach the API.
// The real app shell, home, category and article pages are built in T1.15.
function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiGet('/api/health')
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '3rem auto', padding: '0 1rem' }}>
      <h1>The KK Factor</h1>
      <p>Online News Portal: development scaffold.</p>

      <h2>API status</h2>
      {error && <p role="alert">API unreachable: {error}</p>}
      {!error && !health && <p>Checking...</p>}
      {health && (
        <ul>
          <li>API: {health.status}</li>
          <li>Database: {health.database}</li>
        </ul>
      )}
    </main>
  )
}

export default App
