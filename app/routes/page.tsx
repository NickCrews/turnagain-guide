import ItemExplorer from "../components/ItemExplorer";
import { loadGeoItemCollection } from "@/lib/geo-item-server";
import { Suspense } from "react";

const items = await loadGeoItemCollection();
const itemArray = items.getItems();

export default async function Home() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ItemExplorer items={itemArray} selectedItem={undefined} />
  </Suspense>;
}
