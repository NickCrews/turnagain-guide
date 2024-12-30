import ItemExplorer from "./components/ItemExplorer";
import { Item } from "./types";

import { promises as fs } from 'fs';

export default async function Home() {
  const geojson = await fs.readFile(process.cwd() + '/public/objects.geojson', 'utf8');
  const items = JSON.parse(geojson).features as Item[];
  return <ItemExplorer items={items} />;
}
