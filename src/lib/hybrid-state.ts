import { useState } from "react";

/**
 * A hook that manages a state that can be either controlled or uncontrolled.
 * 
 * If the `controlledValue` is provided, the state is controlled and will always
 * reflect that value. If it is undefined, the state is uncontrolled and will
 * use internal state initialized to `defaultValue`.
 * 
 * The `onChange` callback is called whenever the state changes, regardless of
 * whether it is controlled or uncontrolled.
 * 
 * Returns a tuple of the current value and a setter function.
 * 
 * @example
 * ```typescript
 * const [value, setValue] = useHybridState(props.value, 'default', (newValue) => {
 *   console.log('Value changed to', newValue);
 * });
 * ```
 */
export function useHybridState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (newValue: T) => void
): [T, (newValue: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;

  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (newValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return [value, setValue];
}