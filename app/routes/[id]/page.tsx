import { loadGeoItemCollection } from "@/lib/geo-item-server";
import ItemExplorer from "../../components/ItemExplorer";
import { Suspense } from "react";

const collection = await loadGeoItemCollection();

export async function generateStaticParams() {
  return collection.getItems().map((item) => ({ id: item.id }));
}

export default async function RouteDetailPage (
  {params}: {params: Promise<{id: string}>}
) {
    const p = await params;
    return <Suspense fallback={<div>Loading...</div>}>
      <ItemExplorer items={collection.getItems()} selectedItem={collection.getItem(p.id)} />
    </Suspense>
}