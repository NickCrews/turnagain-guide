import { describe, it, expect } from 'vitest';
import { hashString, hashStringToColor } from '@/lib/colors';

describe('hashString', () => {
  it('returns a number', () => {
    expect(typeof hashString('hello')).toBe('number');
  });

  it('is deterministic for the same input', () => {
    expect(hashString('hello')).toBe(hashString('hello'));
    expect(hashString('turnagain-pass')).toBe(hashString('turnagain-pass'));
    expect(hashString('')).toBe(hashString(''));
  });

  it('produces different values for different strings', () => {
    expect(hashString('hello')).not.toBe(hashString('world'));
    expect(hashString('a')).not.toBe(hashString('b'));
    expect(hashString('abc')).not.toBe(hashString('cba'));
  });

  it('produces different values for different seeds', () => {
    expect(hashString('hello', 0)).not.toBe(hashString('hello', 1));
    expect(hashString('hello', 42)).not.toBe(hashString('hello', 99));
  });

  it('handles the empty string without error', () => {
    expect(() => hashString('')).not.toThrow();
  });

  it('returns a non-negative value (unsigned 32-bit component)', () => {
    const testCases = ['', 'a', 'hello world', 'turnagain-pass', '12345'];
    for (const str of testCases) {
      expect(hashString(str)).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles long strings', () => {
    const longStr = 'a'.repeat(10000);
    expect(() => hashString(longStr)).not.toThrow();
    expect(hashString(longStr)).toBeGreaterThanOrEqual(0);
  });

  it('handles unicode characters', () => {
    expect(hashString('αβγ')).not.toBe(hashString('abc'));
    expect(hashString('αβγ')).toBe(hashString('αβγ'));
  });
});

describe('hashStringToColor', () => {
  it('returns a string in HSL format', () => {
    const color = hashStringToColor('hello');
    expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
  });

  it('is deterministic for the same input', () => {
    expect(hashStringToColor('hello')).toBe(hashStringToColor('hello'));
    expect(hashStringToColor('tincan-area')).toBe(hashStringToColor('tincan-area'));
  });

  it('produces different colors for different strings', () => {
    expect(hashStringToColor('hello')).not.toBe(hashStringToColor('world'));
  });

  it('hue is in range [0, 359]', () => {
    const testCases = ['a', 'b', 'hello', 'turnagain', 'tincan-area', 'eddies-area'];
    for (const str of testCases) {
      const color = hashStringToColor(str);
      const match = color.match(/^hsl\((\d+),/);
      expect(match).not.toBeNull();
      const hue = parseInt(match![1]);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });

  it('uses default saturation of 100% and lightness of 25%', () => {
    const color = hashStringToColor('test');
    expect(color).toContain('100%');
    expect(color).toContain('25%');
  });

  it('accepts custom saturation and lightness', () => {
    const color = hashStringToColor('test', 50, 75);
    expect(color).toContain('50%');
    expect(color).toContain('75%');
  });

  it('handles the empty string without error', () => {
    expect(() => hashStringToColor('')).not.toThrow();
    expect(hashStringToColor('')).toMatch(/^hsl\(/);
  });
});
