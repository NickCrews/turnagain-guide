import Link from '@/components/ui/link'
import type { ValidRouteId } from '@/routes'

interface RouteLinkProps {
  routeID: ValidRouteId
  children: React.ReactNode
  className?: string
}

export default function RouteLink({ routeID: href, children, className }: RouteLinkProps) {
  return (
    <Link href={`/routes/${href}`} className={className}>
      {children}
    </Link>
  )
}
