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
        <div className="flex flex-row overflow-hidden">
          <div className="w-2/3 ">
            <Map items={items} onItemClick={handleItemSelect}/>
          </div>
          <div className="w-1/3">
            <ItemGallery items={items} onItemSelect={handleItemSelect}/>
          </div>
        </div>
    </>
  );
}