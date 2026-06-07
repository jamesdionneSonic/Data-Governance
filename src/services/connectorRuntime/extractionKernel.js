import { createConnectorAdapter, adapterCoverageReport } from './adapterFactory.js';
import { serializeConnectorError } from './connectorErrors.js';
import { summarizeCanonicalEvents, warningEvent } from './canonicalMetadata.js';
import { buildComputerFriendlyProfilePackage, buildConfluenceProfileSummary, profilingAnswer } from '../profilingExecutionService.js';
import {
  biProfileAnswer,
  buildBiConfluenceSummary,
  buildBiProfileFromExtraction,
  buildBiProfilePackage,
  buildBiProfilePlan,
} from '../biProfileService.js';

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

export async function planConnectorProfile({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  const plan = await adapter.planProfiling(options);
  return {
    connector_id: connector.id,
    connector_type: connector.type,
    adapter: adapter.constructor.name,
    capabilities: adapter.getCapabilities(),
    plan,
    captures_raw_data: false,
    requires_live_call: plan.safety?.execution_mode === 'live',
  };
}

export async function executeConnectorProfile({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  try {
    const plan = options.plan || (await adapter.planProfiling(options));
    const run = await adapter.runProfiling({ ...options, plan });
    return {
      status: run.status,
      connector_id: connector.id,
      connector_type: connector.type,
      adapter: adapter.constructor.name,
      executed_at: new Date().toISOString(),
      captures_raw_data: false,
      secret_exposed: false,
      plan,
      run,
      package: buildComputerFriendlyProfilePackage(run),
      confluence: buildConfluenceProfileSummary(run),
      answer: profilingAnswer(run),
      errors: run.errors || [],
    };
  } catch (err) {
    const serialized = serializeConnectorError(err);
    return {
      status: 'failed',
      connector_id: connector.id,
      connector_type: connector.type,
      adapter: adapter.constructor.name,
      executed_at: new Date().toISOString(),
      captures_raw_data: false,
      secret_exposed: false,
      plan: null,
      run: null,
      package: null,
      confluence: null,
      answer: {
        answer: `Live profiling failed for connector ${connector.id}: ${serialized.message}`,
        raw_values_retained: false,
      },
      errors: [serialized],
    };
  }
}

export async function planConnectorBiProfile({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  return buildBiProfilePlan({ connector, definition, adapter, options });
}

export async function executeConnectorBiProfile({ connector, definition, options = {} }) {
  const adapter = createConnectorAdapter({ connector, definition });
  try {
    const plan = buildBiProfilePlan({ connector, definition, adapter, options });
    const extraction = await executeConnectorExtraction({
      connector,
      definition,
      options: {
        fail_fast: false,
        ...options,
      },
    });
    const profile = buildBiProfileFromExtraction({ connector, definition, adapter, extraction, options });
    return {
      status: profile.status,
      connector_id: connector.id,
      connector_type: connector.type,
      adapter: adapter.constructor.name,
      executed_at: new Date().toISOString(),
      captures_raw_data: false,
      captures_raw_report_data: false,
      secret_exposed: false,
      plan,
      extraction: options.include_events === false ? { ...extraction, events: undefined } : extraction,
      profile,
      package: buildBiProfilePackage(profile),
      confluence: buildBiConfluenceSummary(profile),
      answer: biProfileAnswer(profile),
      errors: profile.errors || [],
      warnings: profile.warnings || [],
    };
  } catch (err) {
    const serialized = serializeConnectorError(err);
    return {
      status: 'failed',
      connector_id: connector.id,
      connector_type: connector.type,
      adapter: adapter.constructor.name,
      executed_at: new Date().toISOString(),
      captures_raw_data: false,
      captures_raw_report_data: false,
      secret_exposed: false,
      plan: null,
      extraction: null,
      profile: null,
      package: null,
      confluence: null,
      answer: {
        answer: `BI profiling failed for connector ${connector.id}: ${serialized.message}`,
        raw_values_retained: false,
        report_result_rows_queried: false,
      },
      errors: [serialized],
      warnings: [],
    };
  }
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
