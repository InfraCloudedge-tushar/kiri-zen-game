export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameMode = 'missions' | 'arcade' | 'zen';

export type ItemCategory = 'fruit' | 'planet' | 'vegetable' | 'new_fruit' | 'powerup' | 'hazard';

export type PowerUpType = 'cryo' | 'solar' | 'frenzy' | 'magnet';

export type ItemKind =
  // Mission 1: Classic Fruits
  | 'yuzu'
  | 'melon'
  | 'pomegranate'
  | 'dragonfruit'
  // Mission 2: Planets
  | 'mercury'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'neptune'
  | 'planetoid'
  // Mission 3: Vegetables
  | 'carrot'
  | 'daikon'
  | 'broccoli'
  | 'eggplant'
  | 'bell_pepper'
  // Mission 4: New Tropical Fruits
  | 'mango'
  | 'lychee'
  | 'kiwi'
  | 'mangosteen'
  | 'durian'
  // Star Power-ups
  | 'frost_star'
  | 'solar_star'
  | 'nova_star'
  | 'gravity_star'
  // Hazards: Moon & Sun
  | 'eclipse_moon'
  | 'flare_sun';

export interface ItemSpec {
  kind: ItemKind;
  name: string;
  category: ItemCategory;
  radius: number;
  points: number;
  weight: number;
  outerColor: string;
  innerColor: string;
  accentColor: string;
  dustColor: string;
  powerUp?: PowerUpType;
  maxHp?: number;
}

export interface ActiveItem {
  id: number;
  kind: ItemKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vr: number;
  hp: number;
  maxHp: number;
  squashX: number;
  squashY: number;
  hitFlash: number;
  enteredScreen: boolean;
  spawnAge: number;
  sliceCooldown: number;
}

export interface SlicedHalf {
  kind: ItemKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vr: number;
  cutAngle: number;
  side: -1 | 1;
  alpha: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  growRate: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravityScale: number;
  shape: 'circle' | 'shard' | 'petal' | 'spark' | 'dust';
  rotation: number;
  vr: number;
}

export interface BoardStain {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  blobs: Array<{ dx: number; dy: number; r: number }>;
}

export interface FloatingCallout {
  x: number;
  y: number;
  vy: number;
  title: string;
  subtitle?: string;
  color: string;
  scale: number;
  life: number;
  maxLife: number;
}

export interface BladePoint {
  x: number;
  y: number;
  age: number;
}

export interface ActivePowerUpState {
  cryoRemaining: number;
  cryoDuration: number;
  solarRemaining: number;
  solarDuration: number;
  solarStacks: number;
  frenzyRemaining: number;
  frenzyDuration: number;
  magnetRemaining: number;
  magnetDuration: number;
}

export interface MissionProgress {
  missionNumber: number;
  title: string;
  themeLabel: string;
  slicedInMission: number;
  targetInMission: number;
}

export interface HudSnapshot {
  score: number;
  bestScore: number;
  lives: number;
  maxLives: number;
  timeRemaining: number;
  flowTier: number;
  flowProgress: number;
  flowStreak: number;
  solarStacks: number;
  totalMultiplier: number;
  powerUps: ActivePowerUpState;
  comboCount: number;
  mission: MissionProgress | null;
}

export interface RunSummary {
  mode: GameMode;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  itemsSliced: number;
  criticalCuts: number;
  bestCombo: number;
  peakMultiplier: number;
  starsActivated: number;
  armoredBroken: number;
  missionReached: number;
  endedBy: 'lives' | 'hazard' | 'time';
}
