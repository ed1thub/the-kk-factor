const env = require('../config/env')

// Central error handler. In production it never returns stack traces or internal
// messages to the client (OWASP: security misconfiguration / information exposure).
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500

  if (status >= 500) {
    console.error('[error]', err)
  }

  res.status(status).json({
    error: status >= 500 && env.isProduction ? 'Internal server error' : err.message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  })
}

module.exports = errorHandler
