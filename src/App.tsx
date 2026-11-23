import { useCallback, useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameHud } from './components/GameHud';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { TitleScreen } from './components/TitleScreen';
import { POWERUP_DURATIONS } from './game/catalog';
import { getSavedBestScore } from './game/GameEngine';
import { soundEngine } from './game/soundEngine';
import { GameMode, GameState, HudSnapshot, RunSummary } from './game/types';

const INITIAL_HUD: HudSnapshot = {
  score: 0,
  bestScore: 0,
  lives: 4,
  maxLives: 4,
  timeRemaining: 0,
  flowTier: 0,
  flowProgress: 0,
  flowStreak: 0,
  solarStacks: 0,
  totalMultiplier: 1,
  powerUps: {
    cryoRemaining: 0,
    cryoDuration: POWERUP_DURATIONS.cryo,
    solarRemaining: 0,
    solarDuration: POWERUP_DURATIONS.solar,
    solarStacks: 0,
    frenzyRemaining: 0,
    frenzyDuration: POWERUP_DURATIONS.frenzy,
    magnetRemaining: 0,
    magnetDuration: POWERUP_DURATIONS.magnet,
  },
  comboCount: 0,
  mission: null,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [mode, setMode] = useState<GameMode>('missions');
  const [runNonce, setRunNonce] = useState(0);
  const [muted, setMuted] = useState(false);
  const [hud, setHud] = useState<HudSnapshot>(() => ({
    ...INITIAL_HUD,
    bestScore: getSavedBestScore('missions'),
  }));
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);

  const startGame = useCallback(() => {
    soundEngine.unlock();
    setRunSummary(null);
    setGameState('PLAYING');
    setRunNonce((n) => n + 1);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') return 'PAUSED';
      if (prev === 'PAUSED') return 'PLAYING';
      return prev;
    });
  }, []);

  const handleGameOver = useCallback((summary: RunSummary) => {
    setRunSummary(summary);
    setGameState('GAME_OVER');
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === 'KeyM') {
        toggleMute();
        return;
      }

      if (gameState === 'TITLE_MENU') {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
      } else if (gameState === 'PLAYING') {
        if (e.code === 'Escape' || e.code === 'Space') {
          e.preventDefault();
          setGameState('PAUSED');
        }
      } else if (gameState === 'PAUSED') {
        if (e.code === 'Escape' || e.code === 'Space') {
          e.preventDefault();
          setGameState('PLAYING');
        }
      } else if (gameState === 'GAME_OVER') {
        if (e.code === 'Enter') {
          e.preventDefault();
          startGame();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, startGame, toggleMute]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#120d0b] text-[#f5efe6]">
      <GameCanvas
        gameState={gameState}
        mode={mode}
        runNonce={runNonce}
        onHudUpdate={setHud}
        onGameOver={handleGameOver}
      />

      {gameState === 'TITLE_MENU' && (
        <div className="relative z-20 w-full h-full">
          <TitleScreen
            selectedMode={mode}
            muted={muted}
            onSelectMode={setMode}
            onToggleMute={toggleMute}
            onStartGame={startGame}
          />
        </div>
      )}

      {gameState !== 'TITLE_MENU' && (
        <GameHud
          hud={hud}
          mode={mode}
          gameState={gameState}
          muted={muted}
          onToggleMute={toggleMute}
          onTogglePause={togglePause}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => setGameState('PLAYING')}
          onRestart={startGame}
          onMainMenu={() => setGameState('TITLE_MENU')}
        />
      )}

      {gameState === 'GAME_OVER' && runSummary && (
        <GameOverModal
          summary={runSummary}
          onPlayAgain={startGame}
          onMainMenu={() => setGameState('TITLE_MENU')}
        />
      )}
    </div>
  );
}
