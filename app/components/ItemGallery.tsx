import { Item } from '../routes/routes';

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
          className="bg-white p-2 mb-2 mx-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onItemSelect(item)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{item.properties.title}</h3>
          <h3 className="text-sm text-gray-600">{item.properties.feature_type}</h3>
        </div>
      ))}
    </div>
  );
}