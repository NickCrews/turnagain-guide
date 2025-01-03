"use server";

import { Item } from '../../routes';

interface RouteDetailProps {
    item: Item;
  }

function Property({ name, value }: { name: string, value: string }) {
  return <div className="flex gap-2">
    <span className="text-sm font-bold">{name}:</span>
    <span className="text-sm">{value}</span>
  </div>
}

export default async function RouteDetail({ item }: RouteDetailProps) {
  const { default: MDXProvider } = await import(`@/app/routes/pages/${item.id}.mdx`)
  return (
    <>
      <div className="rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{item.properties.title}</h2>
        <div className="flex flex-col gap-2">
          <Property name="Feature Type" value={item.properties.feature_type} />
        </div>
        <MDXProvider />
      </div>
    </>
  );
}