/**
 * Configuration loader
 * Centralizes environment variable management
 */

const requiredVars = [];

// Load and validate environment
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  meilisearchHost: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  meilisearchKey: process.env.MEILISEARCH_MASTER_KEY || 'dev-key',
  markdownPath: process.env.MARKDOWN_DATA_PATH || './data/markdown',
  entraClientId: process.env.ENTRA_CLIENT_ID,
  entraClientSecret: process.env.ENTRA_CLIENT_SECRET,
  entraTenantId: process.env.ENTRA_TENANT_ID,
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required variables in production
if (config.isProduction) {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;
