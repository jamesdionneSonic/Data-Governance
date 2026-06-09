const CANONICAL_DATABASE_NAMES = new Map([
  ['dbsonicdw', 'Sonic_DW'],
  ['sonicdw', 'Sonic_DW'],
]);

function databaseAliasKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export function canonicalDatabaseName(value) {
  const raw = String(value || '').trim();
  if (!raw) return raw;
  return CANONICAL_DATABASE_NAMES.get(databaseAliasKey(raw)) || raw;
}

export function databaseNameMatches(actual, requested) {
  const actualRaw = String(actual || '').trim();
  const requestedRaw = String(requested || '').trim();
  if (!requestedRaw) return true;
  if (actualRaw.toLowerCase() === requestedRaw.toLowerCase()) return true;
  if (canonicalDatabaseName(actualRaw).toLowerCase() === canonicalDatabaseName(requestedRaw).toLowerCase()) {
    return true;
  }
  return databaseAliasKey(actualRaw) === databaseAliasKey(requestedRaw);
}

export function withCanonicalDatabase(item) {
  if (!item || typeof item !== 'object') return item;
  const canonical = canonicalDatabaseName(item.database);
  if (!canonical || canonical === item.database) return item;
  return {
    ...item,
    raw_database: item.database,
    database: canonical,
  };
}
