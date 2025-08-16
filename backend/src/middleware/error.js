// Centralized error formatting (Zod + generic)
const { ZodError } = require('zod');

function errorHandler(err, req, res, next) { // eslint-disable-line
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: err.errors.map(e => ({ path: e.path, message: e.message }))
    });
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server Error' });
}

module.exports = { errorHandler };
