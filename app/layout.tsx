import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

// One sober typeface family: Inter Tight for headlines, Inter for reading text and figures.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quantarasystems.io"),
  title: "Quantara Systems — Systematic execution for gold futures",
  description:
    "QS1 is an autonomous execution engine for gold futures. It reads the market, classifies conditions, checks risk and places every order by rule, every session.",
  openGraph: {
    title: "Quantara Systems",
    description: "Autonomous execution for gold futures. Engineered to remove the human bottleneck.",
    url: "https://www.quantarasystems.io",
    siteName: "Quantara Systems",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1E3A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
