import { Badge } from "@/components/ui/badge"
import { ATES, atesColor } from "@/lib/terrain-rating"
import { capitalize } from "@/lib/utils"

export function AtesBadge({rating}: {rating: ATES}) {
  return <Badge style={{backgroundColor: atesColor(rating)}}>
    {capitalize(rating)}
    </Badge>
}