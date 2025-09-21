import { Badge } from "@/components/ui/badge"
import { useGeoItems } from "@/components/ui/itemsContext";
import { hashStringToColor } from "@/lib/colors";
import { MultiCombo } from "@/components/ui/multi-combo"
import Link from "next/link";
import { GeoItem } from "@/lib/geo-item";

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


export function AreaBadge({areaId}: {areaId: string}) {
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
  const items = useGeoItems().filter((item) => item.properties.feature_type == 'area');
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


export function AreaComboBox({selected, onSelected}: {selected: Set<string>, onSelected: (selected: Set<string>) => void}) {
  const [toComboItem, comboItems] = useComboItems();
  return <MultiCombo
    itemOptions={comboItems}
    selectedItems={Array.from(selected).map(toComboItem)}
    onSelected={(items) => onSelected(new Set(items.map(i => i.value)))}
    labelCallback={() => <span>Area</span>}
  />
}