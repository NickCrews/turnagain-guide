'use client'

import { useState } from 'react';

export function RawValue({ value }: { value: string}) {
  return <span className="text-sm">{value}</span>
}

export function Distance({ meters }: { meters: number }) {
  const [unit, setUnit] = useState('mi');
  const n = unit === 'km' ? meters / 1000 : meters * 0.000621371;
  return <span
    onClick={(e) => {
      setUnit(unit === 'km' ? 'mi' : 'km');
      e.stopPropagation();
    }}
    className="text-sm cursor-pointer underline underline-offset-2">{`${n.toFixed(2)} ${unit}`}
  </span>
}

export function Elevation({ meters }: { meters: number }) {
  const [unit, setUnit] = useState('ft');
  const n = unit === 'm' ? meters : meters * 3.28084;
  return <span
    onClick={(e) => {
      setUnit(unit === 'm' ? 'ft' : 'm');
      e.stopPropagation();
    }}
    className="text-sm cursor-pointer underline underline-offset-2">{`${n.toFixed(0)} ${unit}`}
  </span>
}

export function ElevationRange({ min, max, type }: { min: number, max: number, type?: string }) {
  const [unit, setUnit] = useState('ft');
  let startN = unit === 'm' ? min : min * 3.28084;
  let endN = unit === 'm' ? max : max * 3.28084;
  if (type?.toLowerCase() === 'descent') {
    [startN, endN] = [endN, startN];
  }
  const delta = endN - startN;
  return (
    <span
      onClick={(e) => {
        setUnit(unit === 'm' ? 'ft' : 'm');
        e.stopPropagation();
      }}
      className="text-sm cursor-pointer underline underline-offset-2"
    >
      {`${startN.toFixed(0)} to ${endN.toFixed(0)} ${unit} (${delta.toFixed(0)} ${unit})`}
    </span>)
}



  