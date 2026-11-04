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
    slug: 'execution-decides-outcomes',
    title: 'Execution decides trading outcomes',
    summary:
      'Most discussion of trading focuses on forecasting. The larger and more controllable source of variance sits in how a plan is carried out.',
    date: '2026-11-04',
    readMinutes: 5,
    topic: 'Process',
    sections: [
      {
        paragraphs: [
          'Ask most active traders what separates good results from poor ones and the answer is usually about prediction: a better read of direction, a sharper indicator, an earlier signal. Prediction is the visible, intellectual part of the work, so it gets the attention.',
          'But between a forecast and a result sits a long chain of decisions: whether to act on the signal at all, how large the position should be, where protection is placed, when to adjust it and when to exit. Each link in that chain is an opportunity for the plan to be carried out differently from how it was designed.',
        ],
      },
      {
        heading: 'Two traders, one strategy',
        paragraphs: [
          'Consider two traders running the same written strategy on the same market. One enters every qualified setup on time; the other hesitates after a loss and skips the next two. One honours every stop; the other occasionally widens a stop in the hope of recovery. Over a long enough period, their results can diverge substantially, even though their analysis is identical.',
          'The entire difference comes from execution. Inconsistent execution has a cost, and that cost compounds trade after trade.',
        ],
      },
      {
        heading: 'Why execution degrades under pressure',
        paragraphs: [
          'Behavioral finance has documented the mechanisms for decades. Loss aversion makes realized losses feel larger than equivalent gains, so traders hold losing positions too long. Recency bias makes the last few outcomes feel more predictive than they are. Fatigue erodes the attention that careful execution requires. These are the ordinary responses of a human mind under uncertainty and time pressure, and they affect experienced traders as much as beginners.',
        ],
      },
      {
        heading: 'Making execution a fixed quantity',
        paragraphs: [
          'A systematic approach makes execution constant. When entries, sizing, protection and exits are defined in advance and carried out by rule, the result reflects the strategy itself, with the execution errors removed.',
          'That is the premise behind QS1: treat execution as an engineering problem, and take discretion out of the steps where it does the most damage.',
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
          'Every trading approach carries an assumption about the market it operates in. A trend-following entry assumes that moves, once started, tend to continue. A mean-reversion entry assumes they tend to reverse. Each assumption holds in some conditions and fails in others.',
          'Markets move between regimes: periods of steady directional movement, periods of range-bound rotation, bursts of disorderly volatility, and quiet stretches of thin liquidity. A strategy that performs well in one regime can perform poorly, or erratically, in another.',
        ],
      },
      {
        heading: 'Filtering before signalling',
        paragraphs: [
          'A regime filter asks a simple question before any setup is evaluated: are current conditions ones this approach was designed for? If not, the system stands aside, regardless of how attractive an individual signal may appear.',
          'Many traders find this difficult, because inactivity feels like missed opportunity. Standing aside in unsuitable conditions is a decision with a measurable effect on results, and it is often the most valuable decision a system makes.',
        ],
      },
      {
        heading: 'Scheduled events',
        paragraphs: [
          'Some events arrive on a known schedule with an unknown outcome. Major economic releases and policy announcements can produce sharp, two-directional moves in gold futures within seconds. Many systematic approaches, QS1 included, avoid holding new risk across these scheduled windows.',
        ],
      },
      {
        heading: 'Discipline at the first step',
        paragraphs: [
          'A regime filter only works if it is applied every time, including when a setup looks compelling. Encoding it as a mandatory first stage, before any signal is considered, is what makes it effective.',
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
          'Nearly every trader has risk rules. Far fewer have risk rules that are enforced automatically. The difference matters most on the days when following them is hardest: after a sequence of losses, during a fast market, or when a position is moving against expectations.',
        ],
      },
      {
        heading: 'From guidelines to structure',
        paragraphs: [
          'A guideline relies on someone choosing to apply it. A structural control applies itself. In a systematic engine, a maximum position size or a daily loss limit is a condition every order must satisfy before it can be sent.',
        ],
      },
      {
        heading: 'Independent layers',
        paragraphs: [
          'Robust risk design borrows from engineering fields where failure is costly: multiple independent safeguards, each able to act on its own. In QS1 these operate at four levels. At the trade level, every position carries a protective stop from the moment it opens. At the session level, a daily loss limit and a cap on the number of trades end activity for the day once reached. At the account level, sizing and limits are configured with a buffer inside the account’s own drawdown rules. At the system level, connectivity monitoring, scheduled-event blackouts and manual override allow the engine to stand down entirely.',
          'Because the layers are independent, each one backs up the others. A position that somehow lacked a stop would still be bounded by the session limit; a session that behaved unexpectedly would still be bounded by the account configuration.',
        ],
      },
      {
        heading: 'What risk control is for',
        paragraphs: [
          'Futures trading always carries the possibility of loss, and markets can move beyond anything seen in historical data. Layered controls have a specific job: keep each loss defined, cap the damage any single day can do, and keep the system’s behavior predictable when markets are unpredictable.',
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find(a => a.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
