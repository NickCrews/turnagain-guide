import { GeoItem } from '@/lib/geo-item';
import { RawValue, Distance, Elevation, ElevationRange } from '@/app/components/Units';
import { AtesBadges } from './ATES';
import { AreaBadge } from './Area';
import { useGeoItems } from '@/components/ui/itemsContext';
import Link from '@/components/ui/link';
import ItemGallery from './ItemGallery';
import { Point } from 'geojson';
interface RouteDetailProps {
    item: GeoItem;
  }

function Property({ name, children }: { name: string, children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="flex gap-2">
    <span className="text-sm font-bold">{name}:</span>
    {children}
  </div>
}

export default function RouteDetail({ item }: RouteDetailProps) {
  let properties = [
    { name: "Feature Type", component: <RawValue value={item.properties.feature_type} />},
  ];
  if (item.properties.area) {
    properties = [
      { name: "Area", component: <AreaBadge areaId={item.properties.area} />},
      ...properties,
    ]
  }
  if (item.properties.nicks_ates_ratings) {
    properties.push({ name: "Terrain", component: <AtesBadges ratings={item.properties.nicks_ates_ratings} hover={true} />});
  }
  if (item.properties.distance) {
    properties.push({ name: "Distance", component: <Distance meters={item.properties.distance} />});
  }
  if (item.properties.elevation) {
    properties.push({ name: "Elevation", component: <Elevation meters={item.properties.elevation} />});
  }
  if (item.properties.elevation_min && item.properties.elevation_max) {
    properties.push({ name: "Elevation Range", component: <ElevationRange min={item.properties.elevation_min} max={item.properties.elevation_max} />});
  }
  if (item.properties.feature_type === 'parking') {
    // add link to google maps
    const point = item.geometry as Point;
    const [longitude, latitude] = point.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    properties.push({ name: "Directions", component: <Link href={url}>View on Google Maps</Link> });
  }

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        {properties.map(({ name, component }) => (
          <Property key={name} name={name}>
            {component}
          </Property>
        ))}
      </div>
      {item.properties.thumbnail && (
        <figure className="mb-4">
          <img
            src={item.properties.thumbnail}
            alt={item.properties.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
          {item.properties.description && (
            <figcaption className="text-sm text-gray-500 mt-2">
              {item.properties.description}
            </figcaption>
          )}
        </figure>
      )}
      <article className="prose prose-sm prose-slate">
        {item.mdxJsx}
      </article>
      <SubRoutes childrenIds={item.properties.children} />
    </>
  );
}

function SubRoutes({ childrenIds }: { childrenIds: string[] }) {
  const items = useGeoItems();
  if (childrenIds.length === 0) return null;
  const children = items.filter((item) => childrenIds.includes(item.id));
  return <>
    <h3 className="text-xl font-bold mb-4">Sub Routes</h3>
    <ItemGallery items={children} onItemSelect='link' />
  </>
}