'use client'

import { FeatureType, GeoItem, FEATURE_TYPES } from "@/lib/geo-item";
import Map from "./map";
import ItemGallery from "./item-gallery";
import { RouteProperties, RouteProse, SubRoutes } from "./route-detail";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RouteFilterBar from "./route-filter-bar";
import { ATES, ATES_VALUES } from "@/lib/terrain-rating";
import { useMemo, useState } from "react";
import { useIsBelowWidth } from "@/lib/widths";
import { useGeoItems } from "@/app/components/items-context";
import { ChevronLeft, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerHandle,
} from '@/components/ui/drawer'
import { Button } from "@/components/ui/button";
import ImageCarousel from "@/app/components/image-carousel";
import { cn } from "@/lib/utils";

interface ItemExplorerProps {
  items: GeoItem[]
  selectedItem?: GeoItem | null
  setSelectedItem?: (item: GeoItem | null) => void
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

  const areaString = searchParams.get('areas');
  const typesString = searchParams.get('types');
  const atesString = searchParams.get('ates');
  const queryString = searchParams.get('query') ?? '';
  const filters = useMemo(() => {
    const defaultAreas = new Set(allAreaIds);
    const areasRaw = new Set((areaString ?? "").split(","));
    const areas = areasRaw.intersection(defaultAreas);

    const typesRaw = new Set((typesString ?? "").split(","));
    const types = typesRaw.intersection(FEATURE_TYPES) as Set<FeatureType>;

    const defaultAtes = new Set(ATES_VALUES);
    const ratingsRaw = new Set((atesString ?? "").split(","));
    const atesRatings = ratingsRaw.intersection(defaultAtes) as Set<ATES>;

    return { areas, types, atesRatings, query: queryString };
  }, [areaString, typesString, atesString, queryString, allAreaIds]);

  const setFilters = (filters: Filters) => {
    router.push(pathname + '?' + filtersToQueryString(filters));
  }
  return [filters, setFilters];
}

function filtersToQueryString(filters: Filters) {
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

// This is a GeoItem, but with an additional isVisible property
export interface ItemWithVisibility extends GeoItem {
  isVisible: boolean
}

function addItemVisibility(items: GeoItem[], filters: Filters, selectedItemId: string | undefined) {
  const isItemVisible = (item: GeoItem) => {
    if (selectedItemId && item.id === selectedItemId) {
      return true;
    }

    const matchesArea = item.properties.feature_type === "area" ? (
      filters.areas.size > 0 && filters.areas.has(item.id)
    ) : (
      filters.areas.size == 0 || filters.areas.has(item.properties.area ?? '')
    );
    const matchesType = filters.types.size == 0 || filters.types.has(item.properties.feature_type);
    const matchesAtes = filters.atesRatings.size == 0 || (item.properties.nicks_ates_ratings.length == 0)
      || item.properties.nicks_ates_ratings.some(rating => filters.atesRatings.has(rating));

    const terms = filters.query.toLowerCase().split(' ');
    const matchesQuery = terms.length === 0 || terms.every(term => item.properties.title.toLowerCase().includes(term));

    return matchesArea && matchesType && matchesAtes && matchesQuery;
  }

  return items.map(item => ({
    ...item,
    isVisible: isItemVisible(item),
  }))
}

export default function ItemExplorer({ items, selectedItem, setSelectedItem }: ItemExplorerProps) {
  const [filters, setFilters] = useFilters();
  const itemsWithVisibility = useMemo(() => addItemVisibility(items, filters, selectedItem?.id), [
    // Use a stable representation of the array content instead of the reference.
    // This is avoid re-rendering all child components when the array reference changes.
    // JSON.stringify(filteredItems.map(item => item.id))
    items,
    filters,
    selectedItem?.id
  ]);
  const visibleItems = itemsWithVisibility.filter(item => item.isVisible);
  const isMobile = useIsBelowWidth("sm") ?? true;
  // console.log('ItemExplorer', {
  // items,
  // selectedItem,
  // filteredItems,
  // filters,
  // viewMode,
  // isMobile,
  //   hoveredItem,
  // });
  const handleBack = () => { if (setSelectedItem) setSelectedItem(null) };

  const map = <Map
    items={itemsWithVisibility}
    setSelectedItem={setSelectedItem}
    selectedItem={selectedItem}
  />;
  const gallery = <ItemGallery
    items={visibleItems}
    onItemSelect={setSelectedItem}
  />

  const filterBar = (
    <div className={cn(
      "absolute top-0 left-0 z-10",
      // Absolute positioning resets width, so we need to explicitly set it to
      // width of the container. Also enable horizontal scrolling if needed.
      "w-full overflow-x-auto",
      // hide scrollbars
      "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      // fade out to transparent on the right to indicate more content
      "[mask-image:linear-gradient(to_right,black_calc(100%-80px),transparent)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-80px),transparent)]"
    )}>
      <RouteFilterBar filters={filters} setFilters={setFilters} />
    </div>
  )

  const desktopInterface = (
    <div className="h-full">
      <div className="flex h-full">
        <div className="flex-1 h-full relative">
          {map}
          {filterBar}
        </div>
        <div className="flex-1 max-w-lg h-full">
          {
            selectedItem ? <ItemDetailDesktop item={selectedItem} onBack={handleBack} /> : gallery
          }
        </div>
      </div>
    </div>
  );

  const getMobileInterface = () => {
    if (selectedItem) {
      return (
        <>
          <div className="relative h-full">
            {map}
            {filterBar}
          </div>
          <RouteDetailsDrawer
            onClose={handleBack}
            item={selectedItem}
          />
        </>
      );
    }
    return (
      <>
        <div className="relative h-full">
          {map}
          {filterBar}
        </div>
        <GalleryDrawer>
          {gallery}
        </GalleryDrawer>
      </>
    );
  }

  return isMobile ? getMobileInterface() : desktopInterface;
}

function ItemDetailDesktop({ item, onBack }: { item: GeoItem, onBack: () => void }) {
  return <>
    <div className="p-2">
      <nav className="flex justify-start bg-background">
        <button onClick={onBack} className="close-button flex items-center gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md p-1 -m-1">
          <ChevronLeft />
          <span className="text-sm">Back to search</span>
        </button>
      </nav>
    </div>
    <div className="overflow-y-auto h-full rounded-lg px-6 pb-6 pt-3 max-w-2xl w-full">
      {item.properties.images && <ImageCarousel images={item.properties.images} triggerLightbox />}
      <h2 className='text-2xl font-bold mb-4'>{item.properties.title}</h2>
      <RouteProperties item={item} />
      <RouteProse item={item} />
      <SubRoutes childrenIds={item.properties.children} />
    </div>
  </>
}

function GalleryDrawer({
  children,
}: {
  children: React.ReactNode
}) {
  const snapPoints = ['75px', .85];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  return (
    <Drawer
      open={true}
      // Allow interacting with background stuff
      modal={false}
      activeSnapPoint={snap}
      snapPoints={snapPoints}
      setActiveSnapPoint={setSnap}
    >
      <DrawerContent className="h-full">
        <DrawerHandle />
        <DrawerTitle className="text-center">
          Routes
        </DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}


function RouteDetailsDrawer({
  onClose,
  item,
}: {
  onClose?: () => void,
  item: GeoItem
}) {
  const snapPoints = ['130px', .5, .85];
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  return (
    <Drawer
      open={true}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
      }}
      // Allow interacting with background stuff
      modal={false}
      activeSnapPoint={snap}
      snapPoints={snapPoints}
      setActiveSnapPoint={setSnap}
    >
      <DrawerContent className="h-full px-2">
        <DrawerHandle />
        <div className="flex items-center justify-between p-2">
          <DrawerTitle>
            {item.properties.title}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="outline" size="icon-xs-rounded" onClick={onClose} aria-label="Close">
              <X />
            </Button>
          </DrawerClose>
        </div>
        {/* TODO: this scroll behavior isn't great. */}
        <div className="overflow-y-auto h-full">
          {item.properties.images && <ImageCarousel images={item.properties.images} triggerLightbox={true} />}
          <RouteProperties item={item} />
          <RouteProse item={item} />
          <SubRoutes childrenIds={item.properties.children} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}