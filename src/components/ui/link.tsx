import NextLink, {LinkProps as NextLinkProps} from "next/link";
import * as React from "react"

import { cn } from "@/lib/utils"

export type LinkProps = NextLinkProps & {
  className?: string;
  children?: React.ReactNode | undefined;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NextLink
        className={cn(
          "underline hover:underline-offset-2",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)
Link.displayName = "Link"

export default Link