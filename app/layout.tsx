import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quantarasystems.io"),
  title: "Quantara Systems — Autonomous execution for gold futures",
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
  themeColor: "#04070E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
