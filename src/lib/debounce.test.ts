import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '@/lib/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces calls and keeps the latest arguments', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()
    expect(fn).not.toHaveBeenCalled()

    debounced('first')
    debounced('second')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledExactlyOnceWith('second')
  })

  it('invokes immediately on the leading edge when configured', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100, { leading: true, trailing: false })

    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancel prevents a pending trailing invocation', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(100)

    expect(fn).not.toHaveBeenCalled()
  })

  it('flush invokes a pending call immediately', () => {
    const fn = vi.fn().mockReturnValue('done')
    const debounced = debounce(fn, 100)

    debounced('x')
    expect(debounced.flush()).toBe('done')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('throws when not given a function', () => {
    expect(() => debounce(42 as never)).toThrow(TypeError)
  })
})
