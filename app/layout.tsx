import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Header from "./components/Header";
import { MapContextProvider } from "./components/MapContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <MapContextProvider>
          <main>{children}</main>
        </MapContextProvider>
      </body>
    </html>
  );
}
