// Central place for configuration. Values come from environment variables:
// a local .env file in development (see .env.example), and App Service settings on Azure.

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongodbUri: process.env.MONGODB_URI || '',
  // Comma-separated list of front-end origins allowed to call the API with credentials.
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}

env.isProduction = env.nodeEnv === 'production'
env.isTest = env.nodeEnv === 'test'

if (!env.mongodbUri && !env.isTest) {
  console.warn('[config] MONGODB_URI is not set. Copy server/.env.example to server/.env.')
}

module.exports = env
