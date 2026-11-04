// ─────────────────────────────────────────────────────────────────────────────
// All site copy lives here so it can be edited without touching layout code.
//
// Before publishing, confirm every description of how QS1 works (ENGINE, RISK,
// INFRA, FAQ) matches the real system. These are written to be accurate for an
// automated, rules-based futures engine, but only you know QS1's exact internals.
// ─────────────────────────────────────────────────────────────────────────────

export const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';

export const NAV = [
  { label: 'Approach', href: '#engine' },
  { label: 'Execution', href: '#execution' },
  { label: 'Risk management', href: '#risk' },
  { label: 'Engagement', href: '#access' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO = {
  label: 'QS1 · Systematic execution',
  title: 'Discipline, engineered.',
  lede:
    'QS1 is an autonomous execution system for COMEX gold futures. It analyzes market conditions, enforces pre-trade risk limits and executes every order by rule, removing the largest single source of error in active trading: human discretion.',
  primary: 'Request a consultation',
  secondary: 'Our approach',
  facts: [
    { k: 'Market', v: 'COMEX gold futures' },
    { k: 'Execution', v: 'Fully automated, rules-based' },
    { k: 'Risk controls', v: 'Four independent layers' },
    { k: 'Oversight', v: 'Monitored every session' },
    { k: 'Access', v: 'By consultation, limited capacity' },
  ],
};

export const NAV_CTA = 'Request a consultation';

export const PROBLEM = {
  eyebrow: 'The problem',
  titleA: 'Most trading losses are behavioral,',
  titleB: 'not analytical.',
  lede:
    'A sound strategy is rarely what fails. What fails is its execution: the entry taken late, the target moved out of greed, the stop widened after a loss. These are not gaps in knowledge. They are the predictable limits of human judgment under pressure.',
  flaws: [
    {
      k: '01 · Fatigue',
      big: '23',
      unit: 'hrs / day',
      title: 'The market never sleeps. You do.',
      body: "Gold futures trade nearly 23 hours a day, five days a week. The best setups don't wait for your schedule, your commute or your sleep.",
    },
    {
      k: '02 · Emotion',
      big: '1',
      unit: 'bad trade',
      title: 'One loss rewrites the next decision.',
      body: 'After a loss, the brain stops trading the plan and starts trading the feeling. Discipline fades exactly when it matters most.',
    },
    {
      k: '03 · Hesitation',
      big: '∞',
      unit: 'second-guesses',
      title: 'Hesitation is a position too.',
      body: "Every pause, every “let me wait for one more candle”, is a decision made by fear rather than by the plan.",
    },
  ],
  statementA: 'QS1 is built on a single premise:',
  statementB:
    'if the rules are sound, nothing should stand between them and the market.',
  statementC: 'Not fatigue, not emotion, not a difficult day.',
};

export type StageKey = 'ingest' | 'classify' | 'signal' | 'risk' | 'execute' | 'manage';

export const ENGINE = {
  eyebrow: 'Our approach',
  exhibit: 'Exhibit 1 · The QS1 execution process',
  titleA: 'A six-stage process,',
  titleB: 'applied to every order.',
  lede:
    'Every order QS1 places passes through the same sequence of stages, in the same order, without exception. Select a stage to see what it does.',
  stages: [
    {
      key: 'ingest' as StageKey,
      name: 'Ingest',
      sub: 'Market data',
      title: 'Reading the market as it moves.',
      body:
        'QS1 consumes a live feed of gold futures prices the moment they print. Every update is time-stamped, cleaned and aligned, so each later stage works from one consistent picture of the market.',
      points: [
        'Live price data streamed directly into the engine',
        'Bad or delayed prints filtered before they can influence a decision',
        'One synchronized view of the market shared by every stage',
      ],
      tags: ['Live feed', 'Time-stamped', 'Normalized'],
    },
    {
      key: 'classify' as StageKey,
      name: 'Classify',
      sub: 'Regime detection',
      title: 'Deciding whether to trade at all.',
      body:
        'Many losses come from trading the wrong conditions. Before looking for a setup, QS1 classifies the market as trending, ranging, volatile or thin, and stands aside when conditions fall outside what it was built for.',
      points: [
        'Volatility and market structure measured continuously',
        'Trading switched off when conditions are unfavorable',
        'Scheduled high-impact news windows avoided',
      ],
      tags: ['Volatility', 'Structure', 'News filter'],
    },
    {
      key: 'signal' as StageKey,
      name: 'Evaluate',
      sub: 'Setup qualification',
      title: 'Rules, not opinions.',
      body:
        "Inside an approved regime, QS1 checks each potential setup against fixed, predefined criteria. A trade is either fully qualified or it isn't. There's no “close enough” and no gut feel.",
      points: [
        'Entries defined in code, not decided in the moment',
        'Each setup scored against strict qualifying conditions',
        'The same inputs always produce the same decision',
      ],
      tags: ['Deterministic', 'Rules-based', 'No discretion'],
    },
    {
      key: 'risk' as StageKey,
      name: 'Verify',
      sub: 'Pre-trade risk',
      title: 'Every order must earn its way out.',
      body:
        "Before any order is sent, it's checked against position limits, the daily loss limit and the account's drawdown rules. If a single check fails, the order never leaves the engine.",
      points: [
        'Position size calculated from risk, not conviction',
        'Daily loss and drawdown limits enforced automatically',
        'A hard block, not a warning: failed checks cancel the order',
      ],
      tags: ['Position limits', 'Daily loss limit', 'Drawdown rules'],
    },
    {
      key: 'execute' as StageKey,
      name: 'Execute',
      sub: 'Order routing',
      title: 'Entry, stop and target, together.',
      body:
        "Approved orders are routed straight to the execution platform's API as bracket orders. The protective stop and profit target are attached the instant the position opens, so a trade is never left unprotected.",
      points: [
        'Direct API connection to the execution platform',
        'Stop-loss and target attached on entry',
        'Fills confirmed and reconciled automatically',
      ],
      tags: ['API routing', 'Bracket orders', 'Fill reconciliation'],
    },
    {
      key: 'manage' as StageKey,
      name: 'Manage',
      sub: 'Position management',
      title: 'Managing the trade to the end.',
      body:
        'Once in a position, QS1 manages it by rule: tightening protection as price moves, exiting on time-based conditions and flattening before the session closes. Every event is logged for review.',
      points: [
        'Stops tightened by rule as the trade develops',
        'Time-based exits and end-of-session flattening',
        'Every order, fill and adjustment recorded',
      ],
      tags: ['Trailing logic', 'Session flatten', 'Full audit log'],
    },
  ],
};

export const ANATOMY = {
  eyebrow: 'Execution',
  exhibit: 'Exhibit 2 · Anatomy of a single trade',
  titleA: 'Nine decisions.',
  titleB: 'None of them discretionary.',
  lede:
    'An illustrative walk-through of one long position, from the first data point to the final record. Each step is taken by rule, in sequence, in less time than it takes to read this sentence.',
  steps: [
    { t: '09:41:06.218', tag: 'DATA',   text: 'Price update received · feed healthy' },
    { t: '09:41:06.219', tag: 'REGIME', text: 'Trending · volatility in range · tradeable' },
    { t: '09:41:06.221', tag: 'SIGNAL', text: 'Long setup qualified · all entry conditions met' },
    { t: '09:41:06.222', tag: 'RISK',   text: '5 / 5 checks passed · size set from risk budget' },
    { t: '09:41:06.224', tag: 'ORDER',  text: 'Bracket sent · buy · stop and target attached' },
    { t: '09:41:06.301', tag: 'FILL',   text: 'Entry filled · position open and protected' },
    { t: '09:52:40.007', tag: 'MANAGE', text: 'Price advanced · stop moved to entry' },
    { t: '10:04:13.552', tag: 'EXIT',   text: 'Target reached · position closed' },
    { t: '10:04:13.560', tag: 'LOG',    text: 'Trade recorded · engine returns to scanning' },
  ],
  footnote:
    'Illustrative sequence for explanation only. It shows the order of operations inside QS1. It is not a record of a specific trade, and it does not represent past or future results.',
};

export const RISK = {
  eyebrow: 'Risk management',
  exhibit: 'Exhibit 3 · Risk architecture',
  titleA: 'Four independent layers',
  titleB: 'of risk control.',
  lede:
    'Risk control in QS1 is structural rather than optional. Four independent layers surround every order, and each one can halt trading on its own.',
  layers: [
    {
      k: 'L1',
      name: 'Trade',
      title: 'Every position has a hard stop',
      body: 'No order is placed without a protective stop attached. The maximum loss is defined before entry, not after.',
    },
    {
      k: 'L2',
      name: 'Session',
      title: 'Daily limits end the day early',
      body: 'A daily loss limit and a cap on trades stop the engine for the session once reached. A bad day stays a bad day, not a bad month.',
    },
    {
      k: 'L3',
      name: 'Account',
      title: 'Drawdown rules respected by design',
      body: "Sizing and limits are configured around the account's drawdown rules, keeping a buffer between the account and its limits.",
    },
    {
      k: 'L4',
      name: 'System',
      title: 'A kill switch above everything',
      body: 'Connectivity watchdogs, news blackouts and manual override let the engine stand down instantly if anything looks wrong.',
    },
  ],
};

export const COMPARE = {
  eyebrow: 'Comparison',
  titleA: 'Discretionary and',
  titleB: 'systematic execution.',
  you: 'Discretionary',
  qs: 'QS1',
  rows: [
    { k: 'Reaction', you: 'After you notice, think and click', qs: 'The moment conditions are met' },
    { k: 'Hours covered', you: "When you're awake and at the screen", qs: "Every session it's configured to trade" },
    { k: 'After a loss', you: 'Fear, frustration, the urge to win it back', qs: 'Next trade judged exactly like the last' },
    { k: 'Rule adherence', you: 'Most of the time', qs: 'Every time, enforced in code' },
    { k: 'Stop-losses', you: 'Sometimes moved, sometimes skipped', qs: 'Attached on entry, never removed' },
    { k: 'Record keeping', you: 'If you remember to journal', qs: 'Every event logged automatically' },
  ],
};

export const INFRA = {
  eyebrow: 'Infrastructure',
  titleA: 'Automated,',
  titleB: 'never unattended.',
  lede:
    'A system is only as good as what keeps it running. QS1 runs on always-on infrastructure and is watched by people who know exactly what normal looks like.',
  cards: [
    {
      icon: 'cloud',
      title: 'Always-on hosting',
      body: 'QS1 runs on dedicated servers, not a home computer. No home internet, power cuts or sleeping laptops in the chain.',
    },
    {
      icon: 'pulse',
      title: 'Continuous monitoring',
      body: 'Connectivity, fills and account state are checked continuously, with alerts the moment anything deviates from normal.',
    },
    {
      icon: 'lock',
      title: 'Execution-only access',
      body: "QS1 connects with trading credentials only. It can place and manage orders. It can't withdraw funds or change account details.",
    },
    {
      icon: 'eye',
      title: 'Human oversight',
      body: 'Our team reviews system behavior every session and can pause the engine instantly if conditions demand it.',
    },
  ],
};

export const PROCESS = {
  eyebrow: 'Engagement',
  titleA: 'From consultation',
  titleB: 'to live execution.',
  steps: [
    {
      k: '01',
      title: 'Private consultation',
      body: 'A 45-minute conversation about your goals and experience, and whether QS1 is the right fit. No obligation.',
    },
    {
      k: '02',
      title: 'Account setup',
      body: "We guide you through opening a funded futures account that meets QS1's requirements, step by step.",
    },
    {
      k: '03',
      title: 'Secure connection',
      body: 'You share execution-only credentials through an encrypted intake. Your account is configured and connected.',
    },
    {
      k: '04',
      title: 'QS1 goes live',
      body: 'The engine begins trading your account by rule, with our team monitoring every session.',
    },
  ],
};

export const ACCESS = {
  eyebrow: 'Capacity',
  title: 'Capacity is deliberately limited.',
  body:
    'Every account is configured and monitored individually. To preserve that standard, we onboard a limited number of new accounts each month. The consultation is where both sides determine whether QS1 is appropriate.',
  criteriaTitle: 'QS1 is suited to individuals who',
  criteria: [
    'Want market exposure without living at the screen',
    'Understand that every trading system has losing days',
    'Value process and discipline over quick wins',
    'Are ready to let rules, not emotions, make the decisions',
  ],
  guaranteeStrong: '45-day money-back guarantee.',
  guarantee: "If QS1 isn't right for you within 45 days of enrolling, your enrollment fee is refunded in full.",
  cta: 'Apply for a consultation',
};

export const FAQ = [
  {
    q: 'Do I need trading experience?',
    a: "No. QS1 makes every trading decision and places every order. It helps to understand the basics of how a futures account works, and we walk you through that on the call.",
  },
  {
    q: 'Will I need to watch the screen?',
    a: "No. QS1 runs without input from you. You can view your account whenever you like, but nothing depends on you being there.",
  },
  {
    q: 'What does QS1 trade?',
    a: "Gold futures on CME's COMEX exchange. Focusing on a single market lets the engine be built and tuned around how that market actually behaves.",
  },
  {
    q: 'Does QS1 have losing trades?',
    a: "Yes. Every trading system does, and anyone who says otherwise isn't being straight with you. QS1 is designed to keep losses small and defined, with a stop on every trade and hard daily limits, so no single day can do serious damage.",
  },
  {
    q: 'Can QS1 access my money?',
    a: "No. QS1 connects with execution-only trading credentials. It can place and manage orders, but it can't withdraw funds or change your account details.",
  },
  {
    q: 'How do I get started?',
    a: "Request a consultation. It takes 45 minutes, there's no obligation, and you'll leave knowing whether QS1 is right for you.",
  },
];

export const FINAL = {
  titleA: 'The market reopens tomorrow.',
  titleB: 'The only question is how you meet it.',
  body:
    'Continue to rely on judgment under pressure, or place a disciplined system between your strategy and the market. It begins with a private, 45-minute consultation.',
  cta: 'Request your consultation',
  fine: ['45-day money-back guarantee', 'No obligation', 'Limited onboarding each month'],
};

export const DISCLOSURE =
  'Trading futures involves substantial risk of loss and is not suitable for every investor. You could lose some or all of the capital in your account. Past performance, whether actual or indicated by historical tests, is not indicative of future results. Descriptions and illustrations of how QS1 operates are provided for explanation only and do not represent actual trades or a guarantee of performance. Quantara Systems does not guarantee profits or freedom from loss. Nothing on this site is financial advice or a solicitation to buy or sell any financial instrument.';
