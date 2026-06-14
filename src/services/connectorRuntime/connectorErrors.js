export class ConnectorError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code || 'CONNECTOR_ERROR';
    this.connector_id = options.connector_id || null;
    this.connector_type = options.connector_type || null;
    this.stream = options.stream || null;
    this.phase = options.phase || 'unknown';
    this.status = options.status || 500;
    this.remediation = options.remediation || null;
    this.details = options.details || null;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      connector_id: this.connector_id,
      connector_type: this.connector_type,
      stream: this.stream,
      phase: this.phase,
      status: this.status,
      remediation: this.remediation,
      details: this.details,
    };
  }
}

export class ConnectorConfigError extends ConnectorError {
  constructor(message, options = {}) {
    super(message, {
      code: 'CONNECTOR_CONFIG_ERROR',
      phase: 'configuration',
      status: 400,
      remediation: 'Review connector configuration and required fields before running extraction.',
      ...options,
    });
  }
}

export class ConnectorCredentialError extends ConnectorError {
  constructor(message, options = {}) {
    super(message, {
      code: 'CONNECTOR_CREDENTIAL_ERROR',
      phase: 'authentication',
      status: 400,
      remediation:
        'Confirm the connector has a valid credential mode and secret reference or managed identity.',
      ...options,
    });
  }
}

export class ConnectorRuntimeError extends ConnectorError {
  constructor(message, options = {}) {
    super(message, {
      code: 'CONNECTOR_RUNTIME_ERROR',
      phase: 'execution',
      status: 502,
      remediation:
        'Check source API availability, service-account permissions, and connector stream configuration.',
      ...options,
    });
  }
}

export class ConnectorStreamError extends ConnectorError {
  constructor(message, options = {}) {
    super(message, {
      code: 'CONNECTOR_STREAM_ERROR',
      phase: 'stream',
      status: 400,
      remediation:
        'Use a supported stream for this connector type or update the adapter stream map.',
      ...options,
    });
  }
}

export function serializeConnectorError(err) {
  if (err instanceof ConnectorError) {
    return err.toJSON();
  }
  return {
    name: err?.name || 'Error',
    code: err?.code || 'CONNECTOR_ERROR',
    message: err?.message || String(err),
    phase: err?.phase || 'unknown',
    status: err?.status || 500,
    remediation:
      err?.remediation || 'Review connector logs and retry after correcting the reported issue.',
    details: err?.details || null,
  };
}
