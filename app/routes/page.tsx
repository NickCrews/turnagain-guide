import ItemExplorer from "./ItemExplorer";
import { ItemCollection } from "./routes";
import { Suspense } from "react";

const items = await ItemCollection.fromFile();
const itemArray = items.getItems();

export default async function Home() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ItemExplorer items={itemArray} selectedItem={undefined} />
  </Suspense>;
}
