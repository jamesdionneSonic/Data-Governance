import yaml from 'yaml';

export function parseFrontmatter(markdownText) {
  if (!markdownText.startsWith('---')) {
    return { metadata: {}, body: markdownText };
  }

  const match = markdownText.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { metadata: {}, body: markdownText };
  }

  const metadata = yaml.parse(match[1]) || {};
  const body = markdownText.substring(match[0].length).trim();
  return { metadata, body };
}

export function getString(metadata, key, fallback = '') {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function getArray(metadata, key) {
  const value = metadata?.[key];
  return Array.isArray(value) ? value.filter(Boolean) : [];
}
