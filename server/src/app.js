const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const env = require('./config/env')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// The app is built here and started in server.js, so tests can import it without opening a port.
const app = express()

// Azure App Service sits behind a proxy; needed for correct client IPs (login throttling, T1.09).
app.set('trust proxy', 1)

// Secure-by-default baseline. The full policy (CSP and HSTS tuning, rate limiting,
// input validation) is hardened in T2.15.
app.use(helmet()) // secure HTTP headers; also removes X-Powered-By
app.use(
  cors({
    origin: env.clientOrigins, // allowlist only, never '*', because cookies are sent
    credentials: true,
  }),
)
app.use(express.json({ limit: '100kb' }))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
