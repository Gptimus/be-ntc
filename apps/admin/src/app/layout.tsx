import { getToken } from "@/lib/auth-server";
import type { Metadata } from "next";

import { Geist, Geist_Mono, Outfit } from "next/font/google";

import Providers from "@/components/providers";
import "@be-ntc/ui/globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "be-ntc",
  description: "be-ntc",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialToken={token}>{children}</Providers>
      </body>
    </html>
  );
}
