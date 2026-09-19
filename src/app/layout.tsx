import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "RunCue - Interval Running Without Looking at the Watch",
  description: "Mobile-first interval running & walking web app with automated voice cues. Works offline without accounts.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192x192.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RunCue",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakarta.className} ${plusJakarta.variable}`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0B] text-[#F5F5F7] selection:bg-[#D6FE3E] selection:text-[#111108]">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

