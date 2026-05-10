import dotenv from 'dotenv';
import http from 'http';

// Import app factory
import createApp from './app.js';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_PORT_ATTEMPTS = 10;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);

// Create and start Express app
const app = createApp();
let activeServer = null;
let isShuttingDown = false;

function shutdownWithTimeout(reason, exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${reason} received, shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    console.error(`Forced shutdown after ${SHUTDOWN_TIMEOUT_MS}ms`);
    process.exit(exitCode || 1);
  }, SHUTDOWN_TIMEOUT_MS);

  if (activeServer) {
    activeServer.close(() => {
      clearTimeout(forceExitTimer);
      process.exit(exitCode);
    });
    return;
  }

  clearTimeout(forceExitTimer);
  process.exit(exitCode);
}

const startServer = (port, attemptsRemaining = MAX_PORT_ATTEMPTS) => {
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err?.code === 'EADDRINUSE' && attemptsRemaining > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, attemptsRemaining - 1);
      return;
    }

    throw err;
  });

  server.listen(port, () => {
    activeServer = server;
    console.log(`✓ Data Governance Platform running on port ${port}`);
    console.log(`✓ Environment: ${NODE_ENV}`);
    console.log(`✓ Meilisearch: ${process.env.MEILISEARCH_HOST || 'http://localhost:7700'}`);
  });

  server.on('clientError', (err, socket) => {
    console.warn('Client connection error:', err.message);
    if (socket.writable) {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    }
  });
};

startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  shutdownWithTimeout('SIGTERM', 0);
});

process.on('SIGINT', () => {
  shutdownWithTimeout('SIGINT', 0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  shutdownWithTimeout('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdownWithTimeout('uncaughtException', 1);
});
