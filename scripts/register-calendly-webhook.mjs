#!/usr/bin/env node
/**
 * Registers a Calendly webhook subscription pointing to your deployed
 * Next.js endpoint.  Run once after deploying to Vercel.
 *
 * Required env vars:
 *   CALENDLY_PAT          — Calendly Personal Access Token
 *   WEBHOOK_URL           — e.g. https://your-app.vercel.app/api/calendly-webhook
 *   CALENDLY_WEBHOOK_SECRET — the same secret you set in Vercel env vars
 *
 * Example:
 *   CALENDLY_PAT=eyJ... \
 *   WEBHOOK_URL=https://quantara.vercel.app/api/calendly-webhook \
 *   CALENDLY_WEBHOOK_SECRET=mysecret \
 *   node scripts/register-calendly-webhook.mjs
 */

const PAT     = process.env.CALENDLY_PAT;
const URL_    = process.env.WEBHOOK_URL;
const SECRET  = process.env.CALENDLY_WEBHOOK_SECRET;

if (!PAT || !URL_ || !SECRET) {
  console.error('ERROR: Set CALENDLY_PAT, WEBHOOK_URL, and CALENDLY_WEBHOOK_SECRET.');
  process.exit(1);
}

// Get current user to resolve organization URI
const meRes = await fetch('https://api.calendly.com/users/me', {
  headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
});
const me = await meRes.json();
const orgUri = me.resource.current_organization;
console.log(`Organization: ${orgUri}`);

// Register webhook
const body = {
  url: URL_,
  events: ['invitee.created'],
  organization: orgUri,
  scope: 'organization',
  signing_key: SECRET,
};

const res = await fetch('https://api.calendly.com/webhook_subscriptions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const json = await res.json();
if (!res.ok) {
  console.error('Failed:', JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`\n✓ Webhook registered!`);
console.log(`  URI:    ${json.resource.uri}`);
console.log(`  URL:    ${json.resource.callback_url}`);
console.log(`  Events: ${json.resource.events.join(', ')}`);
console.log('\nEvery new Calendly booking will now create a lead in ClickUp.\n');
