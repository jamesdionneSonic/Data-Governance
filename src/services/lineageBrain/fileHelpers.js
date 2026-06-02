import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export function readTextFile(filePath) {
  return readFileSync(filePath, 'utf-8');
}

export function writeTextFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}
