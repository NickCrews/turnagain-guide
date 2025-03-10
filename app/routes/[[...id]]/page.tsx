import { loadGeoItems } from "@/lib/geo-item-server";
import ExplorerWithRouter from "./explorer";

const items = await loadGeoItems();

export async function generateStaticParams() {
  const withIds = items.map((item) => ({ id: [item.id] })); // eg /routes/tincan-common
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
      const id = p.id[0];
      selectedItem = items.find((item) => item.id === id);
      if (!selectedItem) {
        // raise 404
        throw new Error("Item not found");
      }
    }

    return <ExplorerWithRouter items={items} selectedItem={selectedItem} />;
}