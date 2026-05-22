import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=5m&range=1d',
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
    const timestamps: number[] = r.timestamp ?? [];
    const closes: (number | null)[] = r.indicators?.quote?.[0]?.close ?? [];
    const points = timestamps
      .map((t, i) => ({ t, p: closes[i] }))
      .filter((x): x is { t: number; p: number } => x.p !== null && x.p !== undefined)
      .slice(-60);
    return NextResponse.json({
      price: meta.regularMarketPrice,
      prev: meta.chartPreviousClose,
      change: +(meta.regularMarketPrice - meta.chartPreviousClose).toFixed(2),
      changePct: +((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100).toFixed(3),
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume ?? 0,
      state: meta.marketState,
      points,
      ts: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
