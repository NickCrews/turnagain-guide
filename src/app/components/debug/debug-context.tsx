'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const isDev = process.env.NODE_ENV === 'development';

interface DebugContextValue {
  isDebug: boolean;
  turnOffDebug: () => void;
}

const DebugContext = createContext<DebugContextValue>({
  isDebug: isDev,
  turnOffDebug: () => { },
});

export function useDebug() {
  return useContext(DebugContext);
}

export function DebugProvider({ children }: { children: React.ReactNode }) {
  // Always on in dev; in prod, turned on via ?debug URL param
  const [isDebug, setIsDebug] = useState(isDev);

  useEffect(() => {
    if (!isDev) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('debug')) {
        setIsDebug(true);
      }
    }
  }, []);

  return (
    <DebugContext.Provider value={{ isDebug, turnOffDebug: () => setIsDebug(false) }}>
      {children}
    </DebugContext.Provider>
  );
}
