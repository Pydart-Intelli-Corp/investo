import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from '@/components';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investogold - Smart AI Arbitrage Trading System",
  description: "Next-generation AI Arbitrage Trading Platform enabling consistent passive income through automated trading bots. AI-driven profit automation with real-time market analysis.",
  icons: {
    icon: [
      { url: '/images/logo.webp', sizes: 'any' },
      { url: '/images/logo.webp', sizes: '16x16', type: 'image/webp' },
      { url: '/images/logo.webp', sizes: '32x32', type: 'image/webp' },
    ],
    shortcut: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/webp" href="/images/logo.webp" />
        <link rel="apple-touch-icon" href="/images/logo.webp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
