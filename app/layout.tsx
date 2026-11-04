import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { THEME, THEMES } from "./content";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// High-contrast serif for headlines: the editorial voice of the brand.
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
    <html lang="en" data-theme={THEME} className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Preview another theme with ?theme=<name>. Runs before paint, so there's no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=new URLSearchParams(location.search).get("theme");if(${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
