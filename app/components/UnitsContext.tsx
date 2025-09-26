'use client'

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
export type ElevationUnit = 'ft' | 'm';
export type DistanceUnit = 'mi' | 'km';

interface ElevationUnitsContextType {
  unit: 'ft' | 'm';
  toggleUnit: () => void;
}

interface DistanceUnitsContextType {
  unit: 'mi' | 'km';
  toggleUnit: () => void;
}

const ElevationUnitsContext = createContext<ElevationUnitsContextType | undefined>(undefined);
const DistanceUnitsContext = createContext<DistanceUnitsContextType | undefined>(undefined);

export const ElevationUnitsProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<ElevationUnit>('ft');
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'ft' ? 'm' : 'ft'));
  };
  return (
    <ElevationUnitsContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </ElevationUnitsContext.Provider>
  );
};

export const DistanceUnitsProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<DistanceUnit>('mi');
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'mi' ? 'km' : 'mi'));
  };
  return (
    <DistanceUnitsContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </DistanceUnitsContext.Provider>
  );
};

export const useElevationUnits = () => {
  const context = useContext(ElevationUnitsContext);
  if (!context) {
    throw new Error('useElevationUnits must be used within an ElevationUnitsProvider');
  }
  return context;
};

export const useDistanceUnits = () => {
  const context = useContext(DistanceUnitsContext);
  if (!context) {
    throw new Error('useDistanceUnits must be used within a DistanceUnitsProvider');
  }
  return context;
};