interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function PauseModal({ onResume, onRestart, onMainMenu }: PauseModalProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-sm bg-[#1b1411] border border-[#f5efe6]/15 rounded-2xl p-6 text-center">
        <h2 id="pause-title" className="font-display text-2xl font-bold text-[#f5efe6]">
          Dojo Paused
        </h2>
        <p className="text-sm text-[#c7b9a7] mt-1.5 mb-6">
          Take a breath before returning to the blade.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#120d0b] font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-xl bg-[#271d19] hover:bg-[#332621] border border-[#f5efe6]/12 text-[#f5efe6] font-medium text-sm transition-colors whitespace-nowrap"
          >
            Restart Run
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="w-full py-3 px-6 rounded-xl bg-transparent hover:bg-[#271d19] text-[#c7b9a7] hover:text-[#f5efe6] font-medium text-sm transition-colors whitespace-nowrap"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
