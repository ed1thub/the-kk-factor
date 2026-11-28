const app = require('./app')
const env = require('./config/env')
const { connectDatabase } = require('./config/db')

async function start() {
  await connectDatabase()
  app.listen(env.port, () => {
    console.log(`[api] Listening on http://localhost:${env.port} (${env.nodeEnv})`)
  })
}

start()
