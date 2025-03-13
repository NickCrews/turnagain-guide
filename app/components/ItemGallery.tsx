import { GeoItem } from '../../lib/geo-item';
import RouteCard from './RouteCard';

interface ItemGalleryProps {
  items: GeoItem[];
  onItemSelect?: (item: GeoItem) => void;
  hoveredItem?: GeoItem;
  setHoveredItem?: (item: GeoItem | undefined) => void;
}

export default function ItemGallery({ items, onItemSelect, hoveredItem, setHoveredItem }: ItemGalleryProps) {
  items = items.filter((item) => item.properties.feature_type != 'area');
  if (!items || items.length === 0) {
    <div className="flex h-full pt-16 justify-center text-gray-500">
      <span>No matching items.</span>
    </div>
  }
  return (
    <div className="overflow-y-auto h-full flex flex-col gap-2 mx-2">
      {items.map((item, index) => (
        <RouteCard
          key={item.id || `item-${index}`}
          item={item}
          onClick={onItemSelect}
          hovered={hoveredItem?.id === item.id}
          setHovered={(hovered) => setHoveredItem?.(hovered ? item : undefined)}
        /> 
      ))}
    </div>
  );
}