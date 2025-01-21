import { ItemCollection } from "@/app/routes/routes";
import ItemExplorer from "../../components/ItemExplorer";
import { Suspense } from "react";
const items = await ItemCollection.fromFile();

export async function generateStaticParams() {
  return items.getItems().map((item) => ({ id: item.id }));
}

export default async function RouteDetailPage (
  {params}: {params: Promise<{id: string}>}
) {
    const p = await params;
    return <Suspense fallback={<div>Loading...</div>}>
      <ItemExplorer items={items.getItems()} selectedItem={items.getItem(p.id)} />
    </Suspense>
}