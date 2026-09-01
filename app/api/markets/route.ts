import { NextResponse } from 'next/server';

const SYMBOLS = [
  { key: 'MNQ', yahoo: 'MNQ=F',     label: 'Micro Nasdaq-100' },
  { key: 'MES', yahoo: 'MES=F',     label: 'Micro S&P 500'    },
  { key: 'SPX', yahoo: '^GSPC',     label: 'S&P 500'          },
  { key: 'DXY', yahoo: 'DX-Y.NYB', label: 'US Dollar Index'  },
  { key: 'BTC', yahoo: 'BTC-USD',   label: 'Bitcoin'          },
];

async function fetchSymbol(yahoo: string) {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?interval=5m&range=1d`,
    {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      cache: 'no-store',
    }
  );
  if (!res.ok) throw new Error('upstream');
  const json = await res.json();
  const r = json.chart?.result?.[0];
  if (!r) throw new Error('no result');
  const meta = r.meta;
  const price: number = meta.regularMarketPrice;
  const prev: number = meta.chartPreviousClose;
  const change = +(price - prev).toFixed(2);
  const changePct = +((change / prev) * 100).toFixed(3);
  const timestamps: number[] = r.timestamp ?? [];
  const closes: (number | null)[] = r.indicators?.quote?.[0]?.close ?? [];
  const points = timestamps
    .map((t, i) => ({ t, p: closes[i] }))
    .filter((x): x is { t: number; p: number } => x.p !== null && x.p !== undefined)
    .slice(-30);
  return { price, prev, change, changePct, high: meta.regularMarketDayHigh, low: meta.regularMarketDayLow, state: meta.marketState, points };
}

export async function GET() {
  const results = await Promise.allSettled(
    SYMBOLS.map(s => fetchSymbol(s.yahoo).then(d => ({ key: s.key, label: s.label, ...d })))
  );
  const data = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { key: SYMBOLS[i].key, label: SYMBOLS[i].label, error: true }
  );
  return NextResponse.json({ data, ts: Date.now() });
}
