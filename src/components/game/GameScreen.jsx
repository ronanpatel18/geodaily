import { useGame } from '../../hooks/useGame';
import GameHeader from './GameHeader';
import StreetViewPanel from './StreetViewPanel';
import CluePanel from './CluePanel';
import GuessMap from './GuessMap';
import RoundResultModal from './RoundResultModal';
import { useApp } from '../../context/AppContext';

export default function GameScreen({ mode, locations, onFinish, onQuit }) {
  const { settings } = useApp();
  const game = useGame({ locations, relaxed: settings.relaxed });
  const { phase, lastRound, isLastRound } = game;

  const handleNext = () => (isLastRound ? onFinish(game.rounds) : game.nextRound());

  return (
    <div className="screen screen--game">
      <GameHeader
        roundIndex={game.roundIndex}
        secondsLeft={game.secondsLeft}
        potential={game.potential}
        totalSoFar={game.totalSoFar}
        onQuit={onQuit}
      />
      <main className="game-grid" data-mode={mode}>
        <div className="game-grid__left">
          <StreetViewPanel location={game.location} roundNumber={game.roundIndex + 1} />
          <CluePanel location={game.location} used={game.cluesUsed} onReveal={game.revealClue} />
        </div>
        <GuessMap guess={game.guess} onGuess={game.setGuess} onSubmit={game.submit} disabled={phase !== 'guessing'} />
      </main>
      {phase === 'result' && lastRound && (
        <RoundResultModal
          round={lastRound}
          roundIndex={game.roundIndex}
          isLast={isLastRound}
          units={settings.units}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
