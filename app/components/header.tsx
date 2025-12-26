'use client'

import { useState } from "react";
import { useBreakpoint } from "@/lib/widths";
import Link from "next/link";

function HomeLink() {
  return <Link href="/routes" className="text-3xl font-bold hover:underline hover:underline-offset-4">turnagain.guide</Link>
}

interface HamburgerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  color: string;
}

function Hamburger({ isOpen, setIsOpen, color }: HamburgerProps) {
  return (
    <button onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col justify-center items-center">
      <span className={`${color} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm
                        ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} >
      </span>
      <span className={`${color} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5
                        ${isOpen ? 'opacity-0' : 'opacity-100'}`} >
      </span>
      <span className={`${color} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm
                        ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} >
      </span>

    </button>

  )
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAboveXl, isBelowXl } = useBreakpoint('xl');
  if (isAboveXl && isOpen) {
    setIsOpen(false);
  }

  return (
    <header className="relative h-12 border-b border-border border-opacity-50">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {
          // order is important here so that if isAboveXl is undefined (on first render)
          // the hamburger will be shown
          isAboveXl ? <HorizontalNavs /> : (
            <div className="relative">
              <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} color='bg-foreground' />
            </div>
          )
        }
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <HomeLink />
      </div>
      {isOpen && isBelowXl &&
        <div className="absolute top-full left-0 bg-background z-20 w-full border-y border-border border-opacity-50">
          <VerticalNavs onNavClick={() => setIsOpen(false)} />
        </div>
      }
    </header>

  );
}

const NAV_ITEMS = [
  { href: '/about', text: 'About' },
  { href: '/resources', text: 'Resources' },
  { href: '/terrain-weather-snowpack', text: 'Terrain, Weather, Snowpack' },
  { href: '/routes', text: 'Routes' },
]

function HorizontalNavs() {
  return <nav>
    <ul className="flex gap-6 flex-wrap items-center justify-center">
      {NAV_ITEMS.map(({ href, text }) => <NavLink key={href} href={href} text={text} />)}
    </ul>
  </nav>
}

function VerticalNavs({ onNavClick }: Readonly<{ onNavClick: () => void }>) {
  return <nav>
    <ul className="flex flex-col justify-between divide-y divide-border divide-opacity-50">
      {NAV_ITEMS.map(({ href, text }) => (
        <div key={href} className="p-2">
          <NavLink href={href} text={text} onNavClick={onNavClick} />
        </div>
      ))}
    </ul>
  </nav>
}

function NavLink({ href, text, onNavClick }: Readonly<{ href: string, text: string, onNavClick?: () => void }>) {
  return <li>
    <Link
      className="hover:underline hover:underline-offset-4"
      href={href}
      onClick={onNavClick}
    > {text} </Link>
  </li>
}