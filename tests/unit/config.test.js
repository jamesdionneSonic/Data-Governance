describe('utils/config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('loads defaults in development mode', async () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.MEILISEARCH_HOST;
    delete process.env.MEILISEARCH_MASTER_KEY;
    delete process.env.MARKDOWN_DATA_PATH;

    const { default: config } = await import(`../../src/utils/config.js?dev=${Date.now()}`);

    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe('development');
    expect(config.meilisearchHost).toBe('http://localhost:7700');
    expect(config.meilisearchKey).toBe('dev-key');
    expect(config.markdownPath).toBe('./data/markdown');
    expect(config.isDevelopment).toBe(true);
    expect(config.isProduction).toBe(false);
  });

  test('loads overridden environment values in production mode', async () => {
    process.env.PORT = '4500';
    process.env.NODE_ENV = 'production';
    process.env.MEILISEARCH_HOST = 'http://meili:7700';
    process.env.MEILISEARCH_MASTER_KEY = 'prod-key';
    process.env.MARKDOWN_DATA_PATH = '/mnt/markdown';
    process.env.ENTRA_CLIENT_ID = 'client-id';
    process.env.ENTRA_CLIENT_SECRET = 'client-secret';
    process.env.ENTRA_TENANT_ID = 'tenant-id';

    const { default: config } = await import(`../../src/utils/config.js?prod=${Date.now()}`);

    expect(config.port).toBe('4500');
    expect(config.nodeEnv).toBe('production');
    expect(config.meilisearchHost).toBe('http://meili:7700');
    expect(config.meilisearchKey).toBe('prod-key');
    expect(config.markdownPath).toBe('/mnt/markdown');
    expect(config.entraClientId).toBe('client-id');
    expect(config.entraClientSecret).toBe('client-secret');
    expect(config.entraTenantId).toBe('tenant-id');
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(true);
  });
});
