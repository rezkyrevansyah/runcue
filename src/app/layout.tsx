import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RunCue - Latihan Interval Tanpa Menatap Jam",
  description: "Web app latihan interval lari & jalan dengan instruksi suara otomatis Bahasa Indonesia. Bekerja tanpa akun.",
  icons: {
    icon: "/logo/logo_runcue_blackbg_onlylogonowording.png",
    shortcut: "/logo/logo_runcue_blackbg_onlylogonowording.png",
    apple: "/logo/logo_runcue_blackbg_onlylogonowording.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RunCue",
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
    <html lang="id" className={`h-full antialiased ${plusJakarta.className} ${plusJakarta.variable}`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0B] text-[#F5F5F7] selection:bg-[#D6FE3E] selection:text-[#111108]">
        {children}
      </body>
    </html>
  );
}

