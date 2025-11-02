
import { capitalize } from '@/lib/utils';
import { GeoItem } from '../../lib/geo-item';
import { ElevationRange, Elevation } from './Units';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AtesBadges } from './ATES';
import { cn } from '@/lib/utils';
import { AreaBadge } from './Area';
import { useRouter } from 'next/navigation';
import ImageCarousel from '@/components/ui/image-carousel';

interface RouteCardProps {
  item: GeoItem;
  onClick?: 'link' | ((item: GeoItem) => void);
  hovered?: boolean;
  setHovered?: (hovered: boolean) => void;
}

export default function RouteCard({ item, onClick, hovered, setHovered } : RouteCardProps) {
  const router = useRouter();
  if (onClick === 'link') {
    onClick = (item: GeoItem) => router.push(`/routes/${item.id}`);
  }
  let banner = null;
  if (item.properties.images.length > 1) {
    banner = ImageCarousel (
      item.properties.images
    )
  }
  else if (item.properties.thumbnail) {
      banner = <img
        src={item.properties.thumbnail}
        alt={item.properties.title}
        className="w-full h-48 rounded-t-xl object-cover"
      />
    }
  return <Card
    onClick={() => onClick ? onClick(item) : null}
    onMouseEnter={() => setHovered && setHovered(true)}
    onMouseLeave={() => setHovered && setHovered(false)}
    className={cn("cursor-pointer", hovered && "bg-gray-200 border border-gray-300 shadow-xl z-10")}
  >
    {banner}
    <CardHeader className='p-3'>
      <CardTitle>
        {item.properties.title}
        {' - '}
        <span className='text-muted-foreground'>{capitalize(item.properties.feature_type)}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className='p-3 pt-0'>
      <CardDescription>
        {item.properties.area && <AreaBadge areaId={item.properties.area} />}
        <AtesBadges ratings={item.properties.nicks_ates_ratings} hover={false} />
        {'   '}
        {item.properties.elevation_min && item.properties.elevation_max && 
          <ElevationRange min={item.properties.elevation_min} max={item.properties.elevation_max} type={item.properties.feature_type}/>
        }
        {item.properties.elevation && <Elevation meters={item.properties.elevation}/>}
      </CardDescription>
    </CardContent>
  </Card>
}