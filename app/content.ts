// ─────────────────────────────────────────────────────────────────────────────
// All site copy lives here so it can be edited without touching layout code.
//
// Before publishing, confirm every description of how QS1 works (ENGINE, RISK,
// INFRA, FAQ) matches the real system. These are written to be accurate for an
// automated, rules-based futures engine, but only you know QS1's exact internals.
// ─────────────────────────────────────────────────────────────────────────────

export const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';

export const NAV = [
  { label: 'Engine', href: '#engine' },
  { label: 'Execution', href: '#execution' },
  { label: 'Risk', href: '#risk' },
  { label: 'Access', href: '#access' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO = {
  chip: 'QS1 · Autonomous execution · Gold futures',
  titleA: 'Engineered to trade',
  titleB: 'the way you know you should.',
  lede:
    'QS1 is an autonomous execution engine for gold futures. It reads the market, decides whether conditions are worth trading, checks every order against hard risk limits, and executes by rule, every session it runs. No hesitation. No second-guessing. No revenge trades.',
  primary: 'Book a strategy call',
  secondary: 'See how it works',
  trust: ['Fully automated execution', 'Hard risk limits on every order', 'Monitored by our team'],
};

export const CONSOLE_STAGES = [
  'Ingest market data',
  'Classify regime',
  'Evaluate setup',
  'Pre-trade risk checks',
  'Route bracket order',
  'Manage position',
];

export const PROBLEM = {
  eyebrow: 'The human bottleneck',
  titleA: "Most traders don't fail for lack of a strategy.",
  titleB: 'They fail between the signal and the click.',
  lede:
    "You've seen it happen. The setup appears, you hesitate, and it's gone. Or you take it, it works, and you push your target out of greed. Or one loss turns the next three trades into revenge. None of that is a knowledge problem. It's a human one.",
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
  statementA: 'QS1 was built on one idea:',
  statementB:
    'if the rules are right, nothing should be allowed to stand between them and the market.',
  statementC: 'Not fatigue. Not fear. Not you on a bad day.',
};

export type StageKey = 'ingest' | 'classify' | 'signal' | 'risk' | 'execute' | 'manage';

export const ENGINE = {
  eyebrow: 'The QS1 engine',
  titleA: 'Six stages.',
  titleB: 'Every order, every time.',
  lede:
    "Every trade QS1 takes passes through the same pipeline, in the same order, with no shortcuts. Select a stage to see what happens inside it.",
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
  eyebrow: 'Anatomy of a trade',
  titleA: 'What happens in the',
  titleB: "seconds you'd spend deciding.",
  lede:
    'An illustrative walk-through of a single long trade, from the first data point to the final log entry. Count how many decisions are made, and notice that none of them are left to emotion.',
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
  eyebrow: 'Risk architecture',
  titleA: 'Four layers of protection.',
  titleB: 'Built in, not bolted on.',
  lede:
    "Risk isn't a setting you remember to turn on. In QS1 it's structural: four independent layers, each able to stop trading on its own.",
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
  eyebrow: 'Discretion vs. system',
  titleA: 'Same market.',
  titleB: 'Different operator.',
  you: 'Trading it yourself',
  qs: 'Trading with QS1',
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
  titleA: 'Automated.',
  titleB: 'Never unattended.',
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
  eyebrow: 'Getting started',
  titleA: 'From first call to live',
  titleB: 'in four steps.',
  steps: [
    {
      k: '01',
      title: 'Strategy call',
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
  eyebrow: 'Limited onboarding',
  title: "We don't take every account.",
  body:
    "Each new account is configured and monitored individually, so we onboard a limited number each month. The strategy call is where we decide, together, whether QS1 is the right fit.",
  criteriaTitle: 'QS1 is built for people who:',
  criteria: [
    'Want market exposure without living at the screen',
    'Understand that every trading system has losing days',
    'Value process and discipline over quick wins',
    'Are ready to let rules, not emotions, make the decisions',
  ],
  guaranteeStrong: '45-day money-back guarantee.',
  guarantee: "If QS1 isn't right for you within 45 days of enrolling, your enrollment fee is refunded in full.",
  cta: 'Apply for a strategy call',
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
    a: "Book a strategy call. It takes 45 minutes, there's no obligation, and you'll leave knowing whether QS1 is right for you.",
  },
];

export const FINAL = {
  titleA: 'The market opens again tomorrow.',
  titleB: "Decide how you'll meet it.",
  body:
    'Keep trading on willpower, or put a system between your plan and the market. It starts with one 45-minute conversation.',
  cta: 'Book your strategy call',
  fine: ['45-day money-back guarantee', 'No obligation', 'Limited onboarding each month'],
};

export const DISCLOSURE =
  'Trading futures involves substantial risk of loss and is not suitable for every investor. You could lose some or all of the capital in your account. Past performance, whether actual or indicated by historical tests, is not indicative of future results. Descriptions and illustrations of how QS1 operates are provided for explanation only and do not represent actual trades or a guarantee of performance. Quantara Systems does not guarantee profits or freedom from loss. Nothing on this site is financial advice or a solicitation to buy or sell any financial instrument.';
