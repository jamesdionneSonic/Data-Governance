import { createConnectorAdapter, adapterCoverageReport } from './adapterFactory.js';
import { serializeConnectorError } from './connectorErrors.js';
import { summarizeCanonicalEvents, warningEvent } from './canonicalMetadata.js';

export async function planConnectorExtraction({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  const capabilities = adapter.getCapabilities();
  const streams = adapter.selectedStreams(options);
  return {
    connector_id: connector.id,
    connector_type: connector.type,
    adapter: adapter.constructor.name,
    capabilities,
    streams: streams.map((stream) => adapter.streamPlan(stream)),
    captures_raw_data: false,
    requires_live_call: options.dry_run === false,
  };
}

export async function executeConnectorExtraction({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  const events = [];
  const streamResults = [];
  const errors = [];
  let connectionCheck;

  try {
    connectionCheck = await adapter.testConnection();
    events.push(...(connectionCheck.warnings || []));
  } catch (err) {
    const serialized = serializeConnectorError(err);
    errors.push(serialized);
    events.push(
      warningEvent({
        connector,
        stream: 'connection',
        message: serialized.message,
        severity: 'error',
        details: serialized,
      })
    );
    return buildExtractionResult({ connector, adapter, events, streamResults, errors, status: 'failed', options });
  }

  for (const stream of adapter.selectedStreams(options)) {
    try {
      const result = await adapter.readStream(stream.name, options);
      events.push(...result.events);
      streamResults.push({
        stream: stream.name,
        status: 'succeeded',
        event_count: result.events.length,
        state: result.state,
        plan: result.plan,
      });
    } catch (err) {
      const serialized = serializeConnectorError(err);
      errors.push(serialized);
      events.push(
        warningEvent({
          connector,
          stream: stream.name,
          message: serialized.message,
          severity: 'error',
          details: serialized,
        })
      );
      streamResults.push({
        stream: stream.name,
        status: 'failed',
        event_count: 0,
        error: serialized,
      });
      if (options.fail_fast !== false) break;
    }
  }

  const status = errors.length ? 'partial_failure' : 'succeeded';
  return buildExtractionResult({ connector, adapter, events, streamResults, errors, status, options });
}

function buildExtractionResult({ connector, adapter, events, streamResults, errors, status, options = {} }) {
  const summary = summarizeCanonicalEvents(events);
  return {
    status,
    connector_id: connector.id,
    connector_type: connector.type,
    adapter: adapter.constructor.name,
    extracted_at: new Date().toISOString(),
    captures_raw_data: false,
    secret_exposed: false,
    summary,
    stream_results: streamResults,
    errors,
    events,
    metadata: options.include_metadata ? adapter.lastMetadata || null : undefined,
  };
}

export function buildAdapterCoverage(definitions = []) {
  return {
    generated_at: new Date().toISOString(),
    definitions: adapterCoverageReport(definitions),
  };
}
