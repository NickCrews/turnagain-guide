import { describe, expect, it } from 'vitest'
import { capitalize, cn } from '@/lib/utils'

describe('capitalize', () => {
  it('capitalizes the first character and preserves edge cases', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('World')).toBe('World')
    expect(capitalize('')).toBe('')
  })
})

describe('cn', () => {
  it('joins class names, drops falsy values, and resolves conflicts', () => {
    expect(cn('a', 'b')).toBe('a b')
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
