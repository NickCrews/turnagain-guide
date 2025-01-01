import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "turnagain.guide",
    template: "%s | turnagain.guide",
  },
  description: "A backcountry skiing guide for Turnagain Pass, Alaska.",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

function Header() {
  return <header className="flex items-left gap-4 p-4">
    <Link href="/" className="text-3xl font-bold hover:underline hover:underline-offset-4">turnagain.guide</Link>
  </header>
}

function FooterLink({href, text}: Readonly<{href: string, text: string}>) {
  return <Link
    className="hover:underline hover:underline-offset-4"
    href={href}
  > {text} </Link>
}

function Footer() {
  return <footer
    className="flex gap-6 flex-wrap items-center justify-center "
  >
    <FooterLink href="/about" text="About" />
    <FooterLink href="/license" text="License" />
    <FooterLink href="mailto:nicholas.b.crews+turnagain.guide@gmail.com" text="Suggest an edit" />
  </footer>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-dvh`}
      >
        <div className="flex-none"><Header /></div>
        <main className="flex-auto">{children}</main>
        <div className="flex-none"><Footer /></div>
      </body>
    </html>
  );
}
