import { Item } from '../routes/routes';
import RouteCard from './RouteCard';

interface ItemGalleryProps {
  items: Item[];
  onItemSelect?: (item: Item) => void; 
}

export default function ItemGallery({ items, onItemSelect }: ItemGalleryProps) {
  return (
    <div className="overflow-y-auto h-full flex flex-col gap-2 mx-2">
      {items.map((item, index) => (
        <RouteCard
          key={item.id || `item-${index}`}
          item={item}
          onClick={onItemSelect}
        /> 
      ))}
    </div>
  );
}