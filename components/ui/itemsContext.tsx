'use client';

import { GeoItem } from '@/lib/geo-item';
import React, { createContext, useContext } from 'react';

const GeoItemsContext = createContext<GeoItem[] | undefined>(undefined);

export function useGeoItems() {
  const items = useContext(GeoItemsContext);
  if (items === undefined) {
    throw new Error('useGeoItems must be used within a GeoItemsProvider');
  }
  return items;
}

export function GeoItemsProvider({ items, children }: {items: GeoItem[], children: React.ReactNode}) {
  return (
    <GeoItemsContext.Provider value={ items }>
      {children}
    </GeoItemsContext.Provider>
  );
};