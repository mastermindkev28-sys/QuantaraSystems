// COMEX gold trades on CME Globex from Sunday 6pm to Friday 5pm New York time,
// with a one-hour break at 5pm each weekday. Exchange holidays aren't modelled.
export function goldSession(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const day = parts.find(p => p.type === 'weekday')?.value;
  const hour = Number(parts.find(p => p.type === 'hour')?.value) % 24;
  if (day === 'Sat' || (day === 'Fri' && hour >= 17) || (day === 'Sun' && hour < 18)) return { open: false, label: 'Closed' };
  if (hour === 17) return { open: false, label: 'Daily break' };
  return { open: true, label: 'Open' };
}
