// Any request that no route handled.
function notFound(req, res) {
  res.status(404).json({ error: 'Not found' })
}

module.exports = notFound
