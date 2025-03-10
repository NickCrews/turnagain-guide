
import { capitalize } from '@/lib/utils';
import { GeoItem } from '../../lib/geo-item';
import { ElevationRange, Elevation } from './Units';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AtesBadges } from './ATES';

interface RouteCardProps {
  item: GeoItem;
  onClick?: (item: GeoItem) => void;
}

export default function RouteCard({ item, onClick } : RouteCardProps) {
  return <Card
    onClick={() => onClick ? onClick(item) : null}
    className="cursor-pointer hover:bg-gray-100"
  >
    <CardHeader className='py-3'>
      <CardTitle>
        {item.properties.title}
        {' - '}
        <span className='text-muted-foreground'>{capitalize(item.properties.feature_type)}</span>
      </CardTitle>
      <CardDescription>
        <AtesBadges ratings={item.properties.nicks_ates_ratings} />
        {'   '}
        {item.properties.elevation_min && item.properties.elevation_max && 
          <ElevationRange min={item.properties.elevation_min} max={item.properties.elevation_max} type={item.properties.feature_type}/>
        }
        {item.properties.elevation && <Elevation meters={item.properties.elevation}/>}
      </CardDescription>
    </CardHeader>
  </Card>
}