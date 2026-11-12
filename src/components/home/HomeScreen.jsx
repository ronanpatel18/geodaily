import AppHeader from '../common/AppHeader';
import DailyCard from './DailyCard';
import PracticeCard from './PracticeCard';
import QuickStats from './QuickStats';
import { useApp } from '../../context/AppContext';
import { computeSummary, findDaily } from '../../lib/stats';
import { dailyNumber, dateKey, longDate } from '../../lib/format';
import { loadProgress } from '../../lib/progress';

export default function HomeScreen({ onNavigate, onStartDaily, onStartPractice }) {
  const { stats, settings } = useApp();
  const todayKey = dateKey();
  const summary = computeSummary(stats.games, todayKey);
  const completed = !!findDaily(stats.games, todayKey)?.rounds;
  const progress = completed ? null : loadProgress(todayKey);

  return (
    <div className="screen">
      <AppHeader variant="home" onNavigate={onNavigate} onPractice={onStartPractice} />
      <main className="container">
        <div className="eyebrow">{longDate(todayKey)}</div>
        <h1>Ready for today's challenge?</h1>
        <div className="home-grid">
          <DailyCard
            todayKey={todayKey}
            dailyNo={dailyNumber(todayKey)}
            completed={completed}
            resumeRound={progress ? progress.game.roundIndex + 1 : null}
            relaxed={settings.relaxed}
            onStart={onStartDaily}
            onViewSummary={() => onNavigate('summary')}
          />
          <PracticeCard onPlay={onStartPractice} />
        </div>
        <QuickStats summary={summary} units={settings.units} onViewStats={() => onNavigate('stats')} />
      </main>
    </div>
  );
}
