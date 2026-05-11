/**
 * Request logging middleware
 * Logs incoming requests with timestamp and details
 */
export default function requestLogger(req, res, next) {
  const start = Date.now();

  // Hook response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}
