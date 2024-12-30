'use client'

import { useState } from "react";
import { Item } from "../types";
import Map from "./Map";
import ItemGallery from "./ItemGallery";


export default function ItemExplorer({items}: {items: Item[]}) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <>  
        <link rel="stylesheet" href="Cesium/Widgets/widgets.css" />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/2 h-full">
            <Map items={items}/>
          </div>
          <div className="w-full md:w-1/2 h-full overflow-y-auto p-4">
            <ItemGallery items={items} onItemSelect={setSelectedItem}/>
          </div>
        </div>
    </>
  );
}