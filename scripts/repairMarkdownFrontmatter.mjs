import { readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { getMarkdownFiles, parseMarkdownContent } from '../src/services/markdownService.js';
import yaml from 'yaml';

const root = process.argv[2] || join(process.cwd(), 'data', 'markdown');
const files = getMarkdownFiles(root);
let repaired = 0;
let skipped = 0;

for (const filePath of files) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
      skipped += 1;
      continue;
    }

    const metadata = parseMarkdownContent(content, filePath);
    const body = content.substring(match[0].length).trimStart();
    const normalized = {
      ...metadata,
      filePath: undefined,
      createdAt: undefined,
    };

    const frontmatter = yaml.stringify(
      Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined))
    );
    const newContent = `---\n${frontmatter}---\n${body}`;

    if (newContent !== content) {
      writeFileSync(filePath, newContent, 'utf-8');
      repaired += 1;
    }
  } catch (err) {
    skipped += 1;
    console.error(`Repair failed for ${filePath}: ${err.message}`);
  }
}

console.log(`Repaired ${repaired} markdown files; skipped ${skipped}.`);
