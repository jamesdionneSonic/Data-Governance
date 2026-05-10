/**
 * JWT Token Management
 * Token validation, refresh, and claim extraction
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

/**
 * Generate JWT token from user claims
 * @param {Object} user - User object with id, email, roles, databases
 * @returns {string} Signed JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles || [],
      databases: user.databases || [],
      aud: 'data-governance-api',
      iss: 'data-governance-platform',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    },
  );
}

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} Signed refresh token
 */
export function generateRefreshToken(userId) {
  return jwt.sign(
    {
      sub: userId,
      type: 'refresh',
    },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    },
  );
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if not found
 */
export function extractToken(authHeader) {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Refresh expired token
 * @param {string} refreshToken - Refresh token
 * @param {Object} user - User object
 * @returns {string} New JWT token
 */
export function refreshAccessToken(refreshToken, user) {
  const decoded = verifyToken(refreshToken);

  if (!decoded || decoded.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }

  return generateToken(user);
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  extractToken,
  refreshAccessToken,
};
