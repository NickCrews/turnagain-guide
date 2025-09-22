import { Filters } from '@/app/components/ItemExplorer'
import { Input } from '@/components/ui/input'
import { FeatureType } from '@/lib/geo-item'
import { ATES } from '@/lib/terrain-rating'
import { AtesComboBox } from './ATES'
import { GeoTypeComboBox } from './GeoTypeFilterBox'
import { AreaComboBox } from './Area'

interface RouteFilterBarProps {
  filters: Filters,
  setFilters: (filters: Filters) => void
}

export default function RouteFilterBar({ filters, setFilters }: RouteFilterBarProps) {
  const handleSetSelectedAreas = (areas: Set<string>) => {
    setFilters({ ...filters, areas })
  }

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
    <div className="flex gap-2 p-2 items-center overflow-x-auto min-w-0">
      <div className="shrink-0">
        <SearchBar query={filters.query} setQuery={handleSetQuery} />
      </div>
      <div className="shrink-0">
        <AreaComboBox selected={filters.areas} onSelected={handleSetSelectedAreas}/>
      </div>
      <div className="shrink-0">
        <GeoTypeComboBox selected={filters.types} onSelected={handleSetSelectedTypes}/>
      </div>
      <div className="shrink-0">
        <AtesComboBox selected={filters.atesRatings} onSelected={handleSetSelectedAtesRatings}/>
      </div>
    </div>
  )
}

function SearchBar({ query, setQuery }: { query: string, setQuery: (query: string) => void }) {
  return (
    <div className="relative flex items-center bg-background rounded-md">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter..."
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2 text-gray-500 hover:text-gray-700"
        >✕</button>
      )}
    </div>
  )
}