'use client'

import { useState } from "react";
import { useIsBelowWidth } from "../common";
import Link from "next/link";

function HomeLink() {
  return <Link href="/routes" className="text-3xl font-bold hover:underline hover:underline-offset-4">turnagain.guide</Link>
}

function DesktopHeader() {
  return <header className="relative p-3">
    <div className="absolute left-4 top-1/2 -translate-y-1/2">
      <HorizontalNavs />
    </div>
    <div className="text-center">
      <HomeLink />
    </div>
  </header>
}

interface HamburgerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function Hamburger({ isOpen, setIsOpen }: HamburgerProps) {
  return (
    <button onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col justify-center items-center">
      <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm
                        ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} >
      </span>
      <span className={`bg-white block transition-all duration-300 ease-out 
                        h-0.5 w-6 rounded-sm my-0.5
                        ${isOpen ? 'opacity-0' : 'opacity-100'}`} >
      </span>
      <span className={`bg-white block transition-all duration-300 ease-out 
                        h-0.5 w-6 rounded-sm
                        ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} >
      </span>

    </button>

  )
}

function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header>
      <div className="flex items-left gap-4 p-4">
        <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-grow flex justify-center">
          <HomeLink />
        </div>
      </div>
      {isOpen && <VerticalNavs onNavClick={() => setIsOpen(false)} />}
    </header>
  );
}

export default function Header() {
  const isBelowWidth = useIsBelowWidth(768);
  return isBelowWidth ? <MobileHeader /> : <DesktopHeader />;
}

const NAV_ITEMS = [
  { href: '/about', text: 'About' },
  { href: '/resources', text: 'Resources' },
  { href: '/terrain-weather-snowpack', text: 'Terrain, Weather, Snowpack' },
  { href: '/routes', text: 'Routes' },
  { href: 'mailto:nicholas.b.crews+turnagain.guide@gmail.com', text: 'Suggest an edit' },
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
    <ul className="flex flex-col justify-between">
      {NAV_ITEMS.map(({ href, text }) => (
        <div key={href} className="border-b border-gray-500 p-2">
          <NavLink href={href} text={text} onNavClick={onNavClick} />
        </div>
      ))}
    </ul>
  </nav>
}

function NavLink({ href, text, onNavClick }: Readonly<{ href: string, text: string, onNavClick?: () => void }>) {
  return <li className="justify-center items-center">
    <Link
      className="hover:underline hover:underline-offset-4"
      href={href}
      onClick={onNavClick}
    > {text} </Link>
  </li>
}