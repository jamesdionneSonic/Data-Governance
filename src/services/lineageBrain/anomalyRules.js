function normalizeBlob(value) {
  return String(value || '').toLowerCase();
}

function matchesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function isExpectedHighFanoutSSIS(record, keywords) {
  const text = normalizeBlob(
    [
      record.packageName,
      record.displayName,
      record.description,
      JSON.stringify(record.tags || []),
    ].join(' ')
  );
  return matchesAny(text, keywords);
}

export function isExpectedHighFanoutTable(record, sqlText, keywords) {
  const text = normalizeBlob([record.objectName, record.objectType, record.description, sqlText].join(' '));
  return matchesAny(text, keywords);
}
