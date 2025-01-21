import { useCallback, useEffect, useState } from 'react'
import { FEATURE_TYPES, Filters } from '@/app/components/ItemExplorer'
interface RouteFilterBarProps {
  filters: Filters,
  setFilters: (filters: Filters) => void
}

export default function RouteFilterBar({ filters, setFilters }: RouteFilterBarProps) {
  const handleSetSelectedTypes = (selected: Set<string>) => {
    setFilters({ ...filters, types: selected })
  }

  const handleSetQuery = (query: string) => {
    setFilters({ ...filters, query: query })
  }

  return (
    <div className="flex gap-2 p-2 items-center">
      <SearchBar query={filters.query} setQuery={handleSetQuery} />
      <DropdownToggles title="Type" options={Array.from(FEATURE_TYPES)} selected={filters.types} setSelected={handleSetSelectedTypes} />
    </div>
  )
}

interface DropdownTogglesProps {
  title: string
  options: string[]
  selected: Set<string>
  setSelected: (selected: Set<string>) => void
}

function DropdownToggles({ title, options, selected, setSelected }: DropdownTogglesProps) {
  const [open, setOpen] = useState(false)

  function setChecked(option: string, checked: boolean) {
    const newSelected = new Set(selected)
    if (checked) {
      newSelected.add(option)
    } else {
      newSelected.delete(option)
    }
    setSelected(newSelected)
  }

  const label = `${title} ${open ? '▲' : '▼'}`

  return (
    <div className="relative rounded-md border border-gray-300">
      <button onClick={() => setOpen(!open)} className="py-0.5 px-1">
        <span className="text-md font-bold">{label}</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-10 flex flex-col gap-2 bg-background">
          {options.map(option => (
            <Toggle
              key={option}
              checked={selected.has(option)}
              setChecked={(checked) => setChecked(option, checked)}
              label={option}
            />
            ))}
          </div>
        )}
    </div>
  )
}

function Toggle({ checked, setChecked, label }: { checked: boolean, setChecked: (checked: boolean) => void, label: string }) {
  return (
    <button className="flex gap-2 items-center hover:cursor-pointer" onClick={() => setChecked(!checked)}>
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
      <label>{label}</label>
    </button>
  )
}


function SearchBar({ query, setQuery }: { query: string, setQuery: (query: string) => void }) {
  const [rawQuery, setRawQuery] = useState(query);
  useDebounce(() => setQuery(rawQuery), [rawQuery], 300);
  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={rawQuery}
        onChange={(e) => setRawQuery(e.target.value)}
        className="rounded-md bg-foreground text-background px-1"
        placeholder="Filter..."
      />
      {rawQuery && (
        <button
          onClick={() => {
            setRawQuery('');
            setQuery('');
          }}
          className="absolute right-2 text-gray-500 hover:text-gray-700"
        >✕</button>
      )}
    </div>
  )
}

// from https://stackoverflow.com/a/69729166/5156887
function useDebounce(effect: () => void, dependencies: any[], delay: number) {
  const callback = useCallback(effect, dependencies);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}