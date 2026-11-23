import { GameMode, ItemKind, ItemSpec } from './types';

export const ITEM_SPECS: Record<ItemKind, ItemSpec> = {
  // --- Mission 1: Classic Fruits (low balanced points) ---
  yuzu: {
    kind: 'yuzu',
    name: 'Yuzu Citrus',
    category: 'fruit',
    radius: 34,
    points: 1,
    weight: 0.9,
    outerColor: '#eab308',
    innerColor: '#fef08a',
    accentColor: '#65a30d',
    dustColor: '#fde047',
  },
  melon: {
    kind: 'melon',
    name: 'Matcha Melon',
    category: 'fruit',
    radius: 44,
    points: 2,
    weight: 1.18,
    outerColor: '#15803d',
    innerColor: '#bbf7d0',
    accentColor: '#052e16',
    dustColor: '#86efac',
  },
  pomegranate: {
    kind: 'pomegranate',
    name: 'Blood Pomegranate',
    category: 'fruit',
    radius: 37,
    points: 2,
    weight: 1.0,
    outerColor: '#9f1239',
    innerColor: '#fda4af',
    accentColor: '#e11d48',
    dustColor: '#fb7185',
  },
  dragonfruit: {
    kind: 'dragonfruit',
    name: 'Star Dragonfruit',
    category: 'fruit',
    radius: 39,
    points: 3,
    weight: 0.95,
    outerColor: '#db2777',
    innerColor: '#fdf2f8',
    accentColor: '#84cc16',
    dustColor: '#f472b6',
  },

  // --- Mission 2: Planets ---
  mercury: {
    kind: 'mercury',
    name: 'Mercury',
    category: 'planet',
    radius: 32,
    points: 2,
    weight: 0.95,
    outerColor: '#94a3b8',
    innerColor: '#e2e8f0',
    accentColor: '#475569',
    dustColor: '#cbd5e1',
  },
  mars: {
    kind: 'mars',
    name: 'Mars',
    category: 'planet',
    radius: 36,
    points: 2,
    weight: 1.0,
    outerColor: '#dc2626',
    innerColor: '#fed7aa',
    accentColor: '#7c2d12',
    dustColor: '#fb923c',
  },
  jupiter: {
    kind: 'jupiter',
    name: 'Jupiter',
    category: 'planet',
    radius: 46,
    points: 3,
    weight: 1.22,
    outerColor: '#d97706',
    innerColor: '#fef3c7',
    accentColor: '#9a3412',
    dustColor: '#fdba74',
  },
  saturn: {
    kind: 'saturn',
    name: 'Saturn',
    category: 'planet',
    radius: 40,
    points: 3,
    weight: 1.05,
    outerColor: '#eab308',
    innerColor: '#fef9c3',
    accentColor: '#a16207',
    dustColor: '#fde047',
  },
  neptune: {
    kind: 'neptune',
    name: 'Neptune',
    category: 'planet',
    radius: 38,
    points: 3,
    weight: 1.02,
    outerColor: '#2563eb',
    innerColor: '#bfdbfe',
    accentColor: '#1e3a8a',
    dustColor: '#60a5fa',
  },
  planetoid: {
    kind: 'planetoid',
    name: 'Obsidian Planetoid',
    category: 'planet',
    radius: 43,
    points: 5,
    weight: 1.28,
    outerColor: '#334155',
    innerColor: '#c084fc',
    accentColor: '#38bdf8',
    dustColor: '#a855f7',
    maxHp: 2,
  },

  // --- Mission 3: Vegetables ---
  carrot: {
    kind: 'carrot',
    name: 'Crimson Carrot',
    category: 'vegetable',
    radius: 35,
    points: 2,
    weight: 0.92,
    outerColor: '#ea580c',
    innerColor: '#fed7aa',
    accentColor: '#16a34a',
    dustColor: '#fb923c',
  },
  daikon: {
    kind: 'daikon',
    name: 'Daikon Radish',
    category: 'vegetable',
    radius: 36,
    points: 2,
    weight: 0.96,
    outerColor: '#f1f5f9',
    innerColor: '#ffffff',
    accentColor: '#22c55e',
    dustColor: '#e2e8f0',
  },
  broccoli: {
    kind: 'broccoli',
    name: 'Jade Broccoli',
    category: 'vegetable',
    radius: 39,
    points: 3,
    weight: 0.95,
    outerColor: '#15803d',
    innerColor: '#dcfce7',
    accentColor: '#14532d',
    dustColor: '#4ade80',
  },
  eggplant: {
    kind: 'eggplant',
    name: 'Velvet Eggplant',
    category: 'vegetable',
    radius: 38,
    points: 3,
    weight: 1.05,
    outerColor: '#6b21a8',
    innerColor: '#f3e8ff',
    accentColor: '#15803d',
    dustColor: '#c084fc',
  },
  bell_pepper: {
    kind: 'bell_pepper',
    name: 'Golden Bell Pepper',
    category: 'vegetable',
    radius: 37,
    points: 3,
    weight: 0.9,
    outerColor: '#facc15',
    innerColor: '#fef9c3',
    accentColor: '#15803d',
    dustColor: '#fde047',
  },

  // --- Mission 4: New Tropical Fruits ---
  mango: {
    kind: 'mango',
    name: 'Golden Mango',
    category: 'new_fruit',
    radius: 37,
    points: 2,
    weight: 0.98,
    outerColor: '#f59e0b',
    innerColor: '#fef08a',
    accentColor: '#ef4444',
    dustColor: '#fbbf24',
  },
  lychee: {
    kind: 'lychee',
    name: 'Royal Lychee',
    category: 'new_fruit',
    radius: 31,
    points: 3,
    weight: 0.86,
    outerColor: '#e11d48',
    innerColor: '#fff1f2',
    accentColor: '#881337',
    dustColor: '#fda4af',
  },
  kiwi: {
    kind: 'kiwi',
    name: 'Emerald Kiwi',
    category: 'new_fruit',
    radius: 33,
    points: 2,
    weight: 0.9,
    outerColor: '#78350f',
    innerColor: '#bef264',
    accentColor: '#365314',
    dustColor: '#a3e635',
  },
  mangosteen: {
    kind: 'mangosteen',
    name: 'Ruby Mangosteen',
    category: 'new_fruit',
    radius: 35,
    points: 3,
    weight: 0.95,
    outerColor: '#581c87',
    innerColor: '#faf5ff',
    accentColor: '#65a30d',
    dustColor: '#d8b4fe',
  },
  durian: {
    kind: 'durian',
    name: 'Armored Durian',
    category: 'new_fruit',
    radius: 44,
    points: 5,
    weight: 1.25,
    outerColor: '#65a30d',
    innerColor: '#fef08a',
    accentColor: '#365314',
    dustColor: '#bef264',
    maxHp: 2,
  },

  // --- Star Power-Ups ---
  frost_star: {
    kind: 'frost_star',
    name: 'Frost Star',
    category: 'powerup',
    radius: 36,
    points: 3,
    weight: 0.84,
    outerColor: '#0ea5e9',
    innerColor: '#e0f2fe',
    accentColor: '#7dd3fc',
    dustColor: '#38bdf8',
    powerUp: 'cryo',
  },
  solar_star: {
    kind: 'solar_star',
    name: 'Solaris Star',
    category: 'powerup',
    radius: 36,
    points: 3,
    weight: 0.84,
    outerColor: '#f59e0b',
    innerColor: '#fef9c3',
    accentColor: '#fbbf24',
    dustColor: '#fde047',
    powerUp: 'solar',
  },
  nova_star: {
    kind: 'nova_star',
    name: 'Nova Star',
    category: 'powerup',
    radius: 38,
    points: 3,
    weight: 0.82,
    outerColor: '#ea580c',
    innerColor: '#ffedd5',
    accentColor: '#fb923c',
    dustColor: '#fb923c',
    powerUp: 'frenzy',
  },
  gravity_star: {
    kind: 'gravity_star',
    name: 'Gravity Star',
    category: 'powerup',
    radius: 36,
    points: 3,
    weight: 0.82,
    outerColor: '#10b981',
    innerColor: '#d1fae5',
    accentColor: '#34d399',
    dustColor: '#34d399',
    powerUp: 'magnet',
  },

  // --- Hazards: Eclipse Moon & Flare Sun ---
  eclipse_moon: {
    kind: 'eclipse_moon',
    name: 'Eclipse Moon',
    category: 'hazard',
    radius: 39,
    points: 0,
    weight: 1.12,
    outerColor: '#334155',
    innerColor: '#94a3b8',
    accentColor: '#ef4444',
    dustColor: '#64748b',
  },
  flare_sun: {
    kind: 'flare_sun',
    name: 'Flare Sun',
    category: 'hazard',
    radius: 41,
    points: 0,
    weight: 1.15,
    outerColor: '#dc2626',
    innerColor: '#fde047',
    accentColor: '#f97316',
    dustColor: '#f97316',
  },
};

export const CLASSIC_FRUIT_KINDS: ItemKind[] = ['yuzu', 'melon', 'pomegranate', 'dragonfruit'];
export const PLANET_KINDS: ItemKind[] = ['mercury', 'mars', 'jupiter', 'saturn', 'neptune', 'planetoid'];
export const VEGETABLE_KINDS: ItemKind[] = ['carrot', 'daikon', 'broccoli', 'eggplant', 'bell_pepper'];
export const NEW_FRUIT_KINDS: ItemKind[] = ['mango', 'lychee', 'kiwi', 'mangosteen', 'durian'];
export const STAR_POWERUP_KINDS: ItemKind[] = ['frost_star', 'solar_star', 'nova_star', 'gravity_star'];

export interface MissionBlueprint {
  missionNumber: number;
  title: string;
  themeLabel: string;
  targetCount: number;
  itemPool: ItemKind[];
  hazardChance: number;
  speedScale: number;
  waveMin: number;
  waveMax: number;
  waveInterval: number;
}

export function getMissionBlueprint(missionNumber: number): MissionBlueprint {
  const index = Math.max(1, missionNumber);
  if (index === 1) {
    return {
      missionNumber: 1,
      title: 'Orchard Awakening',
      themeLabel: 'Fruits',
      targetCount: 12,
      itemPool: CLASSIC_FRUIT_KINDS,
      hazardChance: 0.08,
      speedScale: 0.92,
      waveMin: 2,
      waveMax: 3,
      waveInterval: 2.3,
    };
  }
  if (index === 2) {
    return {
      missionNumber: 2,
      title: 'Harvest Dojo',
      themeLabel: 'Vegetables',
      targetCount: 16,
      itemPool: VEGETABLE_KINDS,
      hazardChance: 0.13,
      speedScale: 0.98,
      waveMin: 2,
      waveMax: 4,
      waveInterval: 2.1,
    };
  }
  if (index === 3) {
    return {
      missionNumber: 3,
      title: 'Exotic Groves',
      themeLabel: 'New Fruits',
      targetCount: 20,
      itemPool: NEW_FRUIT_KINDS,
      hazardChance: 0.16,
      speedScale: 1.04,
      waveMin: 3,
      waveMax: 5,
      waveInterval: 1.95,
    };
  }
  if (index === 4) {
    return {
      missionNumber: 4,
      title: 'Orbital Drift',
      themeLabel: 'Planets',
      targetCount: 24,
      itemPool: PLANET_KINDS,
      hazardChance: 0.19,
      speedScale: 1.1,
      waveMin: 3,
      waveMax: 5,
      waveInterval: 1.8,
    };
  }

  // Mission 5+: Slowly escalating themed & mixed cosmic missions
  const cycle = (index - 5) % 4;
  const extraSteps = index - 5;
  const targetCount = 28 + extraSteps * 4;
  const hazardChance = Math.min(0.28, 0.21 + extraSteps * 0.015);
  const speedScale = Math.min(1.38, 1.14 + extraSteps * 0.04);
  const waveInterval = Math.max(1.15, 1.72 - extraSteps * 0.07);
  const waveMin = Math.min(4, 3 + Math.floor(extraSteps / 3));
  const waveMax = Math.min(7, 5 + Math.floor(extraSteps / 2));

  if (cycle === 0) {
    return {
      missionNumber: index,
      title: 'Cosmic Fusion',
      themeLabel: 'Fruits & Planets',
      targetCount,
      itemPool: [...CLASSIC_FRUIT_KINDS, ...PLANET_KINDS],
      hazardChance,
      speedScale,
      waveMin,
      waveMax,
      waveInterval,
    };
  }
  if (cycle === 1) {
    return {
      missionNumber: index,
      title: 'Grand Harvest',
      themeLabel: 'Veggies & New Fruits',
      targetCount,
      itemPool: [...VEGETABLE_KINDS, ...NEW_FRUIT_KINDS],
      hazardChance,
      speedScale,
      waveMin,
      waveMax,
      waveInterval,
    };
  }
  if (cycle === 2) {
    return {
      missionNumber: index,
      title: 'Deep Nebula',
      themeLabel: 'Outer Planets',
      targetCount,
      itemPool: PLANET_KINDS,
      hazardChance,
      speedScale,
      waveMin,
      waveMax,
      waveInterval,
    };
  }
  return {
    missionNumber: index,
    title: 'Supernova Zenith',
    themeLabel: 'All Realms Mix',
    targetCount,
    itemPool: [
      ...CLASSIC_FRUIT_KINDS,
      ...VEGETABLE_KINDS,
      ...NEW_FRUIT_KINDS,
      ...PLANET_KINDS,
    ],
    hazardChance,
    speedScale,
    waveMin,
    waveMax,
    waveInterval,
  };
}

// Restrained Flow Tiers (max 5x so scores remain grounded and readable)
export const FLOW_TIERS = [
  { multiplier: 1, threshold: 0, label: 'Calm' },
  { multiplier: 2, threshold: 6, label: 'Steady' },
  { multiplier: 3, threshold: 14, label: 'Focused' },
  { multiplier: 4, threshold: 25, label: 'Fierce' },
  { multiplier: 5, threshold: 38, label: 'Zen Master' },
] as const;

export const MODE_CONFIG: Record<
  GameMode,
  {
    label: string;
    subtitle: string;
    durationSeconds: number;
    maxLives: number;
    hazardLabel: string;
  }
> = {
  missions: {
    label: 'Missions',
    subtitle: '4 Lives · Fruits -> Vegetables -> New Fruits -> Planets & beyond',
    durationSeconds: 0,
    maxLives: 4,
    hazardLabel: 'Moon & Sun hazards cost 1 life',
  },
  arcade: {
    label: 'Arcade',
    subtitle: '60s Cosmic Mix · Planets, fruits & veggies with scaling pace',
    durationSeconds: 60,
    maxLives: 0,
    hazardLabel: 'Moon & Sun cost -15 pts & break streak',
  },
  zen: {
    label: 'Zen',
    subtitle: '90s Endless Mix · All realms blended with zero hazards',
    durationSeconds: 90,
    maxLives: 0,
    hazardLabel: 'No Moon or Sun hazards',
  },
};

export const POWERUP_DURATIONS = {
  cryo: 7.0,
  solar: 8.0,
  frenzy: 5.5,
  magnet: 7.5,
} as const;
