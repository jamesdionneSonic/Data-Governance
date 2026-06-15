import dotenv from 'dotenv';
import http from 'http';
import path from 'path';

// Import app factory
import createApp from './app.js';
import { initializeCache } from './utils/cacheInitializer.js';
import { resolveLineageCorpus } from './services/lineageResolver.js';
import { loadRuntimeCatalog } from './services/catalogRuntimeService.js';
import {
  startProfileSchedulerWorker,
  stopProfileSchedulerWorker,
} from './services/connectorService.js';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_PORT_ATTEMPTS = 10;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);
const ALLOW_PORT_RETRY = process.env.ALLOW_PORT_RETRY === 'true';

// Create and start Express app
const app = createApp();
// const fileName = fileURLToPath(import.meta.url);
// const dirName = path.dirname(fileName);

// FIX: Actually use the .env variable, and resolve it from the project root!
const envPath = process.env.MARKDOWN_DATA_PATH || 'data/markdown';
const markdownDataPath = path.resolve(process.cwd(), envPath);

async function initializeMarkdownCacheInBackground() {
  const startedAt = Date.now();

  try {
    // Health checks must not wait for corpus-wide lineage reconciliation.
    if (process.env.RUN_STARTUP_LINEAGE_RESOLUTION === 'true') {
      await resolveLineageCorpus(markdownDataPath).catch((err) => {
        console.warn(`Startup lineage resolution skipped after error: ${err.message}`);
      });
    }

    const runtimeCatalog = await loadRuntimeCatalog(markdownDataPath);
    initializeCache(runtimeCatalog.objects, runtimeCatalog.lineageGraph, runtimeCatalog);
    console.log(
      `Data cache initialized with ${runtimeCatalog.objects.size} summary object(s) in ${
        Date.now() - startedAt
      }ms`
    );
  } catch (err) {
    console.warn(`Data cache initialization failed: ${err.message}`);
  }
}

let activeServer = null;
let isShuttingDown = false;

function shutdownWithTimeout(reason, exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${reason} received, shutting down gracefully...`);
  stopProfileSchedulerWorker();

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
    if (err?.code === 'EADDRINUSE' && ALLOW_PORT_RETRY && attemptsRemaining > 0) {
      const nextPort = port + 1;
      console.warn(
        `Port ${port} is in use. Retrying on ${nextPort} because ALLOW_PORT_RETRY=true.`
      );
      startServer(nextPort, attemptsRemaining - 1);
      return;
    }

    if (err?.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the existing process or start this app with a different PORT.`
      );
      shutdownWithTimeout('Port conflict', 1);
      return;
    }

    throw err;
  });

  server.listen(port, () => {
    activeServer = server;
    initializeMarkdownCacheInBackground();
    startProfileSchedulerWorker();
    console.log(`Data Governance Platform running at http://localhost:${port}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Elasticsearch: ${process.env.ELASTICSEARCH_URL || 'https://localhost:9200'}`);
    if (ALLOW_PORT_RETRY && port !== PORT) {
      console.warn(
        `Requested PORT=${PORT}, but the server is running at http://localhost:${port}.`
      );
    }
  });

  server.on('clientError', (err, socket) => {
    const expectedTestDisconnect =
      process.env.NODE_ENV === 'test' && ['ECONNRESET', 'HPE_INVALID_EOF_STATE'].includes(err.code);
    if (!expectedTestDisconnect) {
      console.warn('Client connection error:', err.message);
    }
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
