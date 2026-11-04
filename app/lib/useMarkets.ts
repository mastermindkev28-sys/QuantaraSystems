'use client';

import { useEffect, useState } from 'react';

export interface Point { t: number; p: number }
export interface Quote {
  key: string;
  label: string;
  price?: number;
  prev?: number;
  change?: number;
  changePct?: number;
  high?: number;
  low?: number;
  state?: string;
  points?: Point[];
  error?: boolean;
}
interface Snapshot { data: Quote[]; ts: number }

// One shared poller for every component on the page, so the hero console and the
// market strip don't each hit /api/markets on their own.
let snapshot: Snapshot | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<(s: Snapshot) => void>();

async function load() {
  try {
    const res = await fetch('/api/markets');
    if (!res.ok) return;
    snapshot = await res.json();
    listeners.forEach(l => l(snapshot!));
  } catch {
    /* keep the last good snapshot */
  }
}

export function useMarkets() {
  const [data, setData] = useState<Snapshot | null>(snapshot);
  useEffect(() => {
    listeners.add(setData);
    if (!timer) {
      load();
      timer = setInterval(load, 30_000);
    } else if (snapshot) {
      setData(snapshot);
    }
    return () => {
      listeners.delete(setData);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return data;
}

export const fmtPrice = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
