/**
 * Authentication Middleware
 * Validates JWT tokens on protected routes
 */

import { extractToken, verifyToken } from '../utils/tokenManager.js';
import { ApiError } from './errorHandler.js';

/**
 * Middleware to authenticate requests via JWT
 * Extracts token from Authorization header and validates it
 */
export function authenticate(req, res, next) {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return next(
        new ApiError(401, 'Missing or invalid authorization token', { code: 'UNAUTHORIZED' })
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new ApiError(401, 'Invalid or expired token', { code: 'UNAUTHORIZED' }));
    }

    // Attach user info to request
    req.user = decoded;

    return next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return next(new ApiError(500, err.message, { code: 'AUTHENTICATION_ERROR' }));
  }
}

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'User not authenticated', { code: 'UNAUTHORIZED' }));
  }

  if (!req.user.roles || !req.user.roles.includes('Admin')) {
    return next(new ApiError(403, 'Admin role required', { code: 'FORBIDDEN' }));
  }

  return next();
}

/**
 * Middleware to check if user has access to database
 * Must be used after authenticate middleware
 */
export function requireDatabaseAccess(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'User not authenticated', { code: 'UNAUTHORIZED' }));
  }

  const dbName = req.params.database || req.query.database;

  if (!dbName) {
    return next(new ApiError(400, 'Database name not specified', { code: 'BAD_REQUEST' }));
  }

  if (!req.user.databases || !req.user.databases.includes(dbName)) {
    return next(
      new ApiError(403, `User does not have access to database: ${dbName}`, { code: 'FORBIDDEN' })
    );
  }

  req.database = dbName;
  return next();
}

export default {
  authenticate,
  requireAdmin,
  requireDatabaseAccess,
};
