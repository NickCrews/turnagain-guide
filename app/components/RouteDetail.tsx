import dynamic from 'next/dynamic'
import { GeoItem } from '@/lib/geo-item';
import { RawValue, Distance, Elevation, ElevationRange } from '@/app/components/Units';
import { AtesBadges } from './ATES';
import { AreaBadge } from './Area';
import { useGeoItems } from '@/components/ui/itemsContext';
import ItemGallery from './ItemGallery';
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
  // for this to work on the client, we need to use dynamic import
  const RouteProse = dynamic(() => import(`@/app/routes/pages/${item.id}.mdx`), {
    ssr: false,
  })

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

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{item.properties.title}</h2>
      <div className="flex flex-col gap-2 mb-4">
        {properties.map(({ name, component }) => (
          <Property key={name} name={name}>
            {component}
          </Property>
        ))}
      </div>
      <RouteProse />
      {subRoutes(item.properties.children)}
    </>
  );
}

function subRoutes(childrenIds: string[]) {
  const items = useGeoItems();
  if (childrenIds.length === 0) return null;
  const children = items.filter((item) => childrenIds.includes(item.id));
  return <>
    <h3 className="text-xl font-bold mb-4">Sub Routes</h3>
    <ItemGallery items={children} />;
  </>
}