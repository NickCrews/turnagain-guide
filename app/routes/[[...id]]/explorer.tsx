'use client';
import ItemExplorer from "@/app/components/ItemExplorer";
import { GeoItem } from "@/lib/geo-item";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";
import { useGeoItems } from "@/app/components/itemsContext";

export default function ExplorerWithRouter(
  { selectedItemId }: { selectedItemId: string | null },
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
    />
  </Suspense>
}