import { jest } from '@jest/globals';
import errorHandler, {
  ApiError,
  buildErrorResponse,
  sendErrorResponse,
  shouldLogApiError,
} from '../../src/middleware/errorHandler.js';

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('Error Handler Middleware', () => {
  const baseReq = {
    method: 'GET',
    originalUrl: '/api/v1/example',
    headers: {},
    requestId: 'req-123',
  };

  let originalNodeEnv;

  beforeAll(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('ERR-001: returns sanitized 500 message in production', () => {
    process.env.NODE_ENV = 'production';
    const req = { ...baseReq };
    const res = createMockRes();

    const err = new Error('Database connection string invalid');
    err.status = 500;

    errorHandler(err, req, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
    expect(res.body.errorInfo.message).toBe('Internal Server Error');
    expect(res.body.errorInfo.details).toBeNull();
    expect(res.body.requestId).toBe('req-123');
  });

  test('ERR-002: preserves client error message and details', () => {
    process.env.NODE_ENV = 'production';
    const req = { ...baseReq };
    const res = createMockRes();

    const err = new ApiError(400, 'Invalid payload', {
      code: 'VALIDATION_ERROR',
      details: { field: 'email' },
    });

    errorHandler(err, req, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid payload');
    expect(res.body.errorInfo.code).toBe('VALIDATION_ERROR');
    expect(res.body.errorInfo.details).toEqual({ field: 'email' });
  });

  test('ERR-003: includes stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const req = { ...baseReq };
    const res = createMockRes();

    const err = new Error('Development debug error');

    errorHandler(err, req, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body.errorInfo.stack).toBeDefined();
  });

  test('buildErrorResponse normalizes invalid status and uses safe defaults', () => {
    process.env.NODE_ENV = 'production';
    const req = {
      ...baseReq,
      requestId: undefined,
      headers: { 'x-request-id': 'header-request-id' },
    };

    const built = buildErrorResponse({ status: 200 }, req, {
      defaultMessage: 'Fallback message',
      timestamp: '2026-06-04T10:00:00.000Z',
    });

    expect(built.status).toBe(500);
    expect(built.body.requestId).toBe('header-request-id');
    expect(built.body.message).toBe('Internal Server Error');
    expect(built.body.errorInfo.details).toBeNull();
    expect(built.body.errorInfo.code).toBe('API_ERROR');
  });

  test('buildErrorResponse preserves client defaults and explicit labels', () => {
    process.env.NODE_ENV = 'development';
    const req = { ...baseReq, requestId: undefined, headers: {} };

    const built = buildErrorResponse({ statusCode: 418, error: 'Teapot' }, req, {
      code: 'CUSTOM_CODE',
      details: { cup: true },
      timestamp: '2026-06-04T10:01:00.000Z',
    });

    expect(built.status).toBe(418);
    expect(built.body.error).toBe('Teapot');
    expect(built.body.message).toBe('Internal Server Error');
    expect(built.body.requestId).toBeNull();
    expect(built.body.errorInfo.code).toBe('CUSTOM_CODE');
    expect(built.body.errorInfo.details).toEqual({ cup: true });
    expect(built.body.errorInfo.stack).toBeUndefined();
  });

  test('sendErrorResponse returns common legacy labels for client statuses', () => {
    process.env.NODE_ENV = 'production';
    const req = { ...baseReq };
    const cases = [
      [401, 'Unauthorized'],
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [409, 'Conflict'],
      [422, 'Validation Error'],
      [503, 'Service Unavailable'],
    ];

    for (const [status, label] of cases) {
      const res = createMockRes();
      sendErrorResponse(res, req, status, label);

      expect(res.statusCode).toBe(status);
      expect(res.body.error).toBe(label);
    }

    const defaultOptionsError = new ApiError(404, 'No options object');
    expect(defaultOptionsError.code).toBeUndefined();
    expect(defaultOptionsError.details).toBeUndefined();
  });

  test('test-mode logging suppresses expected client errors but keeps server errors loud', () => {
    process.env.NODE_ENV = 'test';

    expect(shouldLogApiError(400)).toBe(false);
    expect(shouldLogApiError(401)).toBe(false);
    expect(shouldLogApiError(404)).toBe(false);
    expect(shouldLogApiError(503)).toBe(true);

    process.env.NODE_ENV = 'production';

    expect(shouldLogApiError(401)).toBe(true);
    expect(shouldLogApiError(503)).toBe(true);
  });
});
