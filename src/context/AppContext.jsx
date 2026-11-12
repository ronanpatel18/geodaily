import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadStats, resetStats, saveStats } from '../lib/stats';

const SETTINGS_KEY = 'geodaily.settings.v1';
const AppContext = createContext(null);

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { relaxed: false, units: 'km', ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { relaxed: false, units: 'km' };
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);
  const [stats, setStats] = useState(loadStats);

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);
  useEffect(() => saveStats(stats), [stats]);

  const updateSetting = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  const addGame = useCallback((game) => setStats((s) => ({ ...s, games: [...s.games, game] })), []);
  const reset = useCallback(() => setStats(resetStats()), []);

  const value = useMemo(
    () => ({ settings, updateSetting, stats, addGame, reset }),
    [settings, updateSetting, stats, addGame, reset],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
