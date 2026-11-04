// Renders the /overview page to public/quantara-qs1-overview.pdf.
// Start the site first (npm run build && npm start), then: npm run overview:pdf
import { createRequire } from 'node:module';

// Uses Playwright from the project or a global install, whichever is available.
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.env.SITE_URL ?? 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/overview`, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: 'public/quantara-qs1-overview.pdf',
  format: 'Letter',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  preferCSSPageSize: true,
});
await browser.close();
console.log('Wrote public/quantara-qs1-overview.pdf');
