import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantara Systems",
  description:
    "Quantitative market systems. Structured approaches to market data for qualified participants seeking systematic exposure to modeled market dynamics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#050C1C" }}>
        {children}
      </body>
    </html>
  );
}
