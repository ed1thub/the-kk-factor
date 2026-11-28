const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const env = require('./config/env')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// The app is built here and started in server.js, so tests can import it without opening a port.
const app = express()

// On Azure, requests reach the API through proxies (Static Web Apps, then the App Service front end).
// Express needs this to read the real client IP for login throttling. The number of trusted
// hops is confirmed against staging request headers in T1.09 before throttling relies on it.
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
