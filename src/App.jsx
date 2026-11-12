import { useState } from 'react';
import HomeScreen from './components/home/HomeScreen';
import GameScreen from './components/game/GameScreen';
import SummaryScreen from './components/summary/SummaryScreen';
import StatsScreen from './components/stats/StatsScreen';
import { useApp } from './context/AppContext';
import { getDailyLocations, getPracticeLocations } from './lib/locations';
import { findDaily } from './lib/stats';
import { dailyNumber, dateKey } from './lib/format';
import { hasStreetView, snapAll } from './lib/streetview';

/** Lightweight screen state machine: home | game | summary | stats */
export default function App() {
  const { stats, addGame } = useApp();
  const [screen, setScreen] = useState('home');
  const [session, setSession] = useState(null); // active game: { mode, locations, nonce }
  const [result, setResult] = useState(null);

  // Snap the five locations to real panoramas before the first round so scoring uses their true position.
  const start = async (mode) => {
    const key = dateKey();
    const picked = mode === 'daily' ? getDailyLocations(key) : getPracticeLocations();
    let locations = picked;
    if (hasStreetView) {
      setScreen('loading');
      locations = await snapAll(picked);
    }
    setSession({ mode, locations, nonce: Date.now() });
    setScreen('game');
  };

  const startDaily = () => {
    const done = findDaily(stats.games, dateKey());
    if (done?.rounds) return navigate('summary');
    return start('daily');
  };

  const finish = (rounds) => {
    const key = dateKey();
    const mode = session.mode;
    const score = rounds.reduce((s, r) => s + r.score.total, 0);
    const game = {
      id: `${mode}-${Date.now()}`,
      date: key,
      mode,
      dailyNo: mode === 'daily' ? dailyNumber(key) : null,
      score,
      avgDistanceKm: Math.round(rounds.reduce((s, r) => s + r.distanceKm, 0) / rounds.length),
      cluesUsed: rounds.reduce((s, r) => s + r.cluesUsed.length, 0),
      totalSeconds: rounds.reduce((s, r) => s + r.seconds, 0),
      grades: rounds.map((r) => r.grade),
      ...(mode === 'daily' ? { rounds } : {}),
    };
    addGame(game);
    setResult({ mode, rounds, dateKey: key, dailyNo: game.dailyNo });
    setSession(null);
    setScreen('summary');
  };

  function navigate(target) {
    if (target === 'summary') {
      const done = findDaily(stats.games, dateKey());
      if (!done?.rounds) return setScreen('home');
      setResult({ mode: 'daily', rounds: done.rounds, dateKey: done.date, dailyNo: done.dailyNo });
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
          locations={session.locations}
          onFinish={finish}
          onQuit={() => { setSession(null); setScreen('home'); }}
        />
      );
    case 'summary':
      return <SummaryScreen result={result} onNavigate={navigate} onPractice={() => start('practice')} />;
    case 'stats':
      return <StatsScreen onNavigate={navigate} />;
    default:
      return <HomeScreen onNavigate={navigate} onStartDaily={startDaily} onStartPractice={() => start('practice')} />;
  }
}
