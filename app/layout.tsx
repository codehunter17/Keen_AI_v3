import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

// Fraunces — modern editorial serif with a soft, premium-health feel.
// Inter — clean, highly legible body type. Together they read distinctly
// different from NutriMama's Playfair + Outfit pairing.
const fontHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriMama | Your Women's Health Companion",
  description:
    "AI-powered women's health from first period to motherhood — cycle tracking, PCOS awareness, pregnancy care, and personalized nutrition. Made for India.",
  applicationName: "NutriMama",
  appleWebApp: {
    capable: true,
    title: "NutriMama",
    statusBarStyle: "default",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/NutriLogo.svg",
    apple: "/NutriLogo.svg",
  },
};

// Next.js 15+ wants themeColor on `viewport`, not `metadata`.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#14201C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
        suppressHydrationWarning
      >
        <Providers>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
