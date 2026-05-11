import { authenticate, requireAdmin, requireDatabaseAccess } from '../../src/middleware/auth.js';
import { generateToken } from '../../src/utils/tokenManager.js';

describe('middleware/auth', () => {
  function createNextSpy() {
    const calls = [];
    const next = (arg) => {
      calls.push([arg]);
    };
    next.calls = calls;
    return next;
  }

  test('authenticate rejects missing authorization header', () => {
    const req = { headers: {} };
    const next = createNextSpy();

    authenticate(req, {}, next);

    const error = next.calls[0][0];
    expect(error.status).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  test('authenticate rejects invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } };
    const next = createNextSpy();

    authenticate(req, {}, next);

    const error = next.calls[0][0];
    expect(error.status).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  test('authenticate attaches decoded user for valid token', () => {
    const token = generateToken({
      id: 'u-1',
      email: 'user@example.com',
      name: 'User',
      roles: ['Admin'],
      databases: ['sales'],
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = createNextSpy();

    authenticate(req, {}, next);

    expect(next.calls).toEqual([[undefined]]);
    expect(req.user).toEqual(
      expect.objectContaining({
        sub: 'u-1',
        email: 'user@example.com',
      })
    );
  });

  test('authenticate returns internal auth error on unexpected failure', () => {
    const req = { headers: { authorization: { bad: true } } };
    const next = createNextSpy();

    authenticate(req, {}, next);

    const error = next.calls[0][0];
    expect(error.status).toBe(500);
    expect(error.code).toBe('AUTHENTICATION_ERROR');
  });

  test('requireAdmin enforces authentication and admin role', () => {
    const noUserNext = createNextSpy();
    requireAdmin({}, {}, noUserNext);
    expect(noUserNext.calls[0][0].status).toBe(401);

    const nonAdminNext = createNextSpy();
    requireAdmin({ user: { roles: ['User'] } }, {}, nonAdminNext);
    expect(nonAdminNext.calls[0][0].status).toBe(403);

    const adminNext = createNextSpy();
    requireAdmin({ user: { roles: ['Admin'] } }, {}, adminNext);
    expect(adminNext.calls).toEqual([[undefined]]);
  });

  test('requireDatabaseAccess validates auth, db name, and access rights', () => {
    const noUserNext = createNextSpy();
    requireDatabaseAccess({ params: {}, query: {} }, {}, noUserNext);
    expect(noUserNext.calls[0][0].status).toBe(401);

    const noDatabaseNext = createNextSpy();
    requireDatabaseAccess(
      { user: { databases: ['sales'] }, params: {}, query: {} },
      {},
      noDatabaseNext
    );
    expect(noDatabaseNext.calls[0][0].status).toBe(400);

    const forbiddenNext = createNextSpy();
    requireDatabaseAccess(
      { user: { databases: ['sales'] }, params: { database: 'finance' }, query: {} },
      {},
      forbiddenNext
    );
    expect(forbiddenNext.calls[0][0].status).toBe(403);

    const allowedFromQueryNext = createNextSpy();
    const allowedFromQueryReq = {
      user: { databases: ['sales'] },
      params: {},
      query: { database: 'sales' },
    };
    requireDatabaseAccess(allowedFromQueryReq, {}, allowedFromQueryNext);
    expect(allowedFromQueryReq.database).toBe('sales');
    expect(allowedFromQueryNext.calls).toEqual([[undefined]]);
  });
});
