import { loadGeoItems } from "@/lib/geo-item";
import ExplorerWithRouter from "./explorer";

export async function generateStaticParams() {
  const items = await loadGeoItems();
  const withIds = items.map((item) => ({ id: [item.id] })); // eg /routes/tincan-proper
  const withoutIds = [{ id: undefined }];  // the root route eg /routes
  return [...withIds, ...withoutIds];
}

export default async function RouteDetailPage (
  {params}: {params: Promise<{id?: string[]}>}
) {
    const p = await params;
    return <ExplorerWithRouter selectedItemId={p.id ? p.id[0] : null} />;
}