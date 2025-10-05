import "./globals.css";
import "leaflet/dist/leaflet.css";

import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";

import { ReactQueryClientProvider } from "@viasegura/contexts/react-query";
import { Toaster } from "@viasegura/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViaSegura",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
        <ReactQueryClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </ReactQueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
