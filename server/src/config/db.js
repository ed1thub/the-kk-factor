const mongoose = require('mongoose')
const env = require('./env')

// Connects to MongoDB (local Docker container in development, MongoDB Atlas on staging).
// If the database is unreachable the API still starts, and /api/health reports it,
// so a missing database never hides other start-up errors.
async function connectDatabase() {
  if (!env.mongodbUri) return

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 })
    console.log('[db] Connected to MongoDB')
  } catch (err) {
    console.error(`[db] Could not connect to MongoDB: ${err.message}`)
  }
}

function databaseStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}

module.exports = { connectDatabase, databaseStatus }
