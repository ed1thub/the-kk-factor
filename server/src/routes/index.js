const { Router } = require('express')
const healthRoutes = require('./healthRoutes')

// Mounts every API route under /api.
// Planned: authRoutes (T1.08) and articleRoutes (T1.13).
const router = Router()

router.use('/health', healthRoutes)

module.exports = router
