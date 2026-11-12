import { useCallback, useState } from 'react';
import HomeScreen from './components/home/HomeScreen';
import GameScreen from './components/game/GameScreen';
import SummaryScreen from './components/summary/SummaryScreen';
import StatsScreen from './components/stats/StatsScreen';
import { useApp } from './context/AppContext';
import { getDailyLocations, getPracticeLocations } from './lib/locations';
import { findDaily } from './lib/stats';
import { dailyNumber, dateKey } from './lib/format';
import { hasStreetView, snapAll } from './lib/streetview';
import { clearProgress, loadProgress, saveProgress } from './lib/progress';
import { initialGameState } from './lib/round';

/** Lightweight screen state machine: home | loading | game | summary | stats */
export default function App() {
  const { stats, settings, addGame } = useApp();
  const [screen, setScreen] = useState('home');
  // Active game: { mode, date, relaxed, locations, initial?, nonce }
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);

  // Curated locations carry a panoId already; only entries without one are snapped at runtime.
  const prepare = async (picked) => {
    if (!hasStreetView || picked.every((l) => l.panoId)) return picked;
    setScreen('loading');
    return snapAll(picked);
  };

  const startPractice = async () => {
    const locations = await prepare(getPracticeLocations());
    setSession({ mode: 'practice', date: dateKey(), relaxed: settings.relaxed, locations, nonce: Date.now() });
    setScreen('game');
  };

  const startDaily = async () => {
    const key = dateKey();
    if (findDaily(stats.games, key)?.rounds) return navigate('summary');

    // Resume a daily already in progress — never deal a fresh copy of today's five.
    const saved = loadProgress(key);
    if (saved) {
      setSession({ mode: 'daily', date: key, relaxed: saved.relaxed, locations: saved.locations, initial: saved.game, nonce: Date.now() });
      return setScreen('game');
    }

    const locations = await prepare(getDailyLocations(key));
    const relaxed = settings.relaxed;
    saveProgress({ date: key, mode: 'daily', relaxed, locations, game: initialGameState() });
    setSession({ mode: 'daily', date: key, relaxed, locations, nonce: Date.now() });
    return setScreen('game');
  };

  const onProgress = useCallback((game) => {
    if (session?.mode !== 'daily') return;
    saveProgress({ date: session.date, mode: 'daily', relaxed: session.relaxed, locations: session.locations, game });
  }, [session]);

  const finish = (rounds) => {
    const { mode, date: key, relaxed } = session;
    const score = rounds.reduce((s, r) => s + r.score.total, 0);
    const game = {
      id: `${mode}-${Date.now()}`,
      date: key,
      mode,
      relaxed,
      dailyNo: mode === 'daily' ? dailyNumber(key) : null,
      score,
      avgDistanceKm: Math.round(rounds.reduce((s, r) => s + r.distanceKm, 0) / rounds.length),
      cluesUsed: rounds.reduce((s, r) => s + r.cluesUsed.length, 0),
      totalSeconds: rounds.reduce((s, r) => s + r.seconds, 0),
      grades: rounds.map((r) => r.grade),
      ...(mode === 'daily' ? { rounds } : {}),
    };
    addGame(game);
    if (mode === 'daily') clearProgress();
    setResult({ mode, rounds, relaxed, dateKey: key, dailyNo: game.dailyNo });
    setSession(null);
    setScreen('summary');
  };

  function navigate(target) {
    if (target === 'summary') {
      const done = findDaily(stats.games, dateKey());
      if (!done?.rounds) return setScreen('home');
      setResult({ mode: 'daily', rounds: done.rounds, relaxed: done.relaxed, dateKey: done.date, dailyNo: done.dailyNo });
    }
    return setScreen(target);
  }

  switch (screen) {
    case 'loading':
      return <div className="screen screen--center"><p className="muted">Finding Street View locations…</p></div>;
    case 'game':
      return (
        <GameScreen
          key={session.nonce}
          mode={session.mode}
          relaxed={session.relaxed}
          locations={session.locations}
          initial={session.initial}
          onProgress={onProgress}
          onFinish={finish}
          onQuit={() => { setSession(null); setScreen('home'); }}
        />
      );
    case 'summary':
      return <SummaryScreen result={result} onNavigate={navigate} onPractice={startPractice} />;
    case 'stats':
      return <StatsScreen onNavigate={navigate} />;
    default:
      return <HomeScreen onNavigate={navigate} onStartDaily={startDaily} onStartPractice={startPractice} />;
  }
}
