const { Router } = require('express')
const healthRoutes = require('./health.routes')

// Mounts every API route under /api.
// Auth routes (T1.08) and news routes (T1.13) are added here.
const router = Router()

router.use('/health', healthRoutes)

module.exports = router
