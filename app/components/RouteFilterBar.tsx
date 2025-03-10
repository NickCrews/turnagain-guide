import { useCallback, useEffect, useState } from 'react'
import { Filters } from '@/app/components/ItemExplorer'
import { Input } from '@/components/ui/input'
import { FeatureType } from '@/lib/geo-item'
import { ATES } from '@/lib/terrain-rating'
import { AtesComboBox } from './ATES'
import { GeoTypeComboBox } from './GeoTypeFilterBox'

interface RouteFilterBarProps {
  filters: Filters,
  setFilters: (filters: Filters) => void
}

export default function RouteFilterBar({ filters, setFilters }: RouteFilterBarProps) {
  const handleSetSelectedTypes = (types: Set<FeatureType>) => {
    setFilters({ ...filters, types })
  }

  const handleSetSelectedAtesRatings = (atesRatings: Set<ATES>) => {
    setFilters({ ...filters, atesRatings })
  }

  const handleSetQuery = (query: string) => {
    setFilters({ ...filters, query: query })
  }

  return (
    <div className="flex gap-2 p-2 items-center">
      <SearchBar query={filters.query} setQuery={handleSetQuery} />
      <GeoTypeComboBox selected={filters.types} onSelected={handleSetSelectedTypes}/>
      <AtesComboBox selected={filters.atesRatings} onSelected={handleSetSelectedAtesRatings}/>
    </div>
  )
}

function SearchBar({ query, setQuery }: { query: string, setQuery: (query: string) => void }) {
  const [rawQuery, setRawQuery] = useState(query);
  useDebounce(() => setQuery(rawQuery), [rawQuery], 300);
  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={rawQuery}
        onChange={(e) => setRawQuery(e.target.value)}
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
  const callback = useCallback(effect, [...dependencies, effect]);
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}