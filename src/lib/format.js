const KM_PER_MI = 1.609344;

export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const dayDiff = (aKey, bKey) =>
  Math.round((parseKey(bKey) - parseKey(aKey)) / 86400000);

export const addDays = (key, n) => {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
};

// Daily #1 is 2026-01-02 (so Oct 15, 2026 is #287).
export const dailyNumber = (key) => dayDiff('2026-01-01', key);

export const longDate = (key) =>
  parseKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
export const mediumDate = (key) =>
  parseKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const weekdayDate = (key) =>
  parseKey(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

export const formatNumber = (n) => Math.round(n).toLocaleString('en-US');

export function formatDistance(km, units = 'km') {
  const v = units === 'mi' ? km / KM_PER_MI : km;
  return `${formatNumber(v)} ${units}`;
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const formatClockPadded = (totalSeconds) => {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function formatDuration(totalSeconds) {
  const s = Math.round(totalSeconds);
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
}

export function timeUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const mins = Math.max(0, Math.floor((next - now) / 60000));
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

export const formatCoord = ({ lat, lng }) =>
  `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
