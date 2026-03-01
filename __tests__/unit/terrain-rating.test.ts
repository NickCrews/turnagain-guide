import { describe, it, expect } from 'vitest';
import {
  atesColor,
  atesTextColor,
  maxAtes,
  ATES_VALUES,
  type ATES,
} from '@/lib/terrain-rating';

describe('atesColor', () => {
  it('returns white for non-avalanche', () => {
    expect(atesColor('non-avalanche')).toBe('white');
  });

  it('returns green for simple', () => {
    expect(atesColor('simple')).toBe('#3ea031');
  });

  it('returns blue for challenging', () => {
    expect(atesColor('challenging')).toBe('#4248c2');
  });

  it('returns black for complex', () => {
    expect(atesColor('complex')).toBe('black');
  });

  it('returns red for extreme', () => {
    expect(atesColor('extreme')).toBe('#FF0138');
  });

  it('covers all ATES_VALUES without throwing', () => {
    for (const rating of ATES_VALUES) {
      expect(() => atesColor(rating)).not.toThrow();
    }
  });

  it('throws for an unknown rating', () => {
    expect(() => atesColor('unknown' as ATES)).toThrow('unknown ATES value: unknown');
  });
});

describe('atesTextColor', () => {
  it('returns black for non-avalanche (light background)', () => {
    expect(atesTextColor('non-avalanche')).toBe('black');
  });

  it('returns white for simple (dark background)', () => {
    expect(atesTextColor('simple')).toBe('white');
  });

  it('returns white for challenging', () => {
    expect(atesTextColor('challenging')).toBe('white');
  });

  it('returns white for complex', () => {
    expect(atesTextColor('complex')).toBe('white');
  });

  it('returns white for extreme', () => {
    expect(atesTextColor('extreme')).toBe('white');
  });

  it('throws for an unknown rating', () => {
    expect(() => atesTextColor('unknown' as ATES)).toThrow();
  });
});

describe('maxAtes', () => {
  it('throws when given an empty array', () => {
    expect(() => maxAtes([])).toThrow('no ratings provided');
  });

  it('returns the sole rating when array has one element', () => {
    for (const rating of ATES_VALUES) {
      expect(maxAtes([rating])).toBe(rating);
    }
  });

  it('returns the higher rating of two', () => {
    expect(maxAtes(['simple', 'challenging'])).toBe('challenging');
    expect(maxAtes(['challenging', 'simple'])).toBe('challenging');
    expect(maxAtes(['non-avalanche', 'extreme'])).toBe('extreme');
    expect(maxAtes(['extreme', 'non-avalanche'])).toBe('extreme');
  });

  it('returns extreme when present among all ratings', () => {
    expect(maxAtes([...ATES_VALUES])).toBe('extreme');
  });

  it('correctly determines the max for every pair of ratings', () => {
    // ATES_VALUES is ordered from least to most severe
    for (let i = 0; i < ATES_VALUES.length; i++) {
      for (let j = 0; j < ATES_VALUES.length; j++) {
        const expected = ATES_VALUES[Math.max(i, j)];
        expect(maxAtes([ATES_VALUES[i], ATES_VALUES[j]])).toBe(expected);
      }
    }
  });

  it('handles duplicate ratings', () => {
    expect(maxAtes(['challenging', 'challenging'])).toBe('challenging');
    expect(maxAtes(['simple', 'simple', 'simple'])).toBe('simple');
  });

  it('handles larger arrays', () => {
    expect(
      maxAtes(['simple', 'non-avalanche', 'challenging', 'simple', 'complex']),
    ).toBe('complex');
  });
});

describe('ATES_VALUES ordering', () => {
  it('is ordered from least to most severe', () => {
    expect(ATES_VALUES[0]).toBe('non-avalanche');
    expect(ATES_VALUES[ATES_VALUES.length - 1]).toBe('extreme');
  });

  it('contains all five ATES levels', () => {
    expect(ATES_VALUES).toHaveLength(5);
    expect(ATES_VALUES).toContain('non-avalanche');
    expect(ATES_VALUES).toContain('simple');
    expect(ATES_VALUES).toContain('challenging');
    expect(ATES_VALUES).toContain('complex');
    expect(ATES_VALUES).toContain('extreme');
  });
});
