import { MODE_CONFIG } from '../game/catalog';
import { RunSummary } from '../game/types';

interface GameOverModalProps {
  summary: RunSummary;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function GameOverModal({ summary, onPlayAgain, onMainMenu }: GameOverModalProps) {
  const modeLabel = MODE_CONFIG[summary.mode].label;
  const endReason =
    summary.endedBy === 'hazard'
      ? 'Solar / Lunar hazard hit'
      : summary.endedBy === 'lives'
        ? 'Out of lives'
        : 'Time complete';

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
    >
      <div className="w-full max-w-md bg-[#1b1411] border border-[#f5efe6]/15 rounded-2xl p-6 sm:p-7 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-[#c7b9a7] mb-1">
          <span>{modeLabel} Mode</span>
          <span aria-hidden="true">·</span>
          <span>{endReason}</span>
        </div>

        <h2 id="gameover-title" className="font-display text-3xl font-bold text-[#f5efe6]">
          {summary.endedBy === 'time' ? 'Session Complete' : 'Run Ended'}
        </h2>

        <div className="mt-5 py-4 border-y border-[#f5efe6]/10">
          <div className="text-xs text-[#c7b9a7]">Final Score</div>
          <div className="font-mono text-4xl font-bold tabular-nums text-amber-400 mt-1">
            {summary.score.toLocaleString()}
          </div>
          <div className="mt-1.5 text-xs font-mono tabular-nums text-[#b0a292]">
            {summary.isNewBest
              ? 'New Personal Best'
              : `Best ${summary.bestScore.toLocaleString()}`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 my-5 text-left text-sm">
          {summary.mode === 'missions' && (
            <div className="flex items-baseline justify-between col-span-2 pb-2 border-b border-[#f5efe6]/10">
              <span className="text-[#b0a292]">Mission Reached</span>
              <span className="font-mono font-semibold tabular-nums text-amber-300">
                Mission {summary.missionReached}
              </span>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Items Sliced</span>
            <span className="font-mono font-semibold tabular-nums text-[#f5efe6]">
              {summary.itemsSliced}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Best Combo</span>
            <span className="font-mono font-semibold tabular-nums text-[#f5efe6]">
              {summary.bestCombo}×
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Critical Cuts</span>
            <span className="font-mono font-semibold tabular-nums text-amber-300">
              {summary.criticalCuts}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Peak Mult</span>
            <span className="font-mono font-semibold tabular-nums text-emerald-300">
              ×{summary.peakMultiplier}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Stars Used</span>
            <span className="font-mono font-semibold tabular-nums text-sky-300">
              {summary.starsActivated}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[#b0a292]">Armored Broken</span>
            <span className="font-mono font-semibold tabular-nums text-purple-300">
              {summary.armoredBroken}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 px-6 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-[#fff8f5] font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="flex-1 py-3 px-6 rounded-xl bg-[#271d19] hover:bg-[#332621] border border-[#f5efe6]/12 text-[#f5efe6] font-medium text-sm transition-colors whitespace-nowrap"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
