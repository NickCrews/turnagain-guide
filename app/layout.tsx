import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewerProvider } from "./components/viewer-context";
import { ElevationUnitsProvider, DistanceUnitsProvider } from "@/app/components/units-context";
import { GeoItemsProvider } from "@/app/components/items-context";
import { loadGeoItems } from "@/lib/geo-item";
import { TouchProvider } from "@/components/ui/touch-context";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
      <body className="antialiased">
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
