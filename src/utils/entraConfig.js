/**
 * Entra ID (Azure AD) Configuration
 * Handles OIDC flow and JWT token management
 */

import dotenv from 'dotenv';

dotenv.config();

export const entraConfig = {
  clientId: process.env.ENTRA_CLIENT_ID || '',
  clientSecret: process.env.ENTRA_CLIENT_SECRET || '',
  tenantId: process.env.ENTRA_TENANT_ID || '',
  redirectUri: process.env.ENTRA_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  authority: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID || 'common'}/v2.0`,
  scopes: ['profile', 'email', 'openid'],
};

/**
 * Validate Entra ID configuration
 * In production, clientId and clientSecret are required
 */
export function validateEntraConfig() {
  if (process.env.NODE_ENV === 'production') {
    const required = ['ENTRA_CLIENT_ID', 'ENTRA_CLIENT_SECRET', 'ENTRA_TENANT_ID'];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required Entra ID configuration: ${missing.join(', ')}. ` +
          'Set these environment variables in production.'
      );
    }
  }
}

export default entraConfig;
