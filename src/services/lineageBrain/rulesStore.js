import { existsSync, readFileSync, appendFileSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import yaml from 'yaml';

import {
  ACTIVE_RULES_PATH,
  DEFAULT_EDGE_HARD_THRESHOLD,
  DEFAULT_EDGE_OVERPOPULATED_THRESHOLD,
  PROPOSED_RULES_PATH,
  REJECTED_RULES_PATH,
  SSIS_HIGH_FANOUT_ALLOWLIST,
  TABLE_HIGH_FANOUT_ALLOWLIST,
} from './constants.js';
import { sha256Text } from './provenance.js';

const TOKEN_STOPWORDS = new Set([
  'data',
  'dbo',
  'dtsx',
  'load',
  'table',
  'view',
  'procedure',
  'stored',
  'package',
  'daily',
  'master',
  'source',
  'target',
  'stage',
  'stg',
  'wrk',
]);

function ensureArray(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function unique(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const text = String(value || '').trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    output.push(text);
  }
  return output;
}

export function defaultLineageBrainRules() {
  return {
    version: 1,
    high_fanout: {
      thresholds: {
        review: DEFAULT_EDGE_OVERPOPULATED_THRESHOLD,
        hard: DEFAULT_EDGE_HARD_THRESHOLD,
      },
      allowlists: {
        ssis: SSIS_HIGH_FANOUT_ALLOWLIST,
        table: TABLE_HIGH_FANOUT_ALLOWLIST,
      },
    },
    edge_classification: {
      direct_fields: ['depends_on', 'reads_from', 'writes_to', 'calls'],
      reverse_fields: ['created_by', 'used_by', 'called_by'],
      inferred_fields: ['created_via', 'inferred_edges', 'probable_edges'],
      context_fields: ['contextual_reads', 'contextual_edges', 'edges'],
    },
    rule_learning: {
      mode: 'propose_for_review',
      min_supporting_examples: 2,
      proposal_status: 'needs_review',
      auto_promote: false,
    },
  };
}

function mergeRules(base, loaded) {
  if (!loaded || typeof loaded !== 'object') return base;
  return {
    ...base,
    ...loaded,
    high_fanout: {
      ...base.high_fanout,
      ...(loaded.high_fanout || {}),
      thresholds: {
        ...base.high_fanout.thresholds,
        ...(loaded.high_fanout?.thresholds || {}),
      },
      allowlists: {
        ...base.high_fanout.allowlists,
        ...(loaded.high_fanout?.allowlists || {}),
      },
    },
    edge_classification: {
      ...base.edge_classification,
      ...(loaded.edge_classification || {}),
    },
    rule_learning: {
      ...base.rule_learning,
      ...(loaded.rule_learning || {}),
    },
  };
}

export function ensureActiveRulesFile(rulesPath = ACTIVE_RULES_PATH) {
  if (existsSync(rulesPath)) return false;
  mkdirSync(dirname(rulesPath), { recursive: true });
  writeFileSync(
    rulesPath,
    `${yaml.stringify(defaultLineageBrainRules())}`,
    'utf8'
  );
  return true;
}

export function loadLineageBrainRules(rulesPath = ACTIVE_RULES_PATH) {
  ensureActiveRulesFile(rulesPath);
  const loaded = yaml.parse(readFileSync(rulesPath, 'utf8')) || {};
  return mergeRules(defaultLineageBrainRules(), loaded);
}

export function allowlistForLane(rules, lane) {
  const effectiveRules = rules || defaultLineageBrainRules();
  return unique(effectiveRules?.high_fanout?.allowlists?.[lane] || []);
}

export function thresholdsFromRules(rules) {
  const effectiveRules = rules || defaultLineageBrainRules();
  return {
    review:
      Number(effectiveRules?.high_fanout?.thresholds?.review) ||
      DEFAULT_EDGE_OVERPOPULATED_THRESHOLD,
    hard: Number(effectiveRules?.high_fanout?.thresholds?.hard) || DEFAULT_EDGE_HARD_THRESHOLD,
  };
}

function readJsonl(filePath) {
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function proposalTokens(record) {
  return unique(
    [
      record.objectName,
      record.displayName,
      record.objectType,
      record.kind,
      ...(record.tags || []),
    ]
      .join(' ')
      .split(/[^A-Za-z0-9_]+/)
      .map((token) => token.toLowerCase())
      .filter((token) => token.length >= 4 && !TOKEN_STOPWORDS.has(token))
  );
}

export function buildRuleProposals({ lane, records, rules, generatedAt = new Date().toISOString() }) {
  const learning = rules.rule_learning || {};
  if (learning.mode !== 'propose_for_review') return [];

  const allowlist = new Set(allowlistForLane(rules, lane).map((item) => item.toLowerCase()));
  const minSupport = Math.max(2, Number(learning.min_supporting_examples) || 2);
  const { hard } = thresholdsFromRules(rules);
  const candidates = new Map();

  for (const record of records || []) {
    if (Number(record.edgeCount || 0) <= hard) continue;
    for (const token of proposalTokens(record)) {
      if (allowlist.has(token)) continue;
      if (!candidates.has(token)) candidates.set(token, []);
      candidates.get(token).push(record);
    }
  }

  return Array.from(candidates.entries())
    .filter(([, supportingRecords]) => supportingRecords.length >= minSupport)
    .map(([token, supportingRecords]) => {
      const examples = supportingRecords.slice(0, 5).map((record) => ({
        object_name: record.objectName || record.displayName || '',
        edge_count: record.edgeCount || 0,
        markdown_path: record.markdownPath,
      }));
      const id = sha256Text(`high_fanout_allowlist|${lane}|${token}`).slice(0, 16);
      return {
        id,
        status: learning.proposal_status || 'needs_review',
        proposed_at: generatedAt,
        rule_type: 'high_fanout_allowlist_candidate',
        lane,
        candidate_keyword: token,
        suggested_action: `Review whether '${token}' should be added to high_fanout.allowlists.${lane}.`,
        rationale:
          'Repeated high-fanout records shared this token. The engine will not activate this rule until a reviewer promotes it.',
        support_count: supportingRecords.length,
        examples,
      };
    });
}

export function appendRuleProposals(
  proposals,
  {
    proposedPath = PROPOSED_RULES_PATH,
    rejectedPath = REJECTED_RULES_PATH,
  } = {}
) {
  const cleanProposals = Array.isArray(proposals) ? proposals : [];
  if (cleanProposals.length === 0) return { written: 0, skipped: 0, path: proposedPath };

  const existingIds = new Set(readJsonl(proposedPath).map((proposal) => proposal.id));
  const rejectedIds = new Set(readJsonl(rejectedPath).map((proposal) => proposal.id));
  const writable = cleanProposals.filter(
    (proposal) => proposal.id && !existingIds.has(proposal.id) && !rejectedIds.has(proposal.id)
  );

  if (writable.length > 0) {
    mkdirSync(dirname(proposedPath), { recursive: true });
    appendFileSync(
      proposedPath,
      `${writable.map((proposal) => JSON.stringify(proposal)).join('\n')}\n`,
      'utf8'
    );
  }

  return {
    written: writable.length,
    skipped: cleanProposals.length - writable.length,
    path: proposedPath,
  };
}

export default {
  allowlistForLane,
  appendRuleProposals,
  buildRuleProposals,
  defaultLineageBrainRules,
  ensureActiveRulesFile,
  loadLineageBrainRules,
  thresholdsFromRules,
};
