#!/usr/bin/env node
/**
 * One-time setup script: creates the Quantara Systems CRM in ClickUp.
 *
 * Run once locally:
 *   CLICKUP_API_TOKEN=pk_xxx node scripts/setup-clickup-crm.mjs
 *
 * Outputs a .env.local snippet with all the IDs you need — paste into
 * your .env.local (local dev) and Vercel Environment Variables (production).
 */

const API = 'https://api.clickup.com/api/v2';
const TOKEN = process.env.CLICKUP_API_TOKEN;

if (!TOKEN) {
  console.error('ERROR: Set CLICKUP_API_TOKEN before running this script.');
  process.exit(1);
}

const headers = {
  Authorization: TOKEN,
  'Content-Type': 'application/json',
};

async function req(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// ── 1. Get workspace ────────────────────────────────────────────────────────
console.log('Fetching workspace…');
const { teams } = await req('GET', '/team');
const workspace = teams[0];
console.log(`  Workspace: ${workspace.name} (${workspace.id})`);

// ── 2. Create Space ──────────────────────────────────────────────────────────
console.log('Creating "Quantara CRM" space…');
const { id: spaceId } = await req('POST', `/team/${workspace.id}/space`, {
  name: 'Quantara CRM',
  multiple_assignees: false,
  features: {
    due_dates: { enabled: true, start_date: false, remap_due_dates: false, remap_closed_due_date: false },
    time_tracking: { enabled: false },
    tags: { enabled: true },
    time_estimates: { enabled: false },
    checklists: { enabled: false },
    custom_fields: { enabled: true },
    remap_dependencies: { enabled: false },
    dependency_warning: { enabled: false },
    portfolios: { enabled: false },
  },
});
console.log(`  Space ID: ${spaceId}`);

// ── 3. Create List (no folder) ───────────────────────────────────────────────
console.log('Creating "Discovery Call Leads" list…');
const { id: listId } = await req('POST', `/space/${spaceId}/list`, {
  name: 'Discovery Call Leads',
  content: 'Auto-populated from Calendly bookings via webhook.',
  status: 'active',
});
console.log(`  List ID: ${listId}`);

// ── 4. Create Custom Fields ──────────────────────────────────────────────────
const textField = (name) => ({ name, type: 'text', required: false });

const fields = [
  { name: 'Email',             type: 'email',   required: false },
  { name: 'Phone Number',      type: 'phone',   required: false },
  { name: 'Scheduled Time',    type: 'text',    required: false },
  textField('Biggest Challenge'),
  textField('Impact on Results'),
  textField('How Long Struggling'),
  textField('Ideal Trading Performance'),
  textField('Importance (1-10)'),
  textField('Readiness (1-10)'),
];

console.log('Creating custom fields…');
const fieldIds = {};
for (const field of fields) {
  try {
    const created = await req('POST', `/list/${listId}/field`, field);
    fieldIds[field.name] = created.id;
    console.log(`  ✓ ${field.name}: ${created.id}`);
  } catch (e) {
    console.warn(`  ⚠ Could not create field "${field.name}": ${e.message}`);
  }
}

// ── 5. Print .env snippet ────────────────────────────────────────────────────
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Paste this into your .env.local AND Vercel Environment Variables:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const envLines = [
  `CLICKUP_API_TOKEN=${TOKEN}`,
  `CLICKUP_LIST_ID=${listId}`,
  `CLICKUP_FIELD_EMAIL=${fieldIds['Email'] ?? ''}`,
  `CLICKUP_FIELD_PHONE=${fieldIds['Phone Number'] ?? ''}`,
  `CLICKUP_FIELD_SCHEDULED_TIME=${fieldIds['Scheduled Time'] ?? ''}`,
  `CLICKUP_FIELD_CHALLENGE=${fieldIds['Biggest Challenge'] ?? ''}`,
  `CLICKUP_FIELD_IMPACT=${fieldIds['Impact on Results'] ?? ''}`,
  `CLICKUP_FIELD_DURATION=${fieldIds['How Long Struggling'] ?? ''}`,
  `CLICKUP_FIELD_IDEAL=${fieldIds['Ideal Trading Performance'] ?? ''}`,
  `CLICKUP_FIELD_IMPORTANCE=${fieldIds['Importance (1-10)'] ?? ''}`,
  `CLICKUP_FIELD_READINESS=${fieldIds['Readiness (1-10)'] ?? ''}`,
  `# Generate a strong random string and save it — you'll use it when`,
  `# registering the Calendly webhook in step 3 of the README.`,
  `CALENDLY_WEBHOOK_SECRET=`,
];

console.log(envLines.join('\n'));
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Done! Next step: deploy to Vercel, add these env vars, then run');
console.log('scripts/register-calendly-webhook.mjs to wire up the webhook.\n');
