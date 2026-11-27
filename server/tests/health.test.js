const request = require('supertest')
const app = require('../src/app')

// Smoke tests for the scaffold. The auth test suite is added in T1.12.
describe('GET /api/health', () => {
  it('returns API status', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(['connected', 'disconnected']).toContain(res.body.database)
  })

  it('sets security headers and hides X-Powered-By', async () => {
    const res = await request(app).get('/api/health')
    expect(res.headers['x-powered-by']).toBeUndefined()
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })
})

describe('Unknown routes', () => {
  it('return 404 JSON', async () => {
    const res = await request(app).get('/api/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Not found')
  })
})
