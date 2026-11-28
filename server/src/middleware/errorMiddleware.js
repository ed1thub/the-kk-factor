const env = require('../config/env')

// Handles any request that no route matched.
function notFound(req, res) {
  res.status(404).json({ error: 'Not found' })
}

// Central error handler. Express recognises it by its four arguments.
// In production it never returns stack traces or internal error messages to the client,
// so implementation details are not exposed (OWASP Top 10: Security Misconfiguration).
// "_next" is unused but must stay: Express only treats four-argument functions as error handlers.
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500

  if (status >= 500) {
    console.error('[error]', err)
  }

  res.status(status).json({
    error: status >= 500 && env.isProduction ? 'Internal server error' : err.message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  })
}

module.exports = { notFound, errorHandler }
