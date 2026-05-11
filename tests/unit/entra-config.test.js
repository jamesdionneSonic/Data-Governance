describe('utils/entraConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('loads defaults when env vars are not set', async () => {
    delete process.env.ENTRA_CLIENT_ID;
    delete process.env.ENTRA_CLIENT_SECRET;
    delete process.env.ENTRA_TENANT_ID;
    delete process.env.ENTRA_REDIRECT_URI;
    process.env.NODE_ENV = 'development';

    const module = await import(`../../src/utils/entraConfig.js?defaults=${Date.now()}`);

    expect(module.entraConfig.clientId).toBe('');
    expect(module.entraConfig.clientSecret).toBe('');
    expect(module.entraConfig.tenantId).toBe('');
    expect(module.entraConfig.redirectUri).toBe('http://localhost:3000/auth/callback');
    expect(module.entraConfig.authority).toContain('/common/v2.0');

    expect(() => module.validateEntraConfig()).not.toThrow();
  });

  test('throws in production when required env vars are missing', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ENTRA_CLIENT_ID;
    delete process.env.ENTRA_CLIENT_SECRET;
    delete process.env.ENTRA_TENANT_ID;

    const module = await import(`../../src/utils/entraConfig.js?missing=${Date.now()}`);

    expect(() => module.validateEntraConfig()).toThrow('Missing required Entra ID configuration');
  });

  test('passes validation in production when env vars are present', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ENTRA_CLIENT_ID = 'client-id';
    process.env.ENTRA_CLIENT_SECRET = 'client-secret';
    process.env.ENTRA_TENANT_ID = 'tenant-id';
    process.env.ENTRA_REDIRECT_URI = 'https://app.example.com/auth/callback';

    const module = await import(`../../src/utils/entraConfig.js?valid=${Date.now()}`);

    expect(module.entraConfig.clientId).toBe('client-id');
    expect(module.entraConfig.clientSecret).toBe('client-secret');
    expect(module.entraConfig.tenantId).toBe('tenant-id');
    expect(module.entraConfig.redirectUri).toBe('https://app.example.com/auth/callback');
    expect(module.entraConfig.authority).toContain('/tenant-id/v2.0');

    expect(() => module.validateEntraConfig()).not.toThrow();
  });
});
