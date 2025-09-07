import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Header from "./components/Header";
import { ViewerProvider } from "./components/ViewerContext";
import { GeoItemsProvider } from "@/components/ui/itemsContext";
import { loadGeoItems } from "@/lib/geo-item";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = await loadGeoItems();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <ViewerProvider>
          <GeoItemsProvider items={items}>
            <main>{children}</main>
          </GeoItemsProvider>
        </ViewerProvider>
      </body>
    </html>
  );
}