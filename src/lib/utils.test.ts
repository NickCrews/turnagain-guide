import { describe, expect, it } from 'vitest'
import { capitalize, cn } from '@/lib/utils'

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('leaves an already-capitalized string unchanged', () => {
    expect(capitalize('World')).toBe('World')
  })

  it('handles an empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes, keeping the last', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
