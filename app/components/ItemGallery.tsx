import { Item } from '../types';

interface ItemGalleryProps {
  items: Item[];
  onItemSelect: (item: Item) => void; 
}

export default function ItemGallery({ items, onItemSelect }: ItemGalleryProps) {
  return (
    <div className="overflow-y-auto h-full">
      {items.map((item, index) => (
        <div
          key={item.id || `item-${index}`}
          className="bg-white p-4 mb-4 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onItemSelect(item)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{item.properties.title}</h3>
          <p className="text-sm text-gray-600">{item.properties.description}</p>
        </div>
      ))}
    </div>
  );
}