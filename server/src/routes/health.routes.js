const { Router } = require('express')
const env = require('../config/env')
const { databaseStatus } = require('../config/db')

const router = Router()

// GET /api/health: used by the client scaffold, CI smoke tests and Azure health checks.
// Returns no version numbers or internal details.
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    database: databaseStatus(),
    environment: env.nodeEnv,
  })
})

module.exports = router
