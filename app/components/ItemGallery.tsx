import { GeoItem } from '../../lib/geo-item';
import RouteCard from './RouteCard';

interface ItemGalleryProps {
  items: GeoItem[];
  onItemSelect?: 'link' | ((item: GeoItem) => void);
}

export default function ItemGallery({ items, onItemSelect}: ItemGalleryProps) {
  items = items.filter((item) => item.properties.feature_type != 'area');
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-lg">
        <img src="/lost.webp" alt="No items found" className="w-64 h-64 mb-4 opacity-50" />
        <p>No matching items.</p>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }
  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="overflow-y-auto h-full flex flex-col gap-2 mx-2 pt-2 pb-2">
        {items.map((item, index) => (
          <RouteCard
            key={item.id || `item-${index}`}
            item={item}
            onClick={onItemSelect}
          /> 
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}