import dotenv from 'dotenv';
import http from 'http';
import path from 'path';

// Import app factory
import createApp, { initializeCache } from './app.js';
import { loadAllMarkdown } from './services/markdownService.js';
import { buildLineageGraph } from './services/lineageService.js';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_PORT_ATTEMPTS = 10;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);

// Create and start Express app
const app = createApp();
// const fileName = fileURLToPath(import.meta.url);
// const dirName = path.dirname(fileName);

// FIX: Actually use the .env variable, and resolve it from the project root!
const envPath = process.env.MARKDOWN_DATA_PATH || 'data/markdown';
const markdownDataPath = path.resolve(process.cwd(), envPath);

const objects = loadAllMarkdown(markdownDataPath);
const lineageGraph = buildLineageGraph(objects);
initializeCache(app, objects, lineageGraph);

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
    console.log(`✓ Elasticsearch: ${process.env.ELASTICSEARCH_URL || 'https://localhost:9200'}`);
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
