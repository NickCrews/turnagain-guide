import { describe, expect, it } from 'vitest'
import { atesColor, atesTextColor, ATES_VALUES, maxAtes } from '@/lib/terrain-rating'

describe('atesColor', () => {
  it('returns a color for every known ATES value', () => {
    for (const value of ATES_VALUES) {
      expect(atesColor(value)).toBeTruthy()
    }
  })

  it('throws on an unknown value', () => {
    // @ts-expect-error testing runtime guard for an invalid value
    expect(() => atesColor('bogus')).toThrow(/unknown ATES value/)
  })
})

describe('atesTextColor', () => {
  it('returns black on the light non-avalanche background and white otherwise', () => {
    expect(atesTextColor('non-avalanche')).toBe('black')
    expect(atesTextColor('simple')).toBe('white')
    expect(atesTextColor('extreme')).toBe('white')
  })

  it('throws on an unknown value', () => {
    // @ts-expect-error testing runtime guard for an invalid value
    expect(() => atesTextColor('bogus')).toThrow(/unknown ATES value/)
  })
})

describe('maxAtes', () => {
  it('returns the most severe rating regardless of order', () => {
    expect(maxAtes(['simple', 'extreme', 'challenging'])).toBe('extreme')
    expect(maxAtes(['complex', 'simple'])).toBe('complex')
  })

  it('returns the only rating when given a single element', () => {
    expect(maxAtes(['challenging'])).toBe('challenging')
  })

  it('throws when given no ratings', () => {
    expect(() => maxAtes([])).toThrow(/no ratings/)
  })
})
