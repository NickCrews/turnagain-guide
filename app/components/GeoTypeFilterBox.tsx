import { MultiCombo } from "@/components/ui/multi-combo"
import { FEATURE_TYPES, FeatureType } from "@/lib/geo-item"
import { capitalize } from "@/lib/utils"

const toComboItem = (name: FeatureType) => ({
  value: name,
  label: capitalize(name),
  bgColor: 'grey',
  textColor: 'black',
})

const ITEMS = Array.from(FEATURE_TYPES).map(toComboItem)

export function GeoTypeComboBox({selected, onSelected}: {selected: Set<FeatureType>, onSelected: (selected: Set<FeatureType>) => void}) {
  const description = <></>
  return <MultiCombo
    itemOptions={ITEMS}
    selectedItems={Array.from(selected).map(toComboItem)}
    onSelected={(items) => onSelected(new Set(items.map(i => i.value)))}
    descriptionCallback={() => description}
    labelCallback={() => <span>Type</span>}
  />
}