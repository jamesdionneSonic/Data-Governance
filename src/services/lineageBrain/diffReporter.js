import { readTextFile } from './fileHelpers.js';

export function buildDiffSummary(originalPath, rewrittenMarkdown) {
  const original = readTextFile(originalPath);
  const originalLength = original.length;
  const rewrittenLength = rewrittenMarkdown.length;
  return {
    originalPath,
    originalLength,
    rewrittenLength,
    delta: rewrittenLength - originalLength,
    changed: original !== rewrittenMarkdown,
  };
}

export default buildDiffSummary;
