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
  const requestedStatus = Number(err.status || err.statusCode || 500);
  const isValidHttpStatus =
    Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599;
  const status = isValidHttpStatus ? requestedStatus : 500;
  const originalMessage = err.message || 'Internal Server Error';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isServerError = status >= 500;
  const message = isServerError && !isDevelopment ? 'Internal Server Error' : originalMessage;
  const timestamp = new Date().toISOString();
  const requestId = req.requestId || req.headers['x-request-id'] || null;
  const legacyError = getLegacyErrorLabel(status, err);
  const safeDetails = isServerError && !isDevelopment ? null : err.details || null;

  console.error(
    `[ERROR] ${status} ${req.method} ${req.originalUrl} requestId=${requestId || 'n/a'}: ${originalMessage}`,
    err
  );

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
      details: safeDetails,
      path: req.originalUrl,
      method: req.method,
      requestId,
      timestamp,
      ...(isDevelopment && { stack: err.stack }),
    },
  };

  res.status(status).json({
    ...payload,
  });
}
