import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ThemeProviderClient from "@/components/ThemeProviderClient";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mutual Fund Explorer - Advanced Investment Analytics",
  description: "Discover, analyze, and compare 5,000+ mutual fund schemes with advanced analytics, SIP calculators, and comprehensive performance metrics.",
  keywords: "mutual funds, investment, SIP calculator, fund comparison, analytics, portfolio management",
  authors: [{ name: "Mutual Fund Explorer" }],
  robots: "index, follow",
  openGraph: {
    title: "Mutual Fund Explorer - Advanced Investment Analytics",
    description: "Discover, analyze, and compare 5,000+ mutual fund schemes with advanced analytics and calculators.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#6C47FF" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderClient>
          <NavBar />
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
