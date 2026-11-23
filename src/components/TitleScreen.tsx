import { BookOpen, Volume2, VolumeX, X } from 'lucide-react';
import { useState } from 'react';
import { MODE_CONFIG } from '../game/catalog';
import { getSavedBestScore } from '../game/GameEngine';
import { GameMode } from '../game/types';
import { BACKDROP_IMAGE_PATH } from './GameCanvas';

interface TitleScreenProps {
  selectedMode: GameMode;
  muted: boolean;
  onSelectMode: (mode: GameMode) => void;
  onToggleMute: () => void;
  onStartGame: () => void;
}

const MODES: GameMode[] = ['missions', 'arcade', 'zen'];

export function TitleScreen({
  selectedMode,
  muted,
  onSelectMode,
  onToggleMute,
  onStartGame,
}: TitleScreenProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const activeCfg = MODE_CONFIG[selectedMode];
  const bestForMode = getSavedBestScore(selectedMode);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#120d0b]">
      {!imgFailed && (
        <img
          src={BACKDROP_IMAGE_PATH}
          alt="Warm dark cedar dojo training arena"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120d0b]/75 via-[#120d0b]/50 to-[#120d0b]/92" />

      {/* Top utility row */}
      <div className="relative z-10 flex items-center justify-end gap-2.5 p-5 sm:p-7">
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1310]/90 border border-[#f5efe6]/15 text-sm font-medium text-[#f5efe6] hover:bg-[#2a1f1a] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Missions, Stars &amp; Hazards</span>
        </button>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#1a1310]/90 border border-[#f5efe6]/15 text-[#f5efe6] hover:bg-[#2a1f1a] transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Lockup & Mode Selection */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        <svg
          viewBox="0 0 360 110"
          className="w-72 sm:w-88 h-auto mb-3"
          aria-label="Kiri-Zen Title Emblem"
        >
          <path
            d="M42 78 Q 180 18 318 30"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M72 30 Q 185 88 304 72"
            fill="none"
            stroke="#f5efe6"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.38"
          />
          <circle cx="180" cy="24" r="7" fill="#e11d48" />
          <text
            x="180"
            y="72"
            textAnchor="middle"
            fill="#f5efe6"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="700"
            fontSize="52"
            letterSpacing="2"
          >
            Kiri-Zen
          </text>
        </svg>

        <p className="text-sm sm:text-base text-[#dfd4c6] max-w-lg mb-8 leading-relaxed">
          Slice cosmic planets, orchard fruits, and harvest vegetables. Catch glowing stars for
          power-ups and dodge eclipse moons and flare suns.
        </p>

        {/* Segmented Mode Selector */}
        <div
          role="radiogroup"
          aria-label="Select game mode"
          className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1a1310]/95 border border-[#f5efe6]/14 mb-4"
        >
          {MODES.map((m) => {
            const active = m === selectedMode;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelectMode(m)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  active
                    ? 'bg-amber-500 text-[#120d0b]'
                    : 'text-[#d6cbbd] hover:text-[#f5efe6] hover:bg-[#261c18]'
                }`}
              >
                {MODE_CONFIG[m].label}
              </button>
            );
          })}
        </div>

        {/* Clean unboxed mode details */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#c7b9a7] mb-7">
          <span>{activeCfg.subtitle}</span>
          <span aria-hidden="true">·</span>
          <span>{activeCfg.hazardLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-amber-300">
            Best {bestForMode.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="px-10 py-4 rounded-xl bg-[#e11d48] hover:bg-[#be123c] active:scale-[0.98] text-[#fff8f5] font-semibold text-base tracking-wide transition-all shadow-lg shadow-rose-950/50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Start Game
        </button>
      </main>

      <footer className="relative z-10 pb-6 px-6 text-center">
        <p className="text-xs sm:text-sm text-[#b0a292] tracking-wide">
          Drag to Slice · Space Pause · M Mute · Enter Start
        </p>
      </footer>

      {/* Field Guide Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/75"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
        >
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1b1411] border border-[#f5efe6]/15 rounded-2xl p-6 text-left">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#f5efe6]/10">
              <h2 id="guide-title" className="font-display text-2xl font-bold text-[#f5efe6]">
                Missions, Star Power-Ups &amp; Hazards
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close guide"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#271d19] text-[#f5efe6] hover:bg-[#342722]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-6 text-sm text-[#d6cbbd]">
              <section>
                <h3 className="text-base font-semibold text-[#f5efe6] mb-2">
                  Mission Progression (4 Lives)
                </h3>
                <ul className="space-y-1.5 leading-relaxed">
                  <li>
                    <strong className="text-amber-300">Mission 1 · Fruits:</strong> Slice 12
                    classic fruits (Yuzu, Matcha Melon, Pomegranate, Dragonfruit).
                  </li>
                  <li>
                    <strong className="text-emerald-300">Mission 2 · Vegetables:</strong> Slice 16
                    vegetables (Carrot, Daikon, Broccoli, Eggplant, Golden Bell Pepper).
                  </li>
                  <li>
                    <strong className="text-rose-300">Mission 3 · New Fruits:</strong> Slice 20
                    tropical fruits (Mango, Lychee, Kiwi, Mangosteen, 2-hit Armored Durian).
                  </li>
                  <li>
                    <strong className="text-sky-300">Mission 4 · Planets:</strong> Slice 24 cosmic
                    worlds (Mercury, Mars, Jupiter, Saturn, Neptune, 2-hit Obsidian Planetoid) with
                    dusty blast clouds.
                  </li>
                  <li>
                    <strong className="text-purple-300">Mission 5+ · Escalating Mix:</strong>{' '}
                    Blended realms with rising speed and +1 life restored on every cleared mission.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#f5efe6] mb-2">Star Power-Ups</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#231a16] border border-[#f5efe6]/10">
                    <div className="font-semibold text-sky-300">Frost Star</div>
                    <p className="text-xs text-[#c7b9a7] mt-1">
                      Slows airborne targets to 0.44× speed for 7s and adds +1× Flow bonus.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#231a16] border border-[#f5efe6]/10">
                    <div className="font-semibold text-amber-300">Solaris Star</div>
                    <p className="text-xs text-[#c7b9a7] mt-1">
                      Doubles score output (2×) for 8s and shatters armored targets in 1 slice.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#231a16] border border-[#f5efe6]/10">
                    <div className="font-semibold text-orange-300">Nova Star</div>
                    <p className="text-xs text-[#c7b9a7] mt-1">
                      Launches a 5.5s dual-side cosmic barrage with zero hazards.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#231a16] border border-[#f5efe6]/10">
                    <div className="font-semibold text-emerald-300">Gravity Star</div>
                    <p className="text-xs text-[#c7b9a7] mt-1">
                      Pulls airborne targets toward center-arc and widens your slice radius.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#f5efe6] mb-2">
                  Hazards &amp; Multipliers
                </h3>
                <ul className="space-y-1.5 leading-relaxed">
                  <li>
                    <strong className="text-rose-400">Eclipse Moon &amp; Flare Sun:</strong>{' '}
                    Avoid slicing them! They cost 1 Life in Missions (-15 pts in Arcade) and reset
                    your Flow streak.
                  </li>
                  <li>
                    <strong className="text-emerald-300">Balanced Multipliers:</strong> Build Flow
                    from 1× up to 5×, earn +2 pts on center Critical Cuts, and trigger Blitz bonuses
                    for 3+ hit swipes.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
