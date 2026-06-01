import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLICKUP_API = 'https://api.clickup.com/api/v2';

// Map Calendly question text → ClickUp custom field env var name
const QUESTION_FIELD_MAP: Record<string, string> = {
  'Phone Number': 'CLICKUP_FIELD_PHONE',
  'What is your biggest challenge in your trading right now?': 'CLICKUP_FIELD_CHALLENGE',
  'How has that challenge been impacting your trading results or account?': 'CLICKUP_FIELD_IMPACT',
  'How long have you been struggling with this in your trading?': 'CLICKUP_FIELD_DURATION',
  'What would ideal trading performance look like for you? What specific results are you aiming for?': 'CLICKUP_FIELD_IDEAL',
  'On a scale of 1–10, how important is it for you to improve your trading results in the next 30–60 days?': 'CLICKUP_FIELD_IMPORTANCE',
  'On a scale of 1–10, how ready are you to invest in your trading future?': 'CLICKUP_FIELD_READINESS',
};

interface QnA {
  question: string;
  answer: string;
  position: number;
}

interface ScheduledEvent {
  start_time: string;
  end_time: string;
  name: string;
}

interface CalendlyPayload {
  name: string;
  email: string;
  questions_and_answers: QnA[];
  scheduled_event: ScheduledEvent;
}

interface WebhookBody {
  event: string;
  payload: CalendlyPayload;
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const digest = hmac.digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function createClickUpTask(payload: CalendlyPayload) {
  const apiKey = process.env.CLICKUP_API_TOKEN!;
  const listId = process.env.CLICKUP_LIST_ID!;

  const qnaMap: Record<string, string> = {};
  for (const qa of payload.questions_and_answers) {
    qnaMap[qa.question] = qa.answer;
  }

  const phone = qnaMap['Phone Number'] ?? '';
  const scheduledTime = new Date(payload.scheduled_event.start_time).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Build readable description
  const description = [
    `**Name:** ${payload.name}`,
    `**Email:** ${payload.email}`,
    `**Phone:** ${phone}`,
    `**Scheduled:** ${scheduledTime} PT`,
    '',
    '---',
    '',
    ...payload.questions_and_answers
      .filter(qa => qa.question !== 'Phone Number')
      .sort((a, b) => a.position - b.position)
      .map(qa => `**${qa.question}**\n${qa.answer}`),
  ].join('\n\n');

  // Build custom_fields array from env-configured field IDs
  const customFields: { id: string; value: string }[] = [];

  const addField = (envKey: string, value: string) => {
    const fieldId = process.env[envKey];
    if (fieldId && value) customFields.push({ id: fieldId, value });
  };

  addField('CLICKUP_FIELD_EMAIL', payload.email);
  addField('CLICKUP_FIELD_PHONE', phone);
  addField('CLICKUP_FIELD_SCHEDULED_TIME', scheduledTime + ' PT');

  for (const [question, envKey] of Object.entries(QUESTION_FIELD_MAP)) {
    if (envKey !== 'CLICKUP_FIELD_PHONE' && qnaMap[question]) {
      addField(envKey, qnaMap[question]);
    }
  }

  const taskBody = {
    name: `${payload.name} — Discovery Call`,
    description,
    custom_fields: customFields,
  };

  const res = await fetch(`${CLICKUP_API}/list/${listId}/task`, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskBody),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ClickUp error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify Calendly signature if secret is configured
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get('calendly-webhook-signature') ?? '';
    // Calendly sends: t=<timestamp>,v1=<hmac>
    const v1Match = sig.match(/v1=([a-f0-9]+)/);
    const tMatch = sig.match(/t=(\d+)/);
    if (!v1Match || !tMatch) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }
    const toSign = `${tMatch[1]}.${rawBody}`;
    if (!verifySignature(toSign, v1Match[1], secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only handle new bookings
  if (body.event !== 'invitee.created') {
    return NextResponse.json({ skipped: true });
  }

  try {
    const task = await createClickUpTask(body.payload);
    console.log(`[CRM] Created ClickUp task ${task.id} for ${body.payload.name}`);
    return NextResponse.json({ ok: true, taskId: task.id });
  } catch (err) {
    console.error('[CRM] Failed to create ClickUp task:', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
