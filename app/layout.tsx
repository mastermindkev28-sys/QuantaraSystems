import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Inter_Tight } from "next/font/google";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import RevealObserver from "./components/RevealObserver";
import "./globals.css";

// Inter Tight for headlines, Inter for reading text.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// IBM Plex Mono for prices, timestamps, logs and other system data.
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-data", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], weight: ["200", "300", "400", "500"], variable: "--font-display", display: "swap" });

const DESCRIPTION =
  "QS1 is proprietary execution software for COMEX gold futures. It evaluates market conditions through a defined confluence framework, qualifies each entry and executes and manages every trade by rule.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quantarasystems.io"),
  title: { default: "Quantara Systems — Systematic execution technology for futures markets", template: "%s — Quantara Systems" },
  description: DESCRIPTION,
  openGraph: {
    title: "Quantara Systems",
    description: DESCRIPTION,
    url: "https://www.quantarasystems.io",
    siteName: "Quantara Systems",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Quantara Systems", description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#08111f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scheme="dark" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <RevealObserver />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
