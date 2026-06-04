import { mkdtempSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

import { parseFrontmatter } from '../../src/services/lineageBrain/markdownHelpers.js';
import {
  appendRuleProposals,
  buildRuleProposals,
  defaultLineageBrainRules,
} from '../../src/services/lineageBrain/rulesStore.js';

describe('Lineage brain hardening', () => {
  test('parses generated frontmatter with literal dash values', () => {
    const { metadata } = parseFrontmatter('---\nname: Example\nproject_name: -\n---\nBody');

    expect(metadata.name).toBe('Example');
    expect(metadata.project_name).toBe('-');
  });

  test('proposes new rules for review without auto-promoting or duplicating candidates', () => {
    const workDir = mkdtempSync(join(tmpdir(), 'lineage-brain-'));
    const proposedPath = join(workDir, 'proposed-rules.jsonl');
    const rejectedPath = join(workDir, 'rejected-rules.jsonl');
    const rules = defaultLineageBrainRules();
    const records = [
      {
        objectName: 'Chrome Feed Export',
        edgeCount: 100,
        markdownPath: 'one.md',
      },
      {
        objectName: 'Chrome Feed Import',
        edgeCount: 80,
        markdownPath: 'two.md',
      },
    ];

    const proposals = buildRuleProposals({
      lane: 'table',
      records,
      rules,
      generatedAt: '2026-06-04T00:00:00.000Z',
    });
    const chromeProposal = proposals.find((proposal) => proposal.candidate_keyword === 'chrome');

    expect(chromeProposal.status).toBe('needs_review');
    expect(rules.high_fanout.allowlists.table).not.toContain('chrome');

    appendRuleProposals([chromeProposal], { proposedPath, rejectedPath });
    appendRuleProposals([chromeProposal], { proposedPath, rejectedPath });

    const written = readFileSync(proposedPath, 'utf8').trim().split(/\r?\n/);
    expect(written).toHaveLength(1);
    expect(JSON.parse(written[0]).suggested_action).toContain('Review whether');
  });
});
