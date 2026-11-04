// ─────────────────────────────────────────────────────────────────────────────
// All site copy lives here so it can be edited without touching layout code.
//
// Voice: direct, specific, positive statements about what QS1 does. No
// rhetorical negation, irony or manufactured urgency. "A process, not a
// prediction." is the one deliberate exception: it is the brand line.
//
// VERIFY before publishing: every description of QS1's internals (ENGINE, RISK,
// INFRA, FAQ, MARKETS). Items marked "verify" below are reasonable descriptions
// of a rules-based futures engine that only Quantara can confirm.
// ─────────────────────────────────────────────────────────────────────────────

export const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';

export const CTA = {
  primary: 'Request a Consultation',
  walkthrough: 'Request a Private Walkthrough',
  explore: 'Explore the QS1 Framework',
  execution: 'Review the Execution Process',
};

export const NAV = [
  { label: 'Approach', href: '/approach' },
  { label: 'Risk Management', href: '/risk' },
  { label: 'Execution', href: '/execution' },
  { label: 'Insights', href: '/insights' },
];

export const NAV_CTA = CTA.primary;

export const FOOTER_NAV = [
  {
    title: 'QS1',
    links: [
      { label: 'Approach', href: '/approach' },
      { label: 'Risk Management', href: '/risk' },
      { label: 'Execution', href: '/execution' },
      { label: 'Engagement', href: '/engagement' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights', href: '/insights' },
      { label: 'QS1 overview (PDF)', href: '/quantara-qs1-overview.pdf' },
      { label: 'Frequently asked questions', href: '/engagement#faq' },
      { label: 'Request a Consultation', href: '/consultation' },
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

export const COMPANY = {
  name: 'Quantara Systems',
  tagline: 'Systematic execution technology for futures markets.',
};

export const OVERVIEW_PDF = '/quantara-qs1-overview.pdf';

// Firms and platforms QS1 works with (verify). Logos live in public/logos/<slug>.png
// as white artwork on a transparent background; a text wordmark shows if a file is
// missing. `withName` sets the company name beside a symbol-only logo.
export const PLATFORMS = {
  eyebrow: 'Compatibility',
  title: 'Works with the firms and platforms futures traders already use.',
  groups: [
    {
      label: 'Proprietary trading firms',
      items: [
        { slug: 'topstep', name: 'Topstep' },
        { slug: 'lucid', name: 'Lucid Trading' },
      ],
    },
    {
      label: 'Execution and analysis platforms',
      items: [
        { slug: 'tradovate', name: 'Tradovate' },
        { slug: 'ninjatrader', name: 'NinjaTrader', withName: true },
        { slug: 'tradingview', name: 'TradingView' },
      ],
    },
  ],
  note:
    'Names and logos are trademarks of their respective owners and are shown only to indicate compatibility. Quantara Systems is not affiliated with, endorsed by or sponsored by any of these companies.',
};

export const HERO = {
  label: 'QS1 · Systematic execution technology for futures markets',
  title: 'A process, not a prediction.',
  lede:
    'QS1 is proprietary execution software for COMEX gold futures. It evaluates market conditions through a defined confluence framework, qualifies each entry against predefined conditions, then executes and manages the trade by rule.',
  points: ['Entries qualified by defined conditions', 'Risk parameters set before every order', 'Every execution event recorded'],
  primary: CTA.primary,
  secondary: CTA.explore,
  // Used by the PDF overview.
  facts: [
    { k: 'Market', v: 'COMEX gold futures (GC, MGC)' },
    { k: 'Execution', v: 'Automated, rules-based' },
    { k: 'Qualification', v: 'Defined confluence conditions' },
    { k: 'Risk', v: 'Parameters set before entry' },
    { k: 'Records', v: 'Every event time-stamped' },
  ],
};

export const PLATFORM = {
  eyebrow: 'The QS1 platform',
  titleA: 'Systematic execution.',
  titleB: 'Defined by design.',
  lede:
    'QS1 combines market analysis, strategy confluence and order execution in one system. Each component passes a defined result to the next, so every trade can be traced from the conditions that qualified it to the record that closes it.',
  capabilities: [
    { k: 'Market analysis', body: 'An integrated algorithm reads live gold futures data and measures market structure, volatility and session conditions as they change.' },
    { k: 'Strategy confluence', body: 'Several independent conditions are combined into one framework. A setup qualifies only when the full condition set aligns.' },
    { k: 'Trade qualification', body: 'Each potential entry is tested against the predefined conditions and returns one result: qualified, or passed over.' },
    { k: 'Structured entry', body: 'Qualified entries go out as bracket orders, with the entry, protective stop and profit target defined together.' },
    { k: 'Risk parameters', body: 'Position size and loss limits come from fixed parameters set before the trade is placed.' },
    { k: 'Position management', body: 'Open positions are managed by rule, from protective-stop adjustments through to the exit.' },
    { k: 'Execution records', body: 'Every decision, order, fill and adjustment is time-stamped and stored for review.' },
  ],
  layersTitle: 'Two layers work together',
  layers: [
    { k: 'Confluence framework', body: 'Decides whether a setup qualifies. It holds the strategy conditions that must align before an entry is allowed.' },
    { k: 'Six-stage process', body: 'Governs how every trade is handled, from the first data point to the final record. The confluence framework runs inside stage three.' },
  ],
};

export const PROBLEM = {
  eyebrow: 'Why structure matters',
  titleA: 'Most trading losses come from execution.',
  titleB: 'The strategy is usually sound.',
  lede:
    'Late entries. Targets moved out of greed. Stops widened after a loss. Valid setups skipped after a losing streak. Each mistake is small on its own. Across hundreds of trades, they decide the result. QS1 is built to carry out a defined process the same way on every trade.',
  flaws: [
    {
      k: '01 · Coverage',
      big: '23',
      unit: 'hours a day',
      title: 'Gold trades almost around the clock.',
      body: 'COMEX gold futures trade nearly 23 hours a day, five days a week. A person can give full attention to a fraction of that. QS1 covers every session it is configured to trade.',
    },
    {
      k: '02 · Consistency',
      big: '1',
      unit: 'losing trade',
      title: 'One loss changes the next decision.',
      body: 'After a loss, most traders either size up to recover it or hesitate on the next valid setup. QS1 evaluates every trade against the same conditions, whatever happened before it.',
    },
    {
      k: '03 · Process',
      big: '6',
      unit: 'stages per order',
      title: 'One lifecycle, applied to every order.',
      body: 'Data, conditions, qualification, risk, execution and management, in that order, every time. The process is written in code, so the first trade and the five-hundredth are handled the same way.',
    },
  ],
};

export type StageKey = 'ingest' | 'classify' | 'signal' | 'risk' | 'execute' | 'manage';

export const ENGINE = {
  eyebrow: 'Methodology',
  exhibit: 'Exhibit 1 · The QS1 execution lifecycle',
  titleA: 'Six stages.',
  titleB: 'Every order passes through each one.',
  lede:
    'The six stages are the operating lifecycle of every QS1 trade. Strategy confluence runs inside stage three, where setups are qualified. Select a stage to see its role.',
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
      sub: 'Regime detection',
      title: 'Confirm the conditions are right.',
      body:
        'Before any setup is considered, QS1 classifies the market as trending, ranging, volatile or thin. Trading proceeds only when conditions match the range the system was built for.',
      points: [
        'Volatility and market structure measured continuously',
        'Trading paused when conditions fall outside the design range',
        'Scheduled high-impact news windows avoided',
      ],
      tags: ['Volatility', 'Structure', 'Event filter'],
    },
    {
      key: 'signal' as StageKey,
      name: 'Evaluate',
      sub: 'Setup qualification',
      title: 'The confluence framework decides.',
      body:
        'Inside approved conditions, each potential setup is tested against the QS1 confluence framework: a predefined set of strategy conditions that must align before an entry qualifies. A setup that meets every condition moves to risk verification.',
      points: [
        'Strategy conditions defined in code before the session starts',
        'A setup qualifies only when the full condition set aligns',
        'Identical inputs always produce the identical result',
      ],
      tags: ['Confluence', 'Rules-based', 'Deterministic'],
    },
    {
      key: 'risk' as StageKey,
      name: 'Verify',
      sub: 'Pre-trade risk',
      title: 'Every order is checked before it is sent.',
      body:
        "Each qualified order is checked against position limits, the daily loss limit and the account's drawdown rules. An order that fails any check is cancelled before it reaches the market.",
      points: [
        'Position size calculated from fixed risk parameters',
        'Daily loss and drawdown limits checked on every order',
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
        "Approved orders go straight to the execution platform's API as bracket orders. The protective stop and profit target are attached the moment the position opens.",
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
        'Once a position is open, QS1 manages it by rule: it adjusts protection as price moves, exits on defined conditions and records every event for review.',
      points: [
        'Protective stop adjusted by rule as the trade develops',
        'Exits on target, stop or defined time conditions',
        'Every order, fill and adjustment recorded',
      ],
      tags: ['Stop management', 'Defined exits', 'Audit log'],
    },
  ],
};

// One illustrative long trade in Micro Gold (MGC). Prices are illustrative.
export const ANATOMY = {
  eyebrow: 'Execution',
  exhibit: 'Exhibit 2 · Anatomy of a single trade',
  titleA: 'One trade, nine decisions.',
  titleB: 'Each one made by rule.',
  lede:
    'Follow one illustrative long trade in Micro Gold futures from the first data point to the final record. Select any event in the log to see the trade at that moment.',
  ticket: { symbol: 'MGC', name: 'Micro Gold · COMEX', side: 'Long', qty: 5, entry: '4,018.4', stop: '4,012.4', target: '4,030.4', breakeven: '4,018.4' },
  steps: [
    { t: '09:41:06.218', tag: 'DATA',   text: 'Price update received · feed healthy', status: 'Scanning' },
    { t: '09:41:06.219', tag: 'REGIME', text: 'Trending · volatility in range · tradeable', status: 'Conditions approved' },
    { t: '09:41:06.221', tag: 'SIGNAL', text: 'Long setup qualified · confluence conditions met', status: 'Setup qualified' },
    { t: '09:41:06.222', tag: 'RISK',   text: '5 / 5 checks passed · size set from risk parameters', status: 'Risk verified' },
    { t: '09:41:06.224', tag: 'ORDER',  text: 'Bracket sent · buy 5 · stop and target attached', status: 'Order working' },
    { t: '09:41:06.301', tag: 'FILL',   text: 'Entry filled at 4,018.4 · position protected', status: 'Position open' },
    { t: '09:52:40.007', tag: 'MANAGE', text: 'Price advanced · stop moved to entry', status: 'Stop at entry' },
    { t: '10:04:13.552', tag: 'EXIT',   text: 'Target filled at 4,030.4 · position closed', status: 'Closed at target' },
    { t: '10:04:13.560', tag: 'LOG',    text: 'Trade recorded · engine returns to scanning', status: 'Recorded' },
  ],
  footnote:
    'Illustrative sequence for explanation only. It shows the order of operations inside QS1. It is not a record of a specific trade, and it does not represent past or future results.',
};

export const RISK = {
  eyebrow: 'Risk management',
  exhibit: 'Exhibit 3 · Risk controls across the lifecycle',
  titleA: 'Risk is defined before the trade,',
  titleB: 'then enforced through to the close.',
  lede:
    'QS1 applies risk parameters at every point in the lifecycle: before an order is sent, the moment it fills and while the position is open. Select a layer to see how it works.',
  layers: [
    {
      k: 'L1',
      name: 'Trade',
      title: 'Every position has a protective stop',
      body: 'Each order goes out with its stop and target attached. The maximum loss on the trade is fixed before entry.',
    },
    {
      k: 'L2',
      name: 'Session',
      title: 'Daily limits end the session',
      body: 'A daily loss limit and a cap on the number of trades stop new entries for the rest of the session once either is reached.',
    },
    {
      k: 'L3',
      name: 'Account',
      title: 'Drawdown rules built into sizing',
      body: "Position sizes and limits are set inside the account's drawdown rules, with a buffer kept between the account and those limits.",
    },
    {
      k: 'L4',
      name: 'System',
      title: 'Operating conditions and override',
      body: 'Connectivity monitoring, scheduled-event windows and a manual override let the system stand down immediately.',
    },
  ],
  principles: [
    'Pre-trade qualification on every entry',
    'Entry, stop and target defined together',
    'Defined position-management rules',
    'Every event recorded for review',
  ],
};

export const COMPARE = {
  eyebrow: 'Comparison',
  titleA: 'Discretionary and systematic execution,',
  titleB: 'side by side.',
  you: 'Discretionary approach',
  qs: 'QS1',
  rows: [
    { k: 'Trade selection', you: 'Manual interpretation of the chart', qs: 'Defined confluence conditions' },
    { k: 'Entry criteria', you: 'Varies with the trader and the day', qs: 'Rule-based verification before every order' },
    { k: 'Risk parameters', you: 'Applied manually, trade by trade', qs: 'Predefined and attached on entry' },
    { k: 'Execution', you: 'Human-directed', qs: 'System-directed through the platform API' },
    { k: 'Position management', you: 'Decided in the moment', qs: 'Defined management rules through to exit' },
    { k: 'Record keeping', you: "Depends on the trader's journal", qs: 'Every event recorded automatically' },
  ],
};

// Contract details are CME Group specifications.
export const MARKETS = {
  eyebrow: 'Markets',
  titleA: 'Built for COMEX gold.',
  titleB: 'Tuned to how gold trades.',
  lede:
    'QS1 is configured for gold futures on COMEX: the full-size GC contract and the Micro Gold MGC contract. Every condition, filter and parameter is tuned to gold’s behavior across its sessions.',
  contracts: [
    { code: 'GC', name: 'Gold futures', size: '100 troy oz', tick: '$0.10 = $10.00' },
    { code: 'MGC', name: 'Micro Gold futures', size: '10 troy oz', tick: '$0.10 = $1.00' },
  ],
  hours: 'Sunday to Friday, 6:00 p.m. to 5:00 p.m. ET, with a 60-minute break at 5:00 p.m. ET each day (CME Globex).',
  exchange: 'COMEX · CME Group',
  referenceNote: 'Reference markets are shown for context. Prices are delayed and are for information only.',
};

export const RECORDS = {
  eyebrow: 'Records',
  exhibit: 'Exhibit 4 · Structure of a QS1 execution record',
  titleA: 'Every execution leaves',
  titleB: 'a complete record.',
  lede:
    'Each trade produces a time-stamped record of the conditions that qualified it, the orders sent, every fill and adjustment, and the outcome. In your walkthrough, we review actual account records alongside the system that produced them.',
  fields: [
    { k: 'Conditions', v: 'Market state and confluence result at entry' },
    { k: 'Orders', v: 'Entry, stop and target as sent' },
    { k: 'Fills', v: 'Price, quantity and time of every fill' },
    { k: 'Adjustments', v: 'Each stop or target change, with its rule' },
    { k: 'Outcome', v: 'Exit reason, result and fees' },
  ],
  footnote: 'Illustrative record format. Actual account records are reviewed during the walkthrough.',
};

// Verified results. Leave `published` false until the account type is confirmed
// (simulated prop-firm or live brokerage) and it is confirmed that QS1 placed every
// trade. Simulated results must carry the CFTC Rule 4.41 disclaimer. Figures below
// are transcribed from the Tradovate performance report supplied by Quantara.
export const VERIFIED_RESULTS = {
  published: false,
  accountType: '' as '' | 'simulated' | 'live',
  period: 'August 9 to August 14, 2026',
  contract: 'MGCZ6 · Micro Gold, December 2026',
  trades: 20,
  contracts: 100,
  profitable: 20,
  grossPL: 4188.0,
  fees: 99.0,
  netPL: 4089.0,
  avgTrade: 209.4,
  largestWin: 518.0,
  maxDrawdown: 27.72,
  avgTradeTime: '16 min 7 sec',
};

export const INFRA = {
  eyebrow: 'Infrastructure',
  titleA: 'Automated execution,',
  titleB: 'monitored by people.',
  lede: 'QS1 runs on always-on servers, and our team watches it every session. These are the components that keep it running.',
  cards: [
    { icon: 'cloud', title: 'Always-on hosting', body: 'QS1 runs on dedicated servers, independent of your home internet, power supply or computer.' },
    { icon: 'pulse', title: 'Continuous monitoring', body: 'Connectivity, fills and account state are checked continuously, with alerts the moment anything leaves its normal range.' },
    { icon: 'lock', title: 'Execution-only access', body: 'QS1 connects with trading credentials only. It places and manages orders. Withdrawals and account changes stay with you.' },
    { icon: 'eye', title: 'Human oversight', body: 'Our team reviews system behavior every session and can pause the engine immediately when conditions call for it.' },
  ],
};

export const PROCESS = {
  eyebrow: 'Engagement',
  titleA: 'From consultation',
  titleB: 'to live execution.',
  steps: [
    { k: '01', title: 'Private walkthrough', body: 'A 45-minute session covering the QS1 framework, your goals and whether QS1 fits. No obligation.' },
    { k: '02', title: 'Account setup', body: "We guide you step by step through opening a futures account that meets QS1's requirements." },
    { k: '03', title: 'Secure connection', body: 'You share execution-only credentials through an encrypted intake. We configure and connect your account.' },
    { k: '04', title: 'QS1 goes live', body: 'The engine starts trading your account by rule, and our team monitors every session.' },
  ],
};

export const ACCESS = {
  eyebrow: 'Your walkthrough',
  title: 'What your walkthrough covers.',
  body: 'A 45-minute session with a member of our team, built around your questions.',
  covers: [
    'A live tour of the QS1 interface and execution lifecycle',
    'The confluence framework and how entries qualify',
    'How risk parameters are set and enforced',
    'Actual account records, reviewed with you',
    'Account requirements, setup and costs',
  ],
  criteriaTitle: 'QS1 suits traders who',
  criteria: [
    'Want exposure to gold futures without watching screens',
    'Accept that every trading system has losing days',
    'Value a repeatable process over quick wins',
    'Are ready to let written rules make the decisions',
  ],
  guaranteeStrong: '45-day money-back guarantee.',
  guarantee: 'If QS1 is the wrong fit within 45 days of enrolling, we refund your enrollment fee in full.',
  cta: CTA.walkthrough,
};

export const FAQ = [
  {
    q: 'What is the difference between the six stages and the confluence framework?',
    a: 'The confluence framework is the set of strategy conditions that decides whether a setup qualifies. The six stages are the lifecycle every trade follows, from market data to the final record. Confluence runs inside stage three.',
  },
  { q: 'Do I need trading experience?', a: 'No. QS1 makes every trading decision and places every order. We walk you through how a futures account works on the call.' },
  { q: 'Do I need to watch the screen?', a: 'No. QS1 runs on its own, and you can check your account whenever you like.' },
  { q: 'What does QS1 trade?', a: "Gold futures on CME's COMEX exchange: the full-size GC contract and the Micro Gold MGC contract." },
  {
    q: 'Does QS1 have losing trades?',
    a: 'Yes. Every trading system has losing trades. QS1 fixes the maximum loss on each trade before entry with a protective stop, and daily limits cap how much any single session can lose.',
  },
  { q: 'Can QS1 move or withdraw my money?', a: 'QS1 uses execution-only trading credentials. It places and manages orders. Withdrawals and account changes stay with you.' },
  { q: 'How do I get started?', a: 'Request a private walkthrough. It takes 45 minutes, and you leave knowing exactly how QS1 works and whether it fits your situation.' },
];

export const FINAL = {
  eyebrow: 'Private walkthrough',
  title: 'Understand the system behind every execution.',
  body:
    'In a private 45-minute walkthrough, we take you through the QS1 framework, the conditions that govern each entry, how risk is handled at every stage and what working with QS1 involves.',
  cta: CTA.walkthrough,
  secondary: 'Explore QS1',
  fine: ['45-minute private walkthrough', '45-day money-back guarantee', 'No obligation'],
};

export const DISCLOSURE =
  'Trading futures involves substantial risk of loss and is not suitable for every investor. You could lose some or all of the capital in your account. Past performance, whether actual or indicated by historical tests, is not indicative of future results. Descriptions and illustrations of how QS1 operates are provided for explanation only and do not represent actual trades or a guarantee of performance. Quantara Systems does not guarantee profits or freedom from loss. Nothing on this site is financial advice or a solicitation to buy or sell any financial instrument.';
