import { describe, expect, it } from 'vitest'
import { atesColor, atesTextColor, maxAtes } from '@/lib/terrain-rating'

describe('atesColor', () => {
  it.each([
    ['non-avalanche', 'white'],
    ['simple', '#3ea031'],
    ['challenging', '#4248c2'],
    ['complex', 'black'],
    ['extreme', '#FF0138'],
  ])('maps %s to %s', (value, color) => {
    expect(atesColor(value as Parameters<typeof atesColor>[0])).toBe(color)
  })
})

describe('atesTextColor', () => {
  it('uses black on non-avalanche and white elsewhere', () => {
    expect(atesTextColor('non-avalanche')).toBe('black')
    expect(atesTextColor('simple')).toBe('white')
    expect(atesTextColor('extreme')).toBe('white')
    expect(() => atesTextColor('bogus' as never)).toThrow(/unknown ATES value/)
  })
})

describe('maxAtes', () => {
  it('returns the most severe rating and rejects empty input', () => {
    expect(maxAtes(['simple', 'extreme', 'challenging'])).toBe('extreme')
    expect(maxAtes(['complex', 'simple'])).toBe('complex')
    expect(maxAtes(['challenging'])).toBe('challenging')
    expect(() => maxAtes([])).toThrow(/no ratings/)
  })
})
