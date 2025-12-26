import { Badge } from "@/components/ui/badge"
import { hashStringToColor } from "@/lib/colors";
import Link from "next/link";
import { GeoItem } from "@/lib/geo-item";

export function routeColor(routeId: string) {
  return hashStringToColor(routeId, 50, 65);
}

export function RouteBadge({ route }: { route: GeoItem }) {
  const routeUrl = `/routes/${route.id}`;
  const color = routeColor(route.id);
  return (
    <Link href={routeUrl}>
      <Badge
        variant='outline'
        textColor='black'
        bgColor={color}
        className="whitespace-nowrap"
      >
        {route.properties.title}
      </Badge>
    </Link>
  );
}

export function RouteBadges({ routes }: { routes: GeoItem[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {routes.map((route) => (
        <RouteBadge key={route.id} route={route} />
      ))}
    </div>
  );
}
