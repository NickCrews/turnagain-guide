import { loadGeoItemCollection } from "@/lib/geo-item-server";
import ItemExplorer from "../../components/ItemExplorer";
import { Suspense } from "react";

const collection = await loadGeoItemCollection();

export async function generateStaticParams() {
  const withIds = collection.getItems().map((item) => ({ id: [item.id] })); // eg /routes/tincan-common
  const withoutIds = [{ id: undefined }];  // the root route eg /routes
  return [...withIds, ...withoutIds];
}

export default async function RouteDetailPage (
  {params}: {params: Promise<{id?: string[]}>}
) {
    const p = await params;
    let selectedItem = undefined;
    if (p.id) {
      if (p.id.length > 1) {
        // raise 404
        throw new Error("Invalid URL");
      }
      selectedItem = collection.getItem(p.id[0]);
    }
    return <Suspense fallback={<div>Loading...</div>}>
      <ItemExplorer items={collection.getItems()} selectedItem={selectedItem} />
    </Suspense>
}