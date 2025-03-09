
import { Item } from '../routes/routes';
import { ElevationRange, Elevation } from './Units';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RouteCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

export default function RouteCard({ item, onClick } : RouteCardProps) {
  return <Card
    onClick={() => onClick ? onClick(item) : null}
    className="cursor-pointer hover:bg-gray-100"
  >
    <CardHeader>
      <CardTitle>{item.properties.title}</CardTitle>
      <CardDescription>
        {capitalize(item.properties.feature_type)} {' - '}
      {item.properties.elevation_min && item.properties.elevation_max && 
        <ElevationRange min={item.properties.elevation_min} max={item.properties.elevation_max} type={item.properties.feature_type}/>
      }
      {item.properties.elevation && <Elevation meters={item.properties.elevation}/>}
      </CardDescription>
    </CardHeader>
  </Card>
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}