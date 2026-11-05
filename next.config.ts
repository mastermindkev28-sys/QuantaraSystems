import type { NextConfig } from "next";

// Browser security headers for every response.
//
// Content-Security-Policy allows only this site plus Calendly, which powers the
// scheduler on /consultation. Fonts are self-hosted by next/font and market data
// is fetched server-side, so no other origins are needed. 'unsafe-inline' for
// scripts is required by Next.js on statically generated pages; everything else
// is locked to an explicit allow-list.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://*.calendly.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.calendly.com",
  "frame-src https://calendly.com https://*.calendly.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
