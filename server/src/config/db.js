const mongoose = require('mongoose')
const env = require('./env')

const RETRY_DELAY_MS = 5000

// Connects to MongoDB (local Docker container in development, MongoDB Atlas on staging).
// Mongoose does not retry a failed *first* connection by itself, so this function keeps
// retrying every 5 seconds. The API still starts and /api/health reports "disconnected"
// until the database is reachable (for example, if `npm run dev` is started before `npm run db:up`).
// Once connected, Mongoose handles later reconnections automatically.
async function connectDatabase() {
  if (!env.mongodbUri) return

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 })
    console.log('[db] Connected to MongoDB')
  } catch (err) {
    console.error(`[db] Could not connect to MongoDB: ${err.message}. Retrying in ${RETRY_DELAY_MS / 1000} s.`)
    setTimeout(connectDatabase, RETRY_DELAY_MS).unref()
  }
}

function databaseStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}

module.exports = { connectDatabase, databaseStatus }
