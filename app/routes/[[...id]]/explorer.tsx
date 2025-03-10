'use client';
import ItemExplorer from "@/app/components/ItemExplorer";
import { GeoItem } from "@/lib/geo-item";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function ExplorerWithRouter (
  {items, selectedItem}: {items: GeoItem[], selectedItem: GeoItem | undefined},
) {
    const router = useRouter();

    const handleItemSelect = (item: GeoItem | undefined) => {
      if (!item) {
        router.push(`/routes/`);
      } else {
        router.push(`/routes/${item.id}`);
      }
    }
    return <Suspense fallback={<div>Loading...</div>}>
      <ItemExplorer
        items={items}
        selectedItem={selectedItem}
        setSelectedItem={handleItemSelect}
      />
    </Suspense>
}