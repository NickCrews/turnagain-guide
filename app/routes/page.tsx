import ItemExplorer from "../components/ItemExplorer";
import { GeoItemCollection } from "../../lib/geo-item";
import { Suspense } from "react";

const items = await GeoItemCollection.fromFile();
const itemArray = items.getItems();

export default async function Home() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ItemExplorer items={itemArray} selectedItem={undefined} />
  </Suspense>;
}
