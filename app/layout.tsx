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

function FooterLink({href, text}: Readonly<{href: string, text: string}>) {
  return <Link
    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    href={href}
  > {text} </Link>
}

function Footer() {
  return <footer
    className="flex gap-6 flex-wrap items-center justify-center"
    style={{position: "fixed", bottom: 0, left: 0, right: 0, padding: "1rem"}}
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
