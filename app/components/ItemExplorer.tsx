'use client'

import { FeatureType, GeoItem, FEATURE_TYPES } from "@/lib/geo-item";
import Map from "./Map";
import ItemGallery from "./ItemGallery";
import RouteDetail from "./RouteDetail";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RouteFilterBar from "./RouteFilterBar";
import { ATES, ATES_VALUES } from "@/lib/terrain-rating";
import { useMemo, useState } from "react";
import { useIsBelowWidth } from "@/lib/widths";
import { useGeoItems } from "@/components/ui/itemsContext";

type ViewMode = 'map' | 'gallery';

interface ItemExplorerProps {
  items: GeoItem[]
  selectedItem?: GeoItem
  setSelectedItem?: (item: GeoItem | undefined) => void
}

export interface Filters {
  areas: Set<string>
  types: Set<FeatureType>
  atesRatings: Set<ATES>
  query: string
}

function useFilters(): [Filters, (filters: Filters) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allAreaIds = useGeoItems().filter(item => item.properties.feature_type === 'area').map(item => item.id);

  function filtersFromStrings(areaString: string | null, typesString: string | null, atesString: string | null, queryString: string): Filters {
    const defaultAreas = new Set(allAreaIds);
    const areasRaw = new Set((areaString ?? "").split(","));
    const areas = areasRaw.intersection(defaultAreas);

    const typesRaw = new Set((typesString ?? "").split(","));
    const types = typesRaw.intersection(FEATURE_TYPES) as Set<FeatureType>;

    const defaultAtes = new Set(ATES_VALUES);
    const ratingsRaw = new Set((atesString ?? "").split(","));
    const atesRatings = ratingsRaw.intersection(defaultAtes) as Set<ATES>;

    return { areas, types, atesRatings, query: queryString };
  }

  const areaString = searchParams.get('areas');
  const typesString = searchParams.get('types');
  const atesString = searchParams.get('ates');
  const queryString = searchParams.get('query') ?? '';
  const filters = useMemo(() => filtersFromStrings(
    areaString,
    typesString,
    atesString,
    queryString
  ), [areaString, typesString, atesString, queryString]);

  const setFilters = (filters: Filters) => {
    router.push(pathname + '?' + filtersToQueryString(filters, allAreaIds));
  }
  return [filters, setFilters];
}

function filtersToQueryString(filters: Filters, allAreaIds: string[]) {
  const params = new URLSearchParams();
  if (filters.query) {
    params.set('query', filters.query);
  }
  const clauses = [];
  // I want a pretty URL like `types=ascent,descent` but if we use
  // the builtin params.toString() then the `,` gets escaped into
  // `types=ascent%2Cdescent`
  if (filters.areas.size) {
    clauses.push("areas=" + Array.from(filters.areas).join(','));
  }
  if (filters.types.size) {
    clauses.push("types=" + Array.from(filters.types).join(','));
  }
  if (filters.atesRatings.size) {
    clauses.push("ates=" + Array.from(filters.atesRatings).join(','));
  }
  let clausesString = clauses.join('&');
  let queryString = params.toString();
  if (clausesString.length) {
    if (queryString.length) {
      clausesString = "&" + clausesString;
    }
    queryString = queryString + clausesString;
  }
  return queryString;
}

function filterItems(items: GeoItem[], filters: Filters, selectedItemId: string | undefined) {
  const keepItem = (item: GeoItem) => {
    if (selectedItemId && item.id === selectedItemId) {
      return true;
    }

    const matchesArea = filters.areas.size == 0 || filters.areas.has(item.properties.area ?? '');
    const matchesType = filters.types.size == 0 || filters.types.has(item.properties.feature_type);
    const matchesAtes = filters.atesRatings.size == 0 || (item.properties.nicks_ates_ratings.length == 0)
      || item.properties.nicks_ates_ratings.some(rating => filters.atesRatings.has(rating));

    const terms = filters.query.toLowerCase().split(' ');
    const matchesQuery = terms.length === 0 || terms.every(term => item.properties.title.toLowerCase().includes(term));

    return matchesArea && matchesType && matchesAtes && matchesQuery;
  }

  return items.filter(keepItem);
}

export default function ItemExplorer({ items, selectedItem, setSelectedItem }: ItemExplorerProps) {
  const [filters, setFilters] = useFilters();
  // let filteredItems = ;
  const filteredItems = useMemo(() => filterItems(items, filters, selectedItem?.id), [
    // Use a stable representation of the array content instead of the reference.
    // This is avoid re-rendering all child components when the array reference changes.
    // JSON.stringify(filteredItems.map(item => item.id))
    items,
    filters,
    selectedItem?.id
  ]);
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const isMobile = useIsBelowWidth(768) ?? true;
  const [hoveredItem, setHoveredItem] = useState<GeoItem | undefined>(undefined);
  // console.log('ItemExplorer', {
    // items,
    // selectedItem,
    // filteredItems,
    // filters,
    // viewMode,
    // isMobile,
  //   hoveredItem,
  // });
  const handleBack = () => { if (setSelectedItem) setSelectedItem(undefined) };

  const map = <Map
    items={filteredItems}
    onItemClick={setSelectedItem}
    selectedItem={selectedItem}
    hoveredItem={hoveredItem}
    setHoveredItem={setHoveredItem}
  />
  const gallery = <ItemGallery
    items={filteredItems}
    onItemSelect={setSelectedItem}
    hoveredItem={hoveredItem}
    setHoveredItem={setHoveredItem}
  />

  const desktopInterface = (
    <div className="h-full">
      <RouteFilterBar filters={filters} setFilters={setFilters} />
      <div className="flex h-full">
        <div className="flex-1 h-full">{map}</div>
        <div className="flex-1 max-w-lg h-full">
          {
            selectedItem ? <ItemDetail item={selectedItem} onBack={handleBack} /> : gallery
          }
        </div>
      </div>
    </div>
  );

  const getMobileInterface = () => {
    if (selectedItem) {
      return <ItemDetail item={selectedItem} onBack={handleBack} />
    }
    return (
      <>
        <RouteFilterBar filters={filters} setFilters={setFilters} />
        {viewMode === 'map' ? map : gallery}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </>
    )
  }

  return isMobile ? getMobileInterface() : desktopInterface;
}

function ViewModeSwitch({ viewMode, setViewMode }: { viewMode: ViewMode, setViewMode: (view: ViewMode) => void }) {
  const Item = (value: ViewMode, label: string) => (
    <button onClick={() => setViewMode(value)} className='bg-background border p-2 rounded-lg'>
      {label}
    </button>
  )

  return (
    viewMode === 'map'
      ? Item('gallery', 'View as List')
      : Item('map', 'View as Map')
  )
}

function ItemDetail({ item, onBack }: { item: GeoItem, onBack: () => void }) {
  return <>
    <div className="p-2">
      <BackHeader text="Back to search" onBack={onBack} />
    </div>
    <div className="overflow-y-auto h-full rounded-lg px-6 pb-6 pt-3 max-w-2xl w-full">
      <RouteDetail item={item} />
    </div>
  </>
}

function BackHeader({ text, onBack }: { text: string, onBack: () => void }) {
  return (
    <nav className="flex justify-start bg-background">
      <button onClick={onBack} className="close-button flex items-center gap-1">
        <LeftArrowIcon />
        <span className="text-sm">{text}</span>
      </button>
    </nav>
  )
}

function LeftArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}