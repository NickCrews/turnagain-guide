import ItemExplorer from "./ItemExplorer";
import { ItemCollection } from "./routes";

export default async function Home() {
  const items = await ItemCollection.fromFile();
  return <ItemExplorer items={items.getItems()} />;
}
