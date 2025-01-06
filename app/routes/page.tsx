import ItemExplorer from "./ItemExplorer";
import { ItemCollection } from "./routes";

const items = await ItemCollection.fromFile();
const itemArray = items.getItems();

export default async function Home() {
  return <ItemExplorer items={itemArray} selectedItem={undefined} />;
}
