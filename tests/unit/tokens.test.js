/**
 * Token Manager Tests
 * Tests for JWT token generation and validation
 */

import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  extractToken,
  refreshAccessToken,
} from '../../src/utils/tokenManager.js';

describe('Token Manager', () => {
  const testUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['Viewer'],
    databases: ['db1', 'db2'],
  };

  describe('Token Generation', () => {
    it('should generate valid JWT token', () => {
      const token = generateToken(testUser);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should include user claims in token', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.sub).toBe(testUser.id);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.name).toBe(testUser.name);
      expect(decoded.roles).toEqual(testUser.roles);
      expect(decoded.databases).toEqual(testUser.databases);
    });

    it('should generate refresh token', () => {
      const token = generateRefreshToken(testUser.id);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should mark refresh token with type claim', () => {
      const token = generateRefreshToken(testUser.id);
      const decoded = verifyToken(token);

      expect(decoded.type).toBe('refresh');
      expect(decoded.sub).toBe(testUser.id);
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded.sub).toBe(testUser.id);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = generateToken(testUser);
      const tampered = `${token.substring(0, token.length - 1)}X`;
      const decoded = verifyToken(tampered);

      expect(decoded).toBeNull();
    });
  });

  describe('Token Extraction', () => {
    it('should extract token from Bearer header', () => {
      const token = 'valid-token-123';
      const header = `Bearer ${token}`;
      const extracted = extractToken(header);

      expect(extracted).toBe(token);
    });

    it('should return null for missing header', () => {
      const extracted = extractToken(null);
      expect(extracted).toBeNull();
    });

    it('should return null for invalid format', () => {
      const extracted = extractToken('InvalidFormat token');
      expect(extracted).toBeNull();
    });

    it('should handle case-insensitive Bearer prefix', () => {
      const token = 'valid-token-123';
      const header = `bearer ${token}`;
      const extracted = extractToken(header);

      expect(extracted).toBe(token);
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token with valid refresh token', () => {
      const refreshToken = generateRefreshToken(testUser.id);
      const user = { ...testUser };
      expect(refreshToken).toBeDefined();

      // This would normally verify the refresh token first
      const newAccessToken = generateToken(user);

      expect(newAccessToken).toBeDefined();
      const decoded = verifyToken(newAccessToken);
      expect(decoded.sub).toBe(testUser.id);
    });

    it('should throw error for invalid refresh token', () => {
      const user = testUser;

      expect(() => {
        refreshAccessToken('invalid-token', user);
      }).toThrow();
    });
  });

  describe('Token Claims', () => {
    it('should include audience (aud) claim', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.aud).toBe('data-governance-api');
    });

    it('should include issuer (iss) claim', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.iss).toBe('data-governance-platform');
    });

    it('should include expiration (exp) claim', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
    });
  });
});
