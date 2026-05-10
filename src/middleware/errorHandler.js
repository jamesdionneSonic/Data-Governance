/**
 * Error handling middleware
 * Catches and formats errors for consistent API responses
 */
export class ApiError extends Error {
  constructor(status, message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusCode = status;
    this.code = options.code;
    this.details = options.details;
  }
}

function getLegacyErrorLabel(status, err) {
  if (err.error && typeof err.error === 'string') {
    return err.error;
  }

  if (status === 400) return 'Bad Request';
  if (status === 401) return 'Unauthorized';
  if (status === 403) return 'Forbidden';
  if (status === 404) return 'Not Found';
  if (status === 409) return 'Conflict';
  if (status === 422) return 'Validation Error';
  if (status === 503) return 'Service Unavailable';
  return 'Internal Server Error';
}

export default function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const timestamp = new Date().toISOString();
  const requestId = req.requestId || req.headers['x-request-id'] || null;
  const legacyError = getLegacyErrorLabel(status, err);

  console.error(`[ERROR] ${status}: ${message}`, err);

  const payload = {
    status: 'error',
    error: legacyError,
    message,
    requestId,
    timestamp,
    errorInfo: {
      status,
      code: err.code || 'API_ERROR',
      message,
      details: err.details || null,
      path: req.originalUrl,
      method: req.method,
      requestId,
      timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(status).json({
    ...payload,
  });
}
