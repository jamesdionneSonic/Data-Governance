import { basename, extname, join } from 'path';
import { readdirSync } from 'fs';
import { readTextFile } from './fileHelpers.js';
import { truncateText } from './promptHelpers.js';
import {
  DEFAULT_SNIPPET_LIMIT,
  SSIS_CURATED_ROOT,
  SSIS_RAW_XML_ROOT,
  TABLE_CURATED_ROOT,
  TABLE_RAW_SQL_ROOT,
} from './constants.js';
import { parseFrontmatter, getArray, getString } from './markdownHelpers.js';

function walkMarkdownFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '_drafts') {
          stack.push(fullPath);
        }
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        files.push(fullPath);
      }
    }
  }
  return files.sort();
}

function findMatchingRawFile(sourcePath, curatedRoot, rawRoot) {
  const rel = sourcePath.slice(curatedRoot.length + 1).replace(/\.md$/i, '.md');
  const direct = join(rawRoot, rel);
  try {
    readTextFile(direct);
    return direct;
  } catch {
    return null;
  }
}

export function extractSsisEvidence() {
  const files = walkMarkdownFiles(SSIS_CURATED_ROOT).filter((path) => path.includes('ssis_packages'));
  return files.map((markdownPath) => {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawXmlPath = findMatchingRawFile(markdownPath, SSIS_CURATED_ROOT, SSIS_RAW_XML_ROOT);
    const edges = [
      ...getArray(metadata, 'edges'),
      ...getArray(metadata, 'depends_on'),
      ...getArray(metadata, 'writes_to'),
      ...getArray(metadata, 'calls'),
    ].map(String);
    return {
      markdownPath,
      rawPath: rawXmlPath,
      kind: 'ssis',
      objectName: getString(metadata, 'package_name', basename(markdownPath).replace('.md', '')),
      displayName: getString(metadata, 'name', basename(markdownPath).replace('.md', '')),
      description: getString(metadata, 'description', ''),
      tags: getArray(metadata, 'tags'),
      edgeCount: edges.length,
      edges,
      body,
      metadata,
      rawSnippet: rawXmlPath ? truncateText(readTextFile(rawXmlPath), DEFAULT_SNIPPET_LIMIT) : truncateText(body, DEFAULT_SNIPPET_LIMIT),
    };
  });
}

export function extractTableEvidence() {
  const files = walkMarkdownFiles(TABLE_CURATED_ROOT);
  return files.map((markdownPath) => {
    const content = readTextFile(markdownPath);
    const { metadata, body } = parseFrontmatter(content);
    const rawPath = findMatchingRawFile(markdownPath, TABLE_CURATED_ROOT, TABLE_RAW_SQL_ROOT) || markdownPath;
    const edges = [
      ...getArray(metadata, 'edges'),
      ...getArray(metadata, 'depends_on'),
      ...getArray(metadata, 'writes_to'),
      ...getArray(metadata, 'calls'),
    ].map(String);
    return {
      markdownPath,
      rawPath,
      kind: 'table',
      objectName: getString(metadata, 'name', basename(markdownPath).replace('.md', '')),
      objectType: getString(metadata, 'type', 'unknown'),
      description: getString(metadata, 'description', ''),
      edgeCount: edges.length,
      edges,
      body,
      metadata,
      rawSnippet: truncateText(readTextFile(rawPath), DEFAULT_SNIPPET_LIMIT),
    };
  });
}
