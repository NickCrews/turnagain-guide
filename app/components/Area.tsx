import { Badge } from "@/components/ui/badge"
import { useGeoItems } from "@/components/ui/itemsContext";
import { hashStringToColor } from "@/lib/colors";
import Link from "next/link";

function useAreaInfo(areaId: string) {
  const items = useGeoItems();
  const result = items.find((item) => item.id == areaId);
  if (!result) {
    throw Error(`unknown areaId: ${areaId}`)
  }
  return result;
}

export function areaColor(areaId: string) {
  return hashStringToColor(areaId, 25, 75);
}


export function AreaBadge({areaId}: {areaId: string}) {
  const info = useAreaInfo(areaId);
  const areaUrl = `/routes/${areaId}`;
  const color = areaColor(areaId);
  return <Link href={areaUrl}>
    <Badge
      variant='outline'
      textColor='black'
      bgColor={color}
      className="whitespace-nowrap"
    >
      {info.properties.title}
    </Badge>
  </Link>
}