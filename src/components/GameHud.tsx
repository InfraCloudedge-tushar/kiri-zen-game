import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { FLOW_TIERS } from '../game/catalog';
import { GameMode, GameState, HudSnapshot } from '../game/types';

interface GameHudProps {
  hud: HudSnapshot;
  mode: GameMode;
  gameState: GameState;
  muted: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
}

export function GameHud({
  hud,
  mode,
  gameState,
  muted,
  onToggleMute,
  onTogglePause,
}: GameHudProps) {
  const flowTierInfo = FLOW_TIERS[hud.flowTier] ?? FLOW_TIERS[0];
  const isSolar = hud.powerUps.solarRemaining > 0;
  const isCryo = hud.powerUps.cryoRemaining > 0;
  const isFrenzy = hud.powerUps.frenzyRemaining > 0;
  const isMagnet = hud.powerUps.magnetRemaining > 0;

  const formatTime = (secs: number) => {
    const s = Math.ceil(secs);
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const activePowerUps = [
    isCryo && {
      key: 'cryo',
      label: 'Frost Star',
      remaining: hud.powerUps.cryoRemaining,
      duration: hud.powerUps.cryoDuration,
      barColor: 'bg-sky-400',
      textColor: 'text-sky-300',
    },
    isSolar && {
      key: 'solar',
      label: 'Solaris Star 2×',
      remaining: hud.powerUps.solarRemaining,
      duration: hud.powerUps.solarDuration,
      barColor: 'bg-amber-400',
      textColor: 'text-amber-300',
    },
    isFrenzy && {
      key: 'frenzy',
      label: 'Nova Star',
      remaining: hud.powerUps.frenzyRemaining,
      duration: hud.powerUps.frenzyDuration,
      barColor: 'bg-orange-400',
      textColor: 'text-orange-300',
    },
    isMagnet && {
      key: 'magnet',
      label: 'Gravity Star',
      remaining: hud.powerUps.magnetRemaining,
      duration: hud.powerUps.magnetDuration,
      barColor: 'bg-emerald-400',
      textColor: 'text-emerald-300',
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    remaining: number;
    duration: number;
    barColor: string;
    textColor: string;
  }>;

  const missionPct = hud.mission
    ? Math.max(0.03, Math.min(1, hud.mission.slicedInMission / hud.mission.targetInMission))
    : 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Perimeter Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-Left: Score + Flow Multiplier */}
        <div className="flex flex-col gap-2 bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-xl px-4 py-3 min-w-[196px]">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs font-medium text-[#d6cbbd]">Score</span>
            <span className="text-xs font-mono tabular-nums text-[#a89b8c]">
              Best {hud.bestScore.toLocaleString()}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-mono font-bold tabular-nums tracking-tight text-[#f5efe6]">
              {hud.score.toLocaleString()}
            </span>
            <span
              className={`font-mono text-sm font-bold tabular-nums ${
                isSolar
                  ? 'text-amber-300'
                  : hud.totalMultiplier >= 4
                    ? 'text-orange-300'
                    : hud.totalMultiplier >= 2
                      ? 'text-emerald-300'
                      : 'text-[#d6cbbd]'
              }`}
            >
              ×{hud.totalMultiplier}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-[#c7b9a7]">
              <span>Flow · {flowTierInfo.label}</span>
              <span className="font-mono tabular-nums">{hud.flowStreak} streak</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#2c211d] overflow-hidden">
              <div
                className={`h-full transition-transform duration-150 origin-left ${
                  isSolar ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ transform: `scaleX(${Math.max(0.04, hud.flowProgress)})` }}
              />
            </div>
          </div>
        </div>

        {/* Top-Center: Mission Objective or Active Star Power-ups */}
        <div className="hidden md:flex flex-col items-center gap-2">
          {hud.mission && (
            <div className="bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-xl px-4 py-2.5 min-w-[240px]">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="font-semibold text-amber-300">
                  Mission {hud.mission.missionNumber} · {hud.mission.themeLabel}
                </span>
                <span className="font-mono tabular-nums text-[#f5efe6]">
                  {hud.mission.slicedInMission}/{hud.mission.targetInMission}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#2c211d] overflow-hidden">
                <div
                  className="h-full bg-amber-400 origin-left transition-transform duration-150"
                  style={{ transform: `scaleX(${missionPct})` }}
                />
              </div>
            </div>
          )}

          {activePowerUps.length > 0 && (
            <div className="flex items-center gap-2.5">
              {activePowerUps.map((p) => {
                const pct = Math.max(0, Math.min(1, p.remaining / p.duration));
                return (
                  <div
                    key={p.key}
                    className="bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-lg px-3 py-1.5 min-w-[136px]"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className={`font-semibold whitespace-nowrap ${p.textColor}`}>
                        {p.label}
                      </span>
                      <span className="font-mono tabular-nums text-[#e7ddd0]">
                        {p.remaining.toFixed(1)}s
                      </span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[#2c211d] overflow-hidden">
                      <div
                        className={`h-full origin-left ${p.barColor}`}
                        style={{ transform: `scaleX(${pct})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top-Right: Lives / Timer + Audio / Pause */}
        <div className="flex items-center gap-2.5">
          {mode === 'missions' ? (
            <div
              className="flex items-center gap-2 bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-xl px-3.5 py-2.5"
              aria-label={`Lives remaining: ${hud.lives} of ${hud.maxLives}`}
            >
              <span className="text-xs font-medium text-[#d6cbbd] mr-0.5">Lives</span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: hud.maxLives }).map((_, idx) => {
                  const alive = idx < hud.lives;
                  return (
                    <svg
                      key={idx}
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 transition-opacity duration-150 ${
                        alive ? 'text-rose-500 opacity-100' : 'text-[#44352f] opacity-55'
                      }`}
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-xl px-4 py-2.5">
              <span className="text-xs font-medium text-[#d6cbbd]">Time</span>
              <span
                className={`font-mono text-xl font-bold tabular-nums ${
                  hud.timeRemaining <= 10 ? 'text-rose-400' : 'text-[#f5efe6]'
                }`}
              >
                {formatTime(hud.timeRemaining)}
              </span>
            </div>
          )}

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#16100e]/90 border border-[#f5efe6]/14 text-[#f5efe6] hover:bg-[#261c18] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onTogglePause}
              aria-label={gameState === 'PAUSED' ? 'Resume game' : 'Pause game'}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#16100e]/90 border border-[#f5efe6]/14 text-[#f5efe6] hover:bg-[#261c18] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              {gameState === 'PAUSED' ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Mission / Power-up strip at bottom-left */}
      {(hud.mission || activePowerUps.length > 0) && (
        <div className="flex md:hidden flex-wrap gap-2">
          {hud.mission && (
            <div className="bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2">
              <span className="font-semibold text-amber-300">
                M{hud.mission.missionNumber} · {hud.mission.themeLabel}
              </span>
              <span className="font-mono tabular-nums text-[#f5efe6]">
                {hud.mission.slicedInMission}/{hud.mission.targetInMission}
              </span>
            </div>
          )}
          {activePowerUps.map((p) => (
            <div
              key={p.key}
              className="bg-[#16100e]/88 border border-[#f5efe6]/12 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
            >
              <span className={`font-semibold ${p.textColor}`}>{p.label}</span>
              <span className="font-mono tabular-nums text-[#e7ddd0]">
                {p.remaining.toFixed(1)}s
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
