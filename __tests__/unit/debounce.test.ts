import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '@/lib/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic behavior', () => {
    it('throws TypeError when the first argument is not a function', () => {
      expect(() => debounce('not a function' as any, 100)).toThrow(TypeError);
      expect(() => debounce(null as any, 100)).toThrow(TypeError);
    });

    it('does not invoke the function immediately by default (trailing only)', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      expect(fn).not.toHaveBeenCalled();
    });

    it('invokes the function after the wait period elapses', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('invokes only once when called multiple times within the wait window', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('resets the timer on each call within the wait window', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      vi.advanceTimersByTime(50); // halfway
      debounced();             // reset
      vi.advanceTimersByTime(50); // only 50ms since last call
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(50); // now 100ms since last call
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('calls the function with the last arguments', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced(1);
      debounced(2);
      debounced(3);
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith(3);
    });

    it('can be called again after the wait period expires', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      vi.advanceTimersByTime(100);
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('uses a default wait of 0 when not specified', () => {
      const fn = vi.fn();
      const debounced = debounce(fn);
      debounced();
      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('leading option', () => {
    it('invokes the function immediately on the first call', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });
      debounced();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('does not call again during the wait window', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });
      debounced();
      debounced();
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('calls again on a new invocation after the wait expires', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });
      debounced('first');
      vi.advanceTimersByTime(100);
      debounced('second');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, 'first');
      expect(fn).toHaveBeenNthCalledWith(2, 'second');
    });

    it('calls on both leading and trailing edges when both are true', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: true });
      debounced('a');
      debounced('b'); // extends timer
      expect(fn).toHaveBeenCalledTimes(1); // leading call
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2); // trailing call with last arg
      expect(fn).toHaveBeenLastCalledWith('b');
    });
  });

  describe('cancel()', () => {
    it('prevents a pending trailing invocation', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(100);
      expect(fn).not.toHaveBeenCalled();
    });

    it('resets state so the next call starts fresh', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(100);
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('is safe to call when there is nothing pending', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      expect(() => debounced.cancel()).not.toThrow();
    });
  });

  describe('flush()', () => {
    it('immediately invokes a pending trailing call', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced('hello');
      debounced.flush();
      expect(fn).toHaveBeenCalledWith('hello');
    });

    it('returns undefined when there is nothing pending', () => {
      const fn = vi.fn(() => 42);
      const debounced = debounce(fn, 100);
      const result = debounced.flush();
      expect(result).toBeUndefined();
      expect(fn).not.toHaveBeenCalled();
    });

    it('prevents a duplicate trailing invocation after flush', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      debounced();
      debounced.flush();
      vi.advanceTimersByTime(100);
      // flush consumed the pending call; the timer fires but there's nothing queued
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('maxWait option', () => {
    it('forces invocation after maxWait even when still being called', () => {
      const fn = vi.fn();
      // wait=100, maxWait=200 → must fire by 200ms even with continuous calls
      const debounced = debounce(fn, 100, { maxWait: 200 });

      // Call every 50ms for 250ms
      for (let elapsed = 0; elapsed < 250; elapsed += 50) {
        debounced();
        vi.advanceTimersByTime(50);
      }

      expect(fn).toHaveBeenCalled();
    });

    it('maxWait is at least as large as wait', () => {
      // maxWait should be coerced to Math.max(maxWait, wait)
      const fn = vi.fn();
      // wait=100, maxWait=50 → coerced to maxWait=100
      const debounced = debounce(fn, 100, { maxWait: 50 });
      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('return value', () => {
    it('returns undefined before the function has ever been invoked', () => {
      const fn = vi.fn((x: number) => x * 2);
      const debounced = debounce(fn, 100);
      // First call ever — no cached result yet
      const first = debounced(5);
      expect(first).toBeUndefined();
    });

    it('returns the cached result from the previous invocation while waiting', () => {
      // The debounce implementation stores the last result and returns it on
      // subsequent calls within a new burst, before the timer fires again.
      const fn = vi.fn((x: number) => x * 2);
      const debounced = debounce(fn, 100);
      debounced(5);
      vi.advanceTimersByTime(100); // fn(5) fires → result cached as 10
      const second = debounced(3); // new burst, timer not fired yet
      // Returns the cached result from the previous invocation
      expect(second).toBe(10);
    });
  });
});
