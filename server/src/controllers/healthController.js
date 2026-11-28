const { databaseStatus } = require('../config/db')

// GET /api/health
// Reports whether the API is running and whether it can reach the database.
// Deliberately returns no version numbers, environment names or other internal details.
function getHealth(req, res) {
  res.json({
    status: 'ok',
    database: databaseStatus(),
  })
}

module.exports = { getHealth }
