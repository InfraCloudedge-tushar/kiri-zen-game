import { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameMode, GameState, HudSnapshot, RunSummary } from '../game/types';

export const BACKDROP_IMAGE_PATH = '/src/assets/images/dojo_arena_backdrop_1795189520259.jpg';

interface GameCanvasProps {
  gameState: GameState;
  mode: GameMode;
  runNonce: number;
  onHudUpdate: (snapshot: HudSnapshot) => void;
  onGameOver: (summary: RunSummary) => void;
}

export function GameCanvas({
  gameState,
  mode,
  runNonce,
  onHudUpdate,
  onGameOver,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const callbacksRef = useRef({ onHudUpdate, onGameOver });

  callbacksRef.current = { onHudUpdate, onGameOver };

  // Initialize isolated engine and 60fps loop once
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const backdropImg = new Image();
    backdropImg.src = BACKDROP_IMAGE_PATH;

    const engine = new GameEngine(
      backdropImg,
      (snap) => callbacksRef.current.onHudUpdate(snap),
      (summary) => callbacksRef.current.onGameOver(summary)
    );
    engineRef.current = engine;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, rect.width);
      const h = Math.max(320, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.setDimensions(w, h);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      engine.update(rawDt);
      engine.render(ctx);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const handleBlur = () => {
      engine.handlePointerUp();
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('blur', handleBlur);
      engineRef.current = null;
    };
  }, []);

  // Start new run when runNonce increments
  useEffect(() => {
    if (runNonce > 0 && engineRef.current) {
      engineRef.current.startRun(mode);
    }
  }, [runNonce, mode]);

  // Sync pause state cleanly
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setPaused(gameState !== 'PLAYING');
    }
  }, [gameState]);

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: clientX, y: clientY };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#120d0b]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          const pt = toCanvasCoords(e.clientX, e.clientY);
          engineRef.current?.handlePointerDown(pt.x, pt.y);
        }}
        onPointerMove={(e) => {
          const pt = toCanvasCoords(e.clientX, e.clientY);
          engineRef.current?.handlePointerMove(pt.x, pt.y);
        }}
        onPointerUp={() => {
          engineRef.current?.handlePointerUp();
        }}
        onPointerCancel={() => {
          engineRef.current?.handlePointerUp();
        }}
      />
    </div>
  );
}
