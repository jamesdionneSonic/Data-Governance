import { writeTextFile } from './fileHelpers.js';

export function writeCorrectedMarkdown(filePath, markdownContent) {
  writeTextFile(filePath, markdownContent);
  return filePath;
}

export default writeCorrectedMarkdown;
