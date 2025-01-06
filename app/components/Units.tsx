'use client'

import { useState } from 'react';

export function RawValue({ value }: { value: string}) {
  return <span className="text-sm">{value}</span>
}

export function Distance({ meters }: { meters: number }) {
  const [unit, setUnit] = useState('mi');
  const onClick = () => setUnit(unit === 'km' ? 'mi' : 'km');
  const n = unit === 'km' ? meters / 1000 : meters * 0.000621371;
  return <span onClick={onClick} className="text-sm cursor-pointer underline underline-offset-2">{`${n.toFixed(2)} ${unit}`}</span>
}

export function Elevation({ meters }: { meters: number }) {
  const [unit, setUnit] = useState('ft');
  const onClick = () => setUnit(unit === 'm' ? 'ft' : 'm');
  const n = unit === 'm' ? meters : meters * 3.28084;
  return <span onClick={onClick} className="text-sm cursor-pointer underline underline-offset-2">{`${n.toFixed(0)} ${unit}`}</span>
}

export function ElevationRange({ min, max }: { min: number, max: number }) {
  const [unit, setUnit] = useState('ft');
  const onClick = () => setUnit(unit === 'm' ? 'ft' : 'm');
  const minN = unit === 'm' ? min : min * 3.28084;
  const maxN = unit === 'm' ? max : max * 3.28084;
  return <span onClick={onClick} className="text-sm cursor-pointer underline underline-offset-2">{`${minN.toFixed(0)} to ${maxN.toFixed(0)} ${unit}`}</span>
}



  