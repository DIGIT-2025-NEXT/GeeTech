import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Audiowide } from "next/font/google";
import "./globals.css";
import Provider from "./_components/Provider";
import MUIThemeProvider from "./_components/MUIThemeProvider";

import { AuthProvider } from "@/contexts/AuthContext";
import SupabaseProvider from "./_components/SupabaseProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const audiowide = Audiowide({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--audiowide",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kitaq Startup",
  description: "DIGITKITAQ, GeeTech発表プロダクト。Kitaq_Startupのアプリページです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} ${audiowide.variable} font-sans antialiased`}
      >
        <SupabaseProvider>
            <AuthProvider>
              <NotificationProvider>
                <MUIThemeProvider>
                  <Provider>{children}</Provider>
                </MUIThemeProvider>
              </NotificationProvider>
            </AuthProvider>
          </SupabaseProvider>
      </body>
    </html>
  );
}