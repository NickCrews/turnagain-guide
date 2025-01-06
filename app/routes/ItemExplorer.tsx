'use client'

import { Item } from "./routes";
import Map from "../components/Map";
import ItemGallery from "../components/ItemGallery";
import RouteDetail from "../components/RouteDetail";
import { useRouter } from "next/navigation";

interface ItemExplorerProps {
  items: Item[]
  selectedItem?: Item
}

export default function ItemExplorer({items, selectedItem}: ItemExplorerProps) {
  const router = useRouter();

  const handleItemSelect = (item?: Item) => {
    const url = item ? `/routes/${item.id}` : "/routes"
    router.push(url);
  };

  const handleBack = () => {
    router.push('/routes');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 h-full">
        <Map items={items} onItemClick={handleItemSelect} selectedItem={selectedItem}/>
      </div>
      <div className="flex-1 max-w-lg h-full">
        {
          selectedItem ? 
          <ItemDetail item={selectedItem} onBack={handleBack} /> : 
          <ItemGallery items={items} onItemSelect={handleItemSelect}/>
        } 
      </div>
    </div>
  );
}

function ItemDetail({item, onBack}: {item: Item, onBack: () => void}) {
  return <>
    <BackHeader text="Back to search" onBack={onBack} />
    <div className="overflow-y-auto h-full">
      <RouteDetail item={item} />
    </div>
  </>
}

function BackHeader({ text, onBack }: { text: string, onBack: () => void }) {
  return (
    <div className="p-6 bg-background">
      <nav className="flex justify-start">
        <button onClick={onBack} className="close-button flex items-center gap-1">
          <LeftArrowIcon />
            <span className="text-sm">{text}</span>
        </button>
      </nav>
    </div>
  )
}

function LeftArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}