import { useEffect, useRef } from 'react';

/**
 * Options for configuring the debounce behavior.
 *
 * @property {boolean} [leading] - Specify invoking on the leading edge of the timeout.
 * @property {number} [maxWait] - The maximum time `func` is allowed to be delayed before it's invoked.
 * @property {boolean} [trailing] - Specify invoking on the trailing edge of the timeout.
 */
export interface DebounceOptions {
    leading?: boolean;
    maxWait?: number;
    trailing?: boolean;
}


/**
 * Represents a debounced function.
 * 
 * @template T - The type of the original function to be debounced.
 * 
 * @interface DebouncedFunction
 * 
 * @param {...Parameters<T>} args - The arguments to be passed to the original function.
 * @returns {ReturnType<T> | undefined} - The return type of the original function or undefined if the function is debounced.
 * 
 * @property {() => void} cancel - Cancels the debounced function if it is waiting to be called.
 * @property {() => ReturnType<T> | undefined} flush - Immediately invokes the debounced function if it is waiting to be called.
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked. The debounced function
 * comes with a `cancel` method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked with the last
 * arguments provided to the debounced function. Subsequent calls to the debounced function
 * return the result of the last `func` invocation.
 *
 * @template T - The type of the function to debounce.
 * @param {T} func - The function to debounce.
 * @param {number} [wait=0] - The number of milliseconds to delay.
 * @param {DebounceOptions} [options={}] - The options object.
 * @param {boolean} [options.leading=false] - Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait] - The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true] - Specify invoking on the trailing edge of the timeout.
 * @returns {DebouncedFunction<T>} - Returns the new debounced function.
 * @throws {TypeError} - Throws if `func` is not a function.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 0,
    options: DebounceOptions = {}
): DebouncedFunction<T> {
    let lastArgs: any;
    let lastThis: any;
    let maxWait: number | undefined;
    let result: ReturnType<T> | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let lastCallTime: number | undefined;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }

    wait = Number(wait) || 0;
    if (typeof options === 'object') {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : undefined;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time: number) {
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function leadingEdge(time: number) {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time: number) {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        return maxing
            ? Math.min(timeWaiting, (maxWait || 0) - timeSinceLastInvoke)
            : timeWaiting;
    }

    function shouldInvoke(time: number) {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= (maxWait || 0))
        );
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time: number) {
        timerId = undefined;

        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel() {
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function debounced(this: any, ...args: any[]) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;    // eslint-disable-line @typescript-eslint/no-this-alias
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = setTimeout(timerExpired, wait);
        }
        return result;
    }

    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}


export function useDebounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 0,
    options: DebounceOptions = {}
): DebouncedFunction<T> {
    const debouncedFunc = debounce(func, wait, options);
    // Use a ref to keep the debounced function stable across renders
    const debouncedFuncRef = useRef(debouncedFunc);

    useEffect(() => {
        debouncedFuncRef.current = debounce(func, wait, options);
        return () => {
            debouncedFuncRef.current?.cancel();
        };
    }, [func, wait, options]);

    return debouncedFuncRef.current;
}
