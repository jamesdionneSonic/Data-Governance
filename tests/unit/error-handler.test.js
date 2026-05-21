import errorHandler, { ApiError } from '../../src/middleware/errorHandler.js';

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
});
