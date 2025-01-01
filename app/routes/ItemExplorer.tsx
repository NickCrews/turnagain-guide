'use client'

import { Item } from "./routes";
import Map from "../components/Map";
import ItemGallery from "../components/ItemGallery";
import { useRouter } from "next/navigation";

export default function ItemExplorer({items}: {items: Item[]}) {
  const router = useRouter();

  const handleItemSelect = (item: Item) => {
    router.push(`/routes/${item.id}`);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 h-full">
        <Map items={items} onItemClick={handleItemSelect}/>
      </div>
      <div className="flex-1 max-w-96 h-full">
        <ItemGallery items={items} onItemSelect={handleItemSelect}/>
      </div>
    </div>
  );
}