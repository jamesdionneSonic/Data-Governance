import fs from 'node:fs';
import path from 'node:path';
import { getProfileSchedulerStatus, startProfileSchedulerWorker } from '../src/services/connectorService.js';

const logPath = path.join(process.cwd(), 'logs', 'profile-scheduler-worker.log');
fs.mkdirSync(path.dirname(logPath), { recursive: true });

function log(message, details = null) {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    message,
    details,
  });
  fs.appendFileSync(logPath, `${line}\n`);
  console.log(line);
}

process.env.PROFILE_SCHEDULER_ENABLED = process.env.PROFILE_SCHEDULER_ENABLED || 'true';
process.env.PROFILE_SCHEDULER_INTERVAL_MS = process.env.PROFILE_SCHEDULER_INTERVAL_MS || '60000';

const status = startProfileSchedulerWorker({ enabled: true });
log('profile scheduler worker started', status);

const heartbeat = setInterval(() => {
  log('profile scheduler worker heartbeat', getProfileSchedulerStatus());
}, 5 * 60 * 1000);

function shutdown(signal) {
  clearInterval(heartbeat);
  log('profile scheduler worker stopping', { signal });
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
