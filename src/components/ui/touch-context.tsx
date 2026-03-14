'use client';

import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

const TouchContext = createContext<boolean | undefined>(undefined);

/**
 * Hook to access whether the current device uses a coarse pointer (typically touch).
 */
export const useTouch = () => useContext(TouchContext);

/**
 * Provides a React context indicating whether the current device uses a coarse pointer (typically touch).
 * 
 * This provider uses the `(pointer: coarse)` media query to detect touch-capable devices and updates its value
 * when the pointer type changes. The context value is a boolean indicating touch capability.
 *
 * @param props - The children elements to be rendered within the provider.
 * @returns A context provider that supplies the touch capability state to its descendants.
 */
export const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return <TouchContext.Provider value={isTouch} {...props} />;
};