import { Badge } from "@/components/ui/badge"
import { useGeoItems } from "@/app/components/items-context";
import { hashStringToColor } from "@/lib/colors";
import { MultiCombo } from "@/components/ui/multi-combo"
import Link from "next/link";
import { GeoItem } from "@/lib/geo-item";
import { ValidRouteId } from "@/routes";

function getAreaInfo(areaId: string, items: GeoItem[]): GeoItem {
  const result = items.find((item) => item.id == areaId);
  if (!result) {
    throw Error(`unknown areaId: ${areaId}`)
  }
  return result;
}

export function areaColor(areaId: string) {
  return hashStringToColor(areaId, 25, 75);
}


export function AreaBadge({ areaId }: { areaId: string }) {
  const info = getAreaInfo(areaId, useGeoItems());
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

type ComboItem = {
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
};

function useComboItems(): [(areaId: string) => ComboItem, ComboItem[]] {
  const items = useGeoItems().filter((item) => item.properties.feature_type == 'area').sort((a, b) =>
    sortByArea(a.id as ValidRouteId, b.id as ValidRouteId)
  );
  const toComboItem = (areaId: string): ComboItem => {
    const item = getAreaInfo(areaId, items);
    return {
      value: areaId,
      label: item.properties.title.replace(/ Area$/i, ''),
      bgColor: areaColor(item.id),
      textColor: 'black',
    }
  }
  const comboItems = items.map((item) => toComboItem(item.id));
  return [toComboItem, comboItems];
}


export function AreaComboBox({ selected, onSelected }: { selected: Set<string>, onSelected: (selected: Set<string>) => void }) {
  const [toComboItem, comboItems] = useComboItems();
  return <MultiCombo
    itemOptions={comboItems}
    selectedItems={Array.from(selected).map(toComboItem)}
    onSelected={(items) => onSelected(new Set(items.map(i => i.value)))}
    labelCallback={() => <span>Area</span>}
  />
}

const AREA_ORDER: ValidRouteId[] = [
  'wolverine-area',
  'sharkfin-area',
  'eddies-area',
  'tincan-area',
  'sunburst-area',
  'magnum-area',
  'cornbiscuit-area',
  'pastoral-area',
  'goldpan-area',
  'lipps-area',
  'petes-north-area',
  'petes-south-area',
]

function sortByArea(id1: ValidRouteId, id2: ValidRouteId) {
  const index1 = AREA_ORDER.indexOf(id1);
  const index2 = AREA_ORDER.indexOf(id2);
  if (index1 === -1 && index2 === -1) {
    return id1.localeCompare(id2);
  }
  if (index1 === -1) {
    return 1;
  }
  if (index2 === -1) {
    return -1;
  }
  return index1 - index2;
}
