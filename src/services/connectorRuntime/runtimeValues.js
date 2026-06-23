function nonEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}

function envValue(envName) {
  const name = String(envName || '').trim();
  if (!name) return null;
  const value = process.env[name];
  return nonEmpty(value) ? value : null;
}

export function runtimeValue(container = {}, ...keys) {
  for (const key of keys) {
    const direct = container?.[key];
    if (nonEmpty(direct)) return direct;
  }

  for (const key of keys) {
    const runtimeEnv = container?.runtime_env?.[key] || container?.runtimeEnv?.[key];
    const mapped = envValue(runtimeEnv);
    if (mapped) return mapped;

    const envKey = container?.[`${key}_env`] || container?.[`${key}Env`];
    const envMapped = envValue(envKey);
    if (envMapped) return envMapped;
  }

  return null;
}

export function connectorConfigValue(connector = {}, ...keys) {
  return runtimeValue(connector.config || {}, ...keys);
}

export function connectorCredentialValue(connector = {}, ...keys) {
  return runtimeValue(connector.credential || {}, ...keys);
}
