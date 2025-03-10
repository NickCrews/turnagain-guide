'use client'

import { FeatureType, Item } from "../routes/routes";
import Map from "./Map";
import ItemGallery from "./ItemGallery";
import RouteDetail from "./RouteDetail";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RouteFilterBar from "./RouteFilterBar";
import { ATES, ATES_VALUES } from "@/lib/terrain-rating";
import { useState } from "react";
import {useIsBelowWidth} from "@/lib/widths";

export const FEATURE_TYPES: Set<FeatureType> = new Set(['parking', 'peak', 'ascent', 'descent']);

type ViewMode = 'map' | 'gallery';

interface ItemExplorerProps {
  items: Item[]
  selectedItem?: Item
}

export interface Filters {
  types: Set<FeatureType>
  atesRatings: Set<ATES>
  query: string
}

function useFilters() : [Filters, (filters: Filters) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const typesRaw = new Set(searchParams.get('types')?.split(",") ?? FEATURE_TYPES);
  const types = typesRaw.intersection(FEATURE_TYPES) as Set<FeatureType>;
  
  const defaultAtes =  new Set(ATES_VALUES);
  const ratingsRaw = new Set(searchParams.get('ates')?.split(",") ?? defaultAtes);
  const atesRatings = ratingsRaw.intersection(defaultAtes) as Set<ATES>;
  
  const query = searchParams.get('query') || '';
  const setFilters = (filters: Filters) => {
    router.push(pathname + '?' + filtersToQueryString(filters));
  }
  return [{ types, atesRatings, query }, setFilters];
}

function filtersToQueryString(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.query) {
    params.set('query', filters.query);
  }
  let result = params.toString();
  // I want a pretty URL like `types=ascent,descent` but if we use
  // the builtin params.toString() then the `,` gets escaped into
  // `types=ascent%2Cdescent`
  if (filters.types.size !== FEATURE_TYPES.size) {
    result = result + "&types=" + Array.from(filters.types).join(',');
  }
  if (filters.atesRatings.size !== ATES_VALUES.length) {
    result = result + "&ates=" + Array.from(filters.atesRatings).join(',');
  }
  return result;
}

function filterItems(items: Item[], filters: Filters, selectedItem: Item | undefined) {
  const keepItem = (item: Item) => {
    if (selectedItem && item.id === selectedItem.id) {
      return true;
    }
    
    const matchesType = filters.types.has(item.properties.feature_type);
    const matchesAtes = item.properties.nicks_ates_ratings.some(rating => filters.atesRatings.has(rating));
    
    const terms = filters.query.toLowerCase().split(' ');
    const matchesQuery = terms.length === 0 || terms.every(term => item.properties.title.toLowerCase().includes(term));
    
    return matchesType && matchesQuery && matchesAtes;
  }

  return items.filter(keepItem);
}

export default function ItemExplorer({items, selectedItem}: ItemExplorerProps) {
  const router = useRouter();
  const [filters, setFilters] = useFilters();
  const filteredItems = filterItems(items, filters, selectedItem);
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const isMobile = useIsBelowWidth(768) ?? true;

  const handleItemSelect = (item?: Item) => {
    const path = item ? `/routes/${item.id}` : "/routes"
    router.push(path + '?' + filtersToQueryString(filters));
  };

  const handleBack = () => {
    router.push('/routes' + '?' + filtersToQueryString(filters));
  };

  const desktopInterface = (
    <div className="h-full">
      <RouteFilterBar filters={filters} setFilters={setFilters} />
      <div className="flex h-full">
        <div className="flex-1 h-full">
          <Map items={filteredItems} onItemClick={handleItemSelect} selectedItem={selectedItem}/>
        </div>
        <div className="flex-1 max-w-lg h-full">
          {
            selectedItem ? 
            <ItemDetail item={selectedItem} onBack={handleBack} /> : 
            <ItemGallery items={filteredItems} onItemSelect={handleItemSelect}/>
          } 
        </div>
      </div>
    </div>
  );

  const getMobileInterface = () => {
    if (selectedItem) {
      return <ItemDetail item={selectedItem} onBack={handleBack} />
    }
    const content = (
      viewMode === 'map'
      ? <Map items={filteredItems} onItemClick={handleItemSelect} selectedItem={selectedItem}/>
      : <ItemGallery items={filteredItems} onItemSelect={handleItemSelect}/>
    )
    return (
      <>
        <RouteFilterBar filters={filters} setFilters={setFilters} />
        {content}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </>
    )
  }

  return isMobile ? getMobileInterface() : desktopInterface;
}

function ViewModeSwitch({viewMode, setViewMode}: {viewMode: ViewMode, setViewMode: (view: ViewMode) => void}) {
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

function ItemDetail({item, onBack}: {item: Item, onBack: () => void}) {
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