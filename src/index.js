import dotenv from 'dotenv';
import http from 'http';

// Import app factory
import createApp from './app.js';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_PORT_ATTEMPTS = 10;

// Create and start Express app
const app = createApp();
let activeServer = null;

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
};

startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (activeServer) {
    activeServer.close(() => process.exit(0));
    return;
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  if (activeServer) {
    activeServer.close(() => process.exit(0));
    return;
  }
  process.exit(0);
});
