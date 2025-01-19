'use client'

import { Item } from "./routes";
import Map from "../components/Map";
import ItemGallery from "../components/ItemGallery";
import RouteDetail from "../components/RouteDetail";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RouteFilterBar from "../components/RouteFilterBar";

export const FEATURE_TYPES = new Set(['parking', 'peak', 'ascent', 'descent']);

interface ItemExplorerProps {
  items: Item[]
  selectedItem?: Item
}

export interface Filters {
  types: Set<string>
  query: string
}

function useFilters() : [Filters, (filters: Filters) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeString = searchParams.get('types');
  const types = new Set(typeString == null ? Array.from(FEATURE_TYPES) : typeString.split(','));
  const query = searchParams.get('query') || '';
  const setFilters = (filters: Filters) => {
    router.push(pathname + '?' + filtersToQueryString(filters));
  }
  return [{ types, query }, setFilters];
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
  return result;
}

function filterItems(items: Item[], filters: Filters, selectedItem: Item | undefined) {
  const keepItem = (item: Item) => {
    if (selectedItem && item.id === selectedItem.id) {
      return true;
    }
    
    const matchesType = filters.types.has(item.properties.feature_type);
    
    const terms = filters.query.toLowerCase().split(' ');
    const matchesQuery = terms.length === 0 || terms.every(term => item.properties.title.toLowerCase().includes(term));
    
    return matchesType && matchesQuery;
  }

  return items.filter(keepItem);
}

export default function ItemExplorer({items, selectedItem}: ItemExplorerProps) {
  const router = useRouter();
  const [filters, setFilters] = useFilters();
  const filteredItems = filterItems(items, filters, selectedItem);

  const handleItemSelect = (item?: Item) => {
    const path = item ? `/routes/${item.id}` : "/routes"
    router.push(path + '?' + filtersToQueryString(filters));
  };

  const handleBack = () => {
    router.push('/routes' + '?' + filtersToQueryString(filters));
  };

  let gallery;
  if (filteredItems.length === 0) {
    gallery = <div className="flex h-full pt-16 justify-center text-gray-500">
      <span>No matching items. Relax your filters.</span>
    </div>
  } else {
    gallery = <ItemGallery items={filteredItems} onItemSelect={handleItemSelect}/>
  }

  return (
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
            gallery
          } 
        </div>
      </div>
    </div>
  );
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