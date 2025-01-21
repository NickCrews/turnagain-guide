
import { Item } from '../routes/routes';

interface RouteCardProps {
  item: Item;
  onClick: (item: Item) => void;
}

export default function RouteCard({ item, onClick } : RouteCardProps) {
  return <div
    className="bg-white p-2 mb-2 mx-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(item)}
  >
    <h3 className="text-lg font-semibold text-gray-800">{item.properties.title}</h3>
    <h3 className="text-sm text-gray-600">{item.properties.feature_type}</h3>
  </div>
}