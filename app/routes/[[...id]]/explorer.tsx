'use client';
import ItemExplorer from "@/app/components/ItemExplorer";
import { GeoItem } from "@/lib/geo-item";
import { useRouter } from "next/navigation";
import { Suspense, useCallback } from "react";

export default function ExplorerWithRouter (
  {items, selectedItem}: {items: GeoItem[], selectedItem?: GeoItem},
) {
    const router = useRouter();

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