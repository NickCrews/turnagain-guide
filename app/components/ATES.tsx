import { Badge } from "@/components/ui/badge"
import { ATES, atesColor, atesTextColor, ATES_VALUES } from "@/lib/terrain-rating"
import { capitalize } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { MultiCombo } from "@/components/ui/multi-combo"
import Link from "@/components/ui/link"

export function AtesBadge({rating, hover}: {rating: ATES, hover?: boolean}) {
  const badge = <Badge bgColor={atesColor(rating)} textColor={atesTextColor(rating)} className="whitespace-nowrap">{capitalize(rating)}</Badge>
  if (!hover) {
    return badge
  }
  return <HoverCard openDelay={100}>
    <HoverCardTrigger> {/* not asChild, if we did that then the pointer isn't a hover */ }
      {badge}
    </HoverCardTrigger>
    <HoverCardContent>
      {AtesDescription()}
    </HoverCardContent>
  </HoverCard>
}

export function AtesBadges({ratings}: {ratings: ATES[]}) {
  return <>
    {ratings.map((rating) => <AtesBadge key={rating} rating={rating} />)}
  </>
}

export function AtesDescription() {
  return <>
    <p className="font-bold text-destructive">
      The ATES rating is provided as a courtesy by the author, who has no official
      capacity to rate terrain. Use at your own risk.
    </p>

    <Link href='https://www.cnfaic.org/resources/mapping/'>
      ATES
    </Link> (Avalanche Terrain Exposure Scale)
    classifies terrain into five categories based on slope angle,
    forest density, slope shape, terrain traps, avalanche frequency/magnitude,
    starting zone size and density, runout zone characteristics,
    interaction with avalanche paths, and route options for managing exposure.
  </>
}

const toComboItem = (name: ATES) => ({
  value: name,
  label: capitalize(name),
  bgColor: atesColor(name),
  textColor: atesTextColor(name),
})

const ATES_ITEMS = ATES_VALUES.map(toComboItem)

export function AtesComboBox({selected, onSelected}: {selected: Set<ATES>, onSelected: (selected: Set<ATES>) => void}) {
  const description = (
    <span className="mx-2">
      ATES {' - '}
      <HoverCard>
        <HoverCardTrigger className="text-sm text-gray-500 hover:text-gray-700 hover:cursor-pointer">
          ?
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          {AtesDescription()}
        </HoverCardContent>
      </HoverCard>
    </span>
  )
  return <MultiCombo
    itemOptions={ATES_ITEMS}
    selectedItems={Array.from(selected).map(toComboItem)}
    onSelected={(items) => onSelected(new Set(items.map(i => i.value)))}
    descriptionCallback={() => description}
    labelCallback={() => <span>Terrain</span>}
  />
}