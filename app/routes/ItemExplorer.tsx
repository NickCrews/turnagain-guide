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
    <>  
        <link rel="stylesheet" href="/Cesium/Widgets/widgets.css" />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/2 h-full">
            <Map items={items} onItemClick={handleItemSelect}/>
          </div>
          <div className="w-full md:w-1/2 h-full overflow-y-auto p-4">
            <ItemGallery items={items} onItemSelect={handleItemSelect}/>
          </div>
        </div>
    </>
  );
}