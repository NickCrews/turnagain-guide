
import { Item } from '../routes/routes';
import { ElevationRange, Elevation } from './Units';

interface RouteCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

export default function RouteCard({ item, onClick } : RouteCardProps) {
  return <div
    className="bg-white p-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick ? onClick(item) : null}
  >
    <h3 className="text-lg font-semibold text-gray-800">{item.properties.title}</h3>
    <h3 className="text-sm text-gray-600">
      {capitalize(item.properties.feature_type)}
      {item.properties.elevation_min && item.properties.elevation_max && 
        <> -  <ElevationRange min={item.properties.elevation_min} max={item.properties.elevation_max}/></>
      }
      {item.properties.elevation && <> -  <Elevation meters={item.properties.elevation}/> </>}
    </h3>
  </div>
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}