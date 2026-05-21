import {
  computeTrustScore,
  computeAllTrustScores,
  getTopTrustedAssets,
} from '../../src/services/trustService.js';

describe('trustService', () => {
  test('computes high trust score and derives gold level', () => {
    const asset = {
      name: 'orders',
      owner: 'owner@example.com',
      steward: 'steward@example.com',
      domain_manager: 'manager@example.com',
      custodian: 'custodian@example.com',
      description:
        'This is a long business-critical description that exceeds three hundred characters. ' +
        'It includes governance notes, ownership details, and usage patterns for finance and audit ' +
        'operations with restricted data handling and compliance requirements.',
      sensitivity: 'confidential',
      tags: ['pii', 'finance', 'gold'],
      depends_on: ['source.customers', 'source.products'],
      certified: true,
      certified_by: 'admin@example.com',
      certification_date: '2026-05-01',
    };

    const trust = computeTrustScore(asset);

    expect(trust.score).toBeGreaterThanOrEqual(85);
    expect(trust.trust_level).toBe('gold');
    expect(trust.certified).toBe(true);
    expect(trust.breakdown.ownership).toBe(25);
    expect(trust.breakdown.certification).toBe(10);
    expect(trust.certified_by).toBe('admin@example.com');
    expect(trust.certification_date).toBe('2026-05-01');
  });

  test('respects explicit trust level override from asset', () => {
    const asset = {
      name: 'staging_table',
      owner: 'owner@example.com',
      description: 'short desc',
      sensitivity: 'internal',
      tags: ['tmp'],
      depends_on: [],
      certified: false,
      trust_level: 'silver',
    };

    const trust = computeTrustScore(asset);
    expect(trust.trust_level).toBe('silver');
  });

  test('computes low trust score and unrated level for sparse asset', () => {
    const asset = {
      name: 'raw_events',
      owner: 'unknown',
      description: '',
      tags: [],
      depends_on: [],
      certified: false,
      sensitivity: null,
    };

    const trust = computeTrustScore(asset);

    expect(trust.score).toBeLessThan(40);
    expect(trust.trust_level).toBe('unrated');
    expect(trust.breakdown.ownership).toBe(0);
    expect(trust.breakdown.description).toBe(0);
    expect(trust.breakdown.tags).toBe(0);
    expect(trust.breakdown.lineage).toBe(5);
  });

  test('computes trust for all assets in map', () => {
    const assets = new Map([
      [
        'a',
        {
          name: 'a',
          owner: 'o',
          description: 'desc'.repeat(60),
          sensitivity: 'internal',
          tags: ['pii'],
          depends_on: ['x'],
          certified: true,
        },
      ],
      [
        'b',
        {
          name: 'b',
          owner: 'unknown',
          description: '',
          tags: [],
          depends_on: [],
          certified: false,
        },
      ],
    ]);

    const all = computeAllTrustScores(assets);

    expect(all).toBeInstanceOf(Map);
    expect(all.size).toBe(2);
    expect(all.get('a').score).toBeGreaterThan(all.get('b').score);
  });

  test('returns top trusted assets sorted and respects limit', () => {
    const assets = new Map([
      [
        'high',
        {
          name: 'high',
          owner: 'o',
          steward: 's',
          domain_manager: 'd',
          custodian: 'c',
          description: 'desc'.repeat(80),
          sensitivity: 'confidential',
          tags: ['pii', 'gdpr', 'finance'],
          depends_on: ['src'],
          certified: true,
        },
      ],
      [
        'mid',
        {
          name: 'mid',
          owner: 'o',
          description: 'desc'.repeat(10),
          sensitivity: 'internal',
          tags: ['ops'],
          depends_on: ['src'],
          certified: false,
        },
      ],
      [
        'low',
        {
          name: 'low',
          owner: 'unknown',
          description: '',
          tags: [],
          depends_on: [],
          certified: false,
        },
      ],
    ]);

    const topTwo = getTopTrustedAssets(assets, 2);

    expect(topTwo).toHaveLength(2);
    expect(topTwo[0].id).toBe('high');
    expect(topTwo[0].trust.score).toBeGreaterThanOrEqual(topTwo[1].trust.score);
  });
});
