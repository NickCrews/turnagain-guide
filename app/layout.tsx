import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewerProvider } from "./components/ViewerContext";
import { ElevationUnitsProvider, DistanceUnitsProvider } from "@/app/components/UnitsContext";
import { GeoItemsProvider } from "@/app/components/itemsContext";
import { loadGeoItems } from "@/lib/geo-item";
import { TouchProvider } from "@/components/ui/touch-context";

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
        <ViewerProvider>
          <GeoItemsProvider items={items}>
            <ElevationUnitsProvider>
              <DistanceUnitsProvider>
                <TouchProvider>
                  {children}
                </TouchProvider>
              </DistanceUnitsProvider>
            </ElevationUnitsProvider>
          </GeoItemsProvider>
        </ViewerProvider>
      </body>
    </html>
  );
}
