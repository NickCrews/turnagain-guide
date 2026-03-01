import { describe, it, expect } from 'vitest';
import { capitalize, cn } from '@/lib/utils';

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('leaves an already-capitalized string unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('Z')).toBe('Z');
  });

  it('handles an empty string without error', () => {
    expect(capitalize('')).toBe('');
  });

  it('only capitalizes the first character, not the rest', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('handles strings starting with a number or symbol', () => {
    expect(capitalize('1abc')).toBe('1abc');
    expect(capitalize('-foo')).toBe('-foo');
  });
});

describe('cn (class name merger)', () => {
  it('joins class names with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles a single class name', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz');
  });

  it('handles conditional class names with objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
    expect(cn({ active: false })).toBe('');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge keeps the last conflicting utility
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles arrays of class names', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles mixed conditional and regular classes', () => {
    const result = cn('base', { active: true, hidden: false }, 'extra');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).toContain('extra');
    expect(result).not.toContain('hidden');
  });

  it('returns an empty string when no classes are provided', () => {
    expect(cn()).toBe('');
    expect(cn(undefined, null, false)).toBe('');
  });
});
