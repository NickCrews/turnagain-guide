'use client';
import ItemExplorer from "@/components/app/item-explorer";
import { GeoItem } from "@/lib/geo-item";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";
import { useGeoItems } from "@/components/app/items-context";
import { type FigureID } from "@/figures";

export default function ExplorerWithRouter(
  { selectedItemId, initialFigureId }: { selectedItemId: string | null, initialFigureId?: FigureID },
) {
  const router = useRouter();
  const items = useGeoItems();

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    const item = items.find((item) => item.id === selectedItemId);
    if (!item) {
      throw new Error("Item not found");
    }
    return item;
  }, [selectedItemId, items]);

  const handleItemSelect = useCallback((newItem: GeoItem | null) => {
    if (!newItem && selectedItem) {
      router.push(`/routes/`);
    } else if (newItem && newItem.id !== selectedItem?.id) {
      router.push(`/routes/${newItem.id}`);
    }
  }, [router, selectedItem]);

  return <Suspense fallback={<div>Loading...</div>}>
    <ItemExplorer
      items={items}
      selectedItem={selectedItem}
      setSelectedItem={handleItemSelect}
      initialFigureId={initialFigureId}
    />
  </Suspense>
}