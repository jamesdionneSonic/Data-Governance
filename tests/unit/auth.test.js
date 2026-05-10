/**
 * Authentication Routes Tests
 * Tests for login, logout, and user profile endpoints
 */

import request from 'supertest';
import createApp from '../../src/app.js';
import { generateToken } from '../../src/utils/tokenManager.js';

describe('Authentication Routes', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return redirect URL when no email provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toBe('Redirect to Entra ID login');
      expect(response.body.redirectUrl).toContain('login.microsoftonline.com');
    });

    it('should create user and return token when email provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'testuser@example.com' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('testuser@example.com');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return user when valid token provided', async () => {
      const token = generateToken({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['Viewer'],
        databases: ['database1'],
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return success when valid token provided', async () => {
      const token = generateToken({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['Viewer'],
        databases: [],
      });

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('POST /api/v1/auth/callback', () => {
    it('should accept callback with code and state', async () => {
      const response = await request(app)
        .post('/api/v1/auth/callback')
        .send({
          code: 'auth-code-123',
          state: 'state-456',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toContain('Callback');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return 400 when refresh token not provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should accept refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'some-refresh-token',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toContain('Token refresh');
    });
  });
});
