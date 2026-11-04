// Research notes published under Insights. Educational only: no performance
// figures, no forecasts. Review before publishing and edit freely.

export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO date
  readMinutes: number;
  topic: string;
  sections: { heading?: string; paragraphs: string[] }[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'execution-not-prediction',
    title: 'Execution, not prediction: where trading outcomes are decided',
    summary:
      'Most discussion of trading focuses on forecasting. In practice, the larger and more controllable source of variance sits in how a plan is carried out.',
    date: '2026-11-04',
    readMinutes: 5,
    topic: 'Process',
    sections: [
      {
        paragraphs: [
          'Ask most active traders what separates good results from poor ones and the answer is usually about prediction: a better read of direction, a sharper indicator, an earlier signal. It is an understandable instinct. Prediction is the visible, intellectual part of the work.',
          'But between a forecast and a result sits a long chain of decisions: whether to act on the signal at all, how large the position should be, where protection is placed, when to adjust it and when to exit. Each link in that chain is an opportunity for the plan to be carried out differently from how it was designed.',
        ],
      },
      {
        heading: 'Two traders, one strategy',
        paragraphs: [
          'Consider two traders running the same written strategy on the same market. One enters every qualified setup on time; the other hesitates after a loss and skips the next two. One honours every stop; the other occasionally widens a stop in the hope of recovery. Over a long enough period, their results can diverge substantially, even though their analysis is identical.',
          'That divergence has nothing to do with skill at prediction. It is the cost of inconsistent execution, and it compounds quietly.',
        ],
      },
      {
        heading: 'Why execution degrades under pressure',
        paragraphs: [
          'Behavioural finance has documented the mechanisms for decades: loss aversion makes realised losses feel larger than equivalent gains, prompting traders to hold losing positions too long; recency bias makes the last few outcomes feel more predictive than they are; and fatigue erodes the attention that careful execution requires. None of these are character flaws. They are the ordinary behaviour of a human mind under uncertainty and time pressure.',
        ],
      },
      {
        heading: 'Making execution a fixed quantity',
        paragraphs: [
          'A systematic approach does not make a strategy better. What it does is make execution constant. When entries, sizing, protection and exits are defined in advance and carried out by rule, the gap between the plan and the result narrows to the strategy itself.',
          'That is the premise behind QS1: treat execution as an engineering problem rather than a test of willpower, and remove discretion from the steps where discretion does the most damage.',
        ],
      },
    ],
  },
  {
    slug: 'the-case-for-regime-filters',
    title: 'The case for regime filters: why the best trade is often no trade',
    summary:
      'Strategies are built for particular market conditions. Recognising when those conditions are absent can matter as much as any entry signal.',
    date: '2026-10-21',
    readMinutes: 4,
    topic: 'Market structure',
    sections: [
      {
        paragraphs: [
          'Every trading approach carries an implicit assumption about the market it operates in. A trend-following entry assumes that moves, once started, tend to continue. A mean-reversion entry assumes the opposite. Neither assumption holds all of the time.',
          'Markets move between regimes: periods of steady directional movement, periods of range-bound rotation, bursts of disorderly volatility, and quiet stretches of thin liquidity. A strategy that performs well in one regime can perform poorly, or erratically, in another.',
        ],
      },
      {
        heading: 'Filtering before signalling',
        paragraphs: [
          'A regime filter asks a simple question before any setup is evaluated: are current conditions ones this approach was designed for? If not, the system stands aside, regardless of how attractive an individual signal may appear.',
          'This is counter-intuitive for many traders, because inactivity feels like missed opportunity. Yet declining to trade in unsuitable conditions is itself a decision with a measurable effect, and often a favourable one.',
        ],
      },
      {
        heading: 'Scheduled events',
        paragraphs: [
          'Some conditions are predictable in timing even if not in outcome. Major economic releases and policy announcements can produce sharp, two-directional moves in gold futures within seconds. Many systematic approaches, QS1 included, avoid holding new risk across these scheduled windows.',
        ],
      },
      {
        heading: 'Discipline at the first step',
        paragraphs: [
          'The value of a regime filter depends entirely on its being applied consistently. A filter that is overridden whenever a setup looks compelling is not a filter at all. Encoding it as a mandatory first stage, before any signal is considered, is what makes it effective.',
        ],
      },
    ],
  },
  {
    slug: 'risk-as-architecture',
    title: 'Risk as architecture: designing limits that hold under pressure',
    summary:
      'Risk limits are only as good as their enforcement. Layered, independent controls make it far harder for a single failure to become a serious one.',
    date: '2026-10-07',
    readMinutes: 5,
    topic: 'Risk management',
    sections: [
      {
        paragraphs: [
          'Nearly every trader has risk rules. Far fewer have risk rules that are guaranteed to be followed. The difference matters most on exactly the days when following them is hardest: after a sequence of losses, during a fast market, or when a position is moving against expectations.',
        ],
      },
      {
        heading: 'From guidelines to structure',
        paragraphs: [
          'A guideline relies on someone choosing to apply it. A structural control applies itself. In a systematic engine, a maximum position size or a daily loss limit is not a reminder; it is a condition that an order must satisfy before it can be sent at all.',
        ],
      },
      {
        heading: 'Independent layers',
        paragraphs: [
          'Robust risk design borrows from engineering disciplines where failure is costly: multiple, independent safeguards, each able to act on its own. In QS1 these operate at four levels. At the trade level, every position carries a protective stop from the moment it opens. At the session level, a daily loss limit and a cap on the number of trades end activity for the day once reached. At the account level, sizing and limits are configured with a buffer inside the account’s own drawdown rules. At the system level, connectivity monitoring, scheduled-event blackouts and manual override allow the engine to stand down entirely.',
          'Because the layers are independent, a gap in one does not compromise the others. A position that somehow lacked a stop would still be bounded by the session limit; a session that behaved unexpectedly would still be bounded by the account configuration.',
        ],
      },
      {
        heading: 'What risk control cannot do',
        paragraphs: [
          'No arrangement of limits eliminates risk. Futures trading involves the possibility of loss, and markets can move in ways that exceed historical experience. The purpose of layered controls is narrower and more realistic: to keep losses defined, to prevent any single day from doing disproportionate damage, and to make the system’s behaviour predictable when conditions are not.',
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find(a => a.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
