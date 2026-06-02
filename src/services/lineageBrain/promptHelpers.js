export function truncateText(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 20).trimEnd()}\n...[truncated]...`;
}

export function compactPrompt(parts) {
  return parts.map((line) => String(line)).join('\n');
}

export function wrapEvidence(label, text) {
  return `${label}:||${text}||`;
}
