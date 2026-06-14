import { diagnoseSqlServerConnectionVariantsInProcess } from '../src/services/connectorRuntime/sqlServerConnection.js';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

try {
  const raw = await readStdin();
  const payload = raw ? JSON.parse(raw) : {};
  const diagnostic = await diagnoseSqlServerConnectionVariantsInProcess(payload.connector || {}, {
    ...(payload.options || {}),
    processIsolated: false,
  });
  process.stdout.write(JSON.stringify(diagnostic));
} catch (err) {
  process.stdout.write(
    JSON.stringify({
      status: 'failed',
      tested_at: new Date().toISOString(),
      results: [
        {
          driver: 'diagnostic_worker',
          status: 'failed',
          error: {
            code: err.code || 'SQL_SERVER_DIAGNOSTIC_WORKER_ERROR',
            message: err.message,
            category: 'diagnostic_worker_error',
            remediation: 'Review the diagnostic worker input and backend logs.',
          },
        },
      ],
    })
  );
}
