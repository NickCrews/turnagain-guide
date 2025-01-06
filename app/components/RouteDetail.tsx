import dynamic from 'next/dynamic'
import { Item } from '@/app/routes/routes';
import { RawValue, Distance, Elevation } from '@/app/components/Units';
interface RouteDetailProps {
    item: Item;
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
  const MDXProvider = dynamic(() => import(`@/app/routes/pages/${item.id}.mdx`), {
    ssr: false,
  })
  
  const properties = [
    { name: "Feature Type", component: <RawValue value={item.properties.feature_type} />},
  ];
  if (item.properties.distance) {
    properties.push({ name: "Distance", component: <Distance meters={item.properties.distance} />});
  }
  if (item.properties.total_ascent) {
    properties.push({ name: "Total Ascent", component: <Elevation meters={item.properties.total_ascent} />});
  }
  if (item.properties.total_descent) {
    properties.push({ name: "Total Descent", component: <Elevation meters={item.properties.total_descent} />});
  }
  

  return (
    <>
      <div className="rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{item.properties.title}</h2>
        <div className="flex flex-col gap-2">
          {properties.map(({ name, component }) => (
            <Property key={name} name={name}>
              {component}
            </Property>
          ))}
        </div>
        <MDXProvider />
      </div>
    </>
  );
}