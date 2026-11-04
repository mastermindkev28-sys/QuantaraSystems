// ─────────────────────────────────────────────────────────────────────────────
// All site copy lives here so it can be edited without touching layout code.
//
// Before publishing, confirm every description of how QS1 works (ENGINE, RISK,
// INFRA, FAQ) matches the real system. These are written to be accurate for an
// automated, rules-based futures engine, but only you know QS1's exact internals.
// ─────────────────────────────────────────────────────────────────────────────

// Color scheme. 'light' always; 'auto' follows each visitor's device setting;
// 'dark' always. Any page can be previewed in another scheme with ?scheme=light
// (or dark, or auto).
export const COLOR_SCHEME: 'light' | 'auto' | 'dark' = 'dark';

export const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';

export const NAV = [
  { label: 'Approach', href: '/approach' },
  { label: 'Risk management', href: '/risk' },
  { label: 'Engagement', href: '/engagement' },
  { label: 'Insights', href: '/insights' },
];

export const FOOTER_NAV = [
  {
    title: 'Firm',
    links: [
      { label: 'Approach', href: '/approach' },
      { label: 'Risk management', href: '/risk' },
      { label: 'Engagement', href: '/engagement' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'QS1 overview (PDF)', href: '/quantara-qs1-overview.pdf' },
      { label: 'Frequently asked questions', href: '/engagement#faq' },
      { label: 'Request a consultation', href: '/consultation' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Risk disclosure', href: '/legal/risk-disclosure' },
      { label: 'Privacy policy', href: '/legal/privacy' },
      { label: 'Terms of use', href: '/legal/terms' },
    ],
  },
];

export const OVERVIEW_PDF = '/quantara-qs1-overview.pdf';

// Firms and platforms QS1 works with. Text wordmarks are shown until an official
// logo file is placed at public/logos/<slug>.svg (taken from each company's own
// brand or press kit, and used according to its brand guidelines).
export const PLATFORMS = {
  eyebrow: 'Compatibility',
  title: 'Works with the firms and platforms traders already use.',
  groups: [
    {
      label: 'Proprietary trading firms',
      items: [
        { slug: 'topstep', name: 'Topstep' },
        { slug: 'lucid', name: 'Lucid Trading' },
        { slug: 'tpt', name: 'Take Profit Trader' },
      ],
    },
    {
      label: 'Execution and analysis platforms',
      items: [
        { slug: 'tradovate', name: 'Tradovate' },
        { slug: 'ninjatrader', name: 'NinjaTrader' },
        { slug: 'tradingview', name: 'TradingView' },
      ],
    },
  ],
  note:
    'Names and logos are trademarks of their respective owners and are shown only to indicate compatibility. Quantara Systems is not affiliated with, endorsed by or sponsored by any of these companies.',
};

// Photography. Drop an image at the path below and it replaces the fallback
// automatically. Every photo is toned to the brand navy so the set stays consistent;
// tone 'mono' renders a photo fully in navy, for images whose own colors clash.
// Current photos are from Unsplash (free under the Unsplash License).
export const PHOTOS = {
  hero: { src: '/photos/hero.jpg', alt: 'Gold bullion bars on a dark surface' },
  approach: { src: '/photos/approach.jpg', alt: 'Trading workstation with market data on screen' },
  risk: { src: '/photos/risk.jpg', alt: 'Server cooling fans in a data center', tone: 'mono' as const },
  engagement: { src: '/photos/engagement.jpg', alt: 'Glass office tower seen from below' },
};

export const HERO = {
  label: 'QS1 · Automated gold futures execution',
  title: 'Discipline, engineered.',
  lede:
    'QS1 is an automated execution system for COMEX gold futures. It reads market conditions, sizes each position from a fixed risk budget, checks every order against hard limits and places the trade by rule. The same process runs every session, whether you are watching or not.',
  primary: 'Request a consultation',
  secondary: 'See how it works',
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
  titleA: 'Most traders lose money on execution.',
  titleB: 'The strategy is usually sound.',
  lede:
    'Late entries. Targets moved out of greed. Stops widened after a loss. Valid setups skipped after a losing streak. Each mistake is small on its own. Over hundreds of trades, they decide the result. QS1 is built to close that gap.',
  flaws: [
    {
      k: '01 · Coverage',
      big: '23',
      unit: 'hours a day',
      title: 'Gold trades almost around the clock.',
      body: 'COMEX gold futures trade nearly 23 hours a day, five days a week. A person can give full attention to a fraction of that. QS1 covers every session it is set to trade.',
    },
    {
      k: '02 · Emotion',
      big: '1',
      unit: 'losing trade',
      title: 'One loss changes the next decision.',
      body: 'After a loss, most traders either size up to win it back or freeze on the next valid setup. Both cost money. QS1 evaluates every trade the same way, whatever happened before it.',
    },
    {
      k: '03 · Process',
      big: '6',
      unit: 'stages per order',
      title: 'QS1 runs one process on every order.',
      body: 'Data, market conditions, setup, risk, execution and management, in that order, every time. The process is written in code, so it runs the same way on the first trade and the five-hundredth.',
    },
  ],
  statementA: 'QS1 is built on one rule:',
  statementB: 'once a process is defined, it runs exactly as written, on every order, in every session.',
  statementC: '',
};

export type StageKey = 'ingest' | 'classify' | 'signal' | 'risk' | 'execute' | 'manage';

export const ENGINE = {
  eyebrow: 'How it works',
  exhibit: 'Exhibit 1 · The QS1 execution process',
  titleA: 'Six stages.',
  titleB: 'Every order goes through all of them.',
  lede:
    'Each order QS1 places goes through the same six stages, in the same order. Select a stage to see what it does.',
  stages: [
    {
      key: 'ingest' as StageKey,
      name: 'Ingest',
      sub: 'Market data',
      title: 'Read the market as it moves.',
      body:
        'QS1 takes in a live feed of gold futures prices as they print. Each update is time-stamped and cleaned, so every later stage works from the same picture of the market.',
      points: [
        'Live price data streamed directly into the engine',
        'Bad or delayed prints filtered out before they reach a decision',
        'One synchronized view of the market shared by every stage',
      ],
      tags: ['Live feed', 'Time-stamped', 'Normalized'],
    },
    {
      key: 'classify' as StageKey,
      name: 'Classify',
      sub: 'Market conditions',
      title: 'Trade only in the right conditions.',
      body:
        'Many losing trades happen in conditions a strategy was designed to avoid. QS1 first classifies the market as trending, ranging, volatile or thin, and trades only when conditions match its design. The rest of the time it stands aside.',
      points: [
        'Volatility and market structure measured continuously',
        'Trading paused when conditions fall outside the design range',
        'Scheduled high-impact news windows avoided',
      ],
      tags: ['Volatility', 'Structure', 'News filter'],
    },
    {
      key: 'signal' as StageKey,
      name: 'Evaluate',
      sub: 'Setup qualification',
      title: 'Fixed rules decide every entry.',
      body:
        'Within approved conditions, QS1 scores each potential setup against fixed entry criteria. A setup that meets every criterion is taken. Anything short of that is passed over. The same inputs always produce the same decision.',
      points: [
        'Entry rules defined in code before the session starts',
        'Each setup scored against strict qualifying conditions',
        'Identical inputs produce identical decisions',
      ],
      tags: ['Deterministic', 'Rules-based', 'Fully automated'],
    },
    {
      key: 'risk' as StageKey,
      name: 'Verify',
      sub: 'Pre-trade risk',
      title: 'Every order is checked before it is sent.',
      body:
        "Each order is checked against position limits, the daily loss limit and the account's drawdown rules. If any check fails, the engine cancels the order before it reaches the market.",
      points: [
        'Position size calculated from a fixed risk budget',
        'Daily loss and drawdown limits enforced automatically',
        'A failed check cancels the order outright',
      ],
      tags: ['Position limits', 'Daily loss limit', 'Drawdown rules'],
    },
    {
      key: 'execute' as StageKey,
      name: 'Execute',
      sub: 'Order routing',
      title: 'Entry, stop and target go out together.',
      body:
        "Approved orders go straight to the execution platform's API as bracket orders. The protective stop and profit target are attached the moment the position opens, so every position is protected from its first second.",
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
      title: 'Each trade is managed through to exit.',
      body:
        'Once a position is open, QS1 manages it by rule: it tightens protection as price moves, exits on time-based conditions and closes positions before the session ends. Every event is logged for review.',
      points: [
        'Stops tightened by rule as the trade develops',
        'Time-based exits and end-of-session close-out',
        'Every order, fill and adjustment recorded',
      ],
      tags: ['Trailing logic', 'Session close-out', 'Full audit log'],
    },
  ],
};

export const ANATOMY = {
  eyebrow: 'Execution',
  exhibit: 'Exhibit 2 · Anatomy of a single trade',
  titleA: 'One trade, nine decisions.',
  titleB: 'Every one made by rule.',
  lede:
    'Here is one illustrative long trade, from the first data point to the final record. Each step follows a written rule and happens in a fixed sequence.',
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
  titleA: 'Four layers of risk control.',
  titleB: 'Each one can stop trading on its own.',
  lede:
    'Risk control is built into the engine. Four independent layers surround every order, and if any one of them is triggered, trading stops.',
  layers: [
    {
      k: 'L1',
      name: 'Trade',
      title: 'Every position has a hard stop',
      body: 'Each order goes out with a protective stop attached. The maximum loss on the trade is set before entry.',
    },
    {
      k: 'L2',
      name: 'Session',
      title: 'Daily limits end the session',
      body: 'A daily loss limit and a cap on the number of trades stop the engine for the rest of the session once either is reached. A bad day stays contained to that day.',
    },
    {
      k: 'L3',
      name: 'Account',
      title: 'Drawdown rules built into sizing',
      body: "Position sizes and limits are set inside the account's drawdown rules, with a buffer between the account and those limits.",
    },
    {
      k: 'L4',
      name: 'System',
      title: 'A kill switch above everything',
      body: 'Connectivity monitoring, news blackouts and a manual override let our team stand the engine down instantly.',
    },
  ],
};

export const COMPARE = {
  eyebrow: 'Comparison',
  titleA: 'Manual trading',
  titleB: 'compared with QS1.',
  you: 'Manual trading',
  qs: 'QS1',
  rows: [
    { k: 'Reaction', you: 'After you notice, decide and click', qs: 'As soon as conditions are met' },
    { k: 'Hours covered', you: "While you're awake and at the screen", qs: 'Every session it is set to trade' },
    { k: 'After a loss', you: 'Pressure to win it back', qs: 'Next trade evaluated on its own merits' },
    { k: 'Rule adherence', you: 'Most of the time', qs: 'Every time, enforced in code' },
    { k: 'Stop-losses', you: 'Sometimes moved or skipped', qs: 'Attached on entry and kept in place' },
    { k: 'Record keeping', you: 'Whatever you remember to journal', qs: 'Every event logged automatically' },
  ],
};

export const INFRA = {
  eyebrow: 'Infrastructure',
  titleA: 'Automated execution,',
  titleB: 'monitored by people.',
  lede:
    'QS1 runs on always-on servers, and our team watches it every session. Here is what keeps it running.',
  cards: [
    {
      icon: 'cloud',
      title: 'Always-on hosting',
      body: 'QS1 runs on dedicated servers. Execution runs independently of your home internet, power supply or computer.',
    },
    {
      icon: 'pulse',
      title: 'Continuous monitoring',
      body: 'Connectivity, fills and account state are checked continuously, and alerts fire the moment anything moves outside normal ranges.',
    },
    {
      icon: 'lock',
      title: 'Execution-only access',
      body: 'QS1 connects with trading credentials only. It can place and manage orders. Withdrawals and account changes stay with you.',
    },
    {
      icon: 'eye',
      title: 'Human oversight',
      body: 'Our team reviews system behavior every session and can pause the engine instantly when conditions call for it.',
    },
  ],
};

export const PROCESS = {
  eyebrow: 'Engagement',
  titleA: 'Four steps',
  titleB: 'from consultation to live trading.',
  steps: [
    {
      k: '01',
      title: 'Private consultation',
      body: 'A 45-minute call about your goals, your experience and whether QS1 fits. No obligation.',
    },
    {
      k: '02',
      title: 'Account setup',
      body: "We guide you step by step through opening a funded futures account that meets QS1's requirements.",
    },
    {
      k: '03',
      title: 'Secure connection',
      body: 'You share execution-only credentials through an encrypted intake. We configure and connect your account.',
    },
    {
      k: '04',
      title: 'QS1 goes live',
      body: 'The engine starts trading your account by rule, and our team monitors every session.',
    },
  ],
};

export const ACCESS = {
  eyebrow: 'Capacity',
  title: 'We onboard a limited number of accounts each month.',
  body:
    'Every account is configured and monitored individually, so we cap new accounts each month to hold that standard. On the consultation, we both decide whether QS1 is the right fit.',
  criteriaTitle: 'QS1 is built for people who',
  criteria: [
    'Want exposure to gold futures without watching screens',
    'Accept that every trading system has losing days',
    'Value a repeatable process over quick wins',
    'Are ready to let written rules make the decisions',
  ],
  guaranteeStrong: '45-day money-back guarantee.',
  guarantee: 'If QS1 is the wrong fit within 45 days of enrolling, we refund your enrollment fee in full.',
  cta: 'Apply for a consultation',
};

export const FAQ = [
  {
    q: 'Do I need trading experience?',
    a: 'No. QS1 makes every trading decision and places every order. We walk you through how a futures account works on the call.',
  },
  {
    q: 'Do I need to watch the screen?',
    a: 'No. QS1 runs on its own. You can check your account whenever you like.',
  },
  {
    q: 'What does QS1 trade?',
    a: "Gold futures on CME's COMEX exchange. Trading one market lets us build and tune the engine around how gold actually trades.",
  },
  {
    q: 'Does QS1 have losing trades?',
    a: 'Yes. Every trading system has losing trades. QS1 defines the loss on each trade in advance with a stop, and daily limits cap how much any single day can lose.',
  },
  {
    q: 'Can QS1 move or withdraw my money?',
    a: 'QS1 uses execution-only trading credentials. It can place and manage orders. Withdrawals and account changes stay with you.',
  },
  {
    q: 'How do I get started?',
    a: 'Request a consultation. It takes 45 minutes, and you leave knowing whether QS1 fits your situation.',
  },
];

export const FINAL = {
  titleA: 'Put a disciplined process',
  titleB: 'between your capital and the market.',
  body:
    'Book a private 45-minute consultation. We will walk you through how QS1 trades, how it controls risk and whether it fits your goals.',
  cta: 'Request your consultation',
  fine: ['45-day money-back guarantee', 'No obligation', 'Limited onboarding each month'],
};

export const DISCLOSURE =
  'Trading futures involves substantial risk of loss and is not suitable for every investor. You could lose some or all of the capital in your account. Past performance, whether actual or indicated by historical tests, is not indicative of future results. Descriptions and illustrations of how QS1 operates are provided for explanation only and do not represent actual trades or a guarantee of performance. Quantara Systems does not guarantee profits or freedom from loss. Nothing on this site is financial advice or a solicitation to buy or sell any financial instrument.';
