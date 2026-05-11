/**
 * Authentication Routes
 * Handles OIDC flow and session management
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { generateToken, generateRefreshToken } from '../utils/tokenManager.js';
import { createOrGetUser } from '../services/userService.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';

const router = createApiRouter();

/**
 * POST /auth/login
 * Initiates login flow
 * In production, this redirects to Entra ID login page
 */
router.post('/login', (req, res) => {
  // For development: accept email/password or redirect to Entra ID
  const { email } = req.body;

  if (!email) {
    // In production, redirect to Entra ID authorization endpoint
    return res.json({
      message: 'Redirect to Entra ID login',
      redirectUrl: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID || 'common'}/oauth2/v2.0/authorize?client_id=${process.env.ENTRA_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=openid%20email%20profile`,
    });
  }

  // Development: create mock user for testing
  const user = createOrGetUser({
    oid: `user-${email.split('@')[0]}`,
    email,
    name: email.split('@')[0],
  });

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user.id);

  return res.json({
    status: 'success',
    message: 'Login successful',
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      databases: user.databases,
    },
  });
});

/**
 * POST /auth/callback
 * Handles Entra ID OAuth callback
 */
router.post('/callback', (req, res) => {
  const { code, state } = req.body;

  // In production, exchange code for token from Entra ID
  // This is a placeholder

  res.json({
    message: 'Callback handler - implement OAuth exchange',
    received: { code, state },
  });
});

/**
 * GET /auth/me
 * Returns current authenticated user info
 * Requires authentication
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      roles: req.user.roles,
      databases: req.user.databases,
    },
  });
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendErrorResponse(res, req, 400, 'Refresh token required', {
      code: 'BAD_REQUEST',
    });
  }

  try {
    // Implementation would verify refresh token and issue new access token
    return res.json({
      message: 'Token refresh - implement full flow',
      received: { refreshToken: !!refreshToken },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 401, 'Invalid refresh token', {
      code: 'UNAUTHORIZED',
    });
  }
});

/**
 * POST /auth/logout
 * Logout and invalidate session
 * Requires authentication
 */
router.post('/logout', authenticate, (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

export default router;
