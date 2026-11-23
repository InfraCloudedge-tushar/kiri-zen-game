import {
  CLASSIC_FRUIT_KINDS,
  FLOW_TIERS,
  getMissionBlueprint,
  ITEM_SPECS,
  MissionBlueprint,
  MODE_CONFIG,
  NEW_FRUIT_KINDS,
  PLANET_KINDS,
  POWERUP_DURATIONS,
  STAR_POWERUP_KINDS,
  VEGETABLE_KINDS,
} from './catalog';
import { renderArena } from './renderer';
import { soundEngine } from './soundEngine';
import {
  ActiveItem,
  ActivePowerUpState,
  BladePoint,
  BoardStain,
  FloatingCallout,
  GameMode,
  HudSnapshot,
  ItemKind,
  Particle,
  PowerUpType,
  RunSummary,
  SlicedHalf,
} from './types';

const STORAGE_KEY_PREFIX = 'kiri_zen_v2_best_';

function getSavedBest(mode: GameMode): number {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${mode}`);
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function saveBest(mode: GameMode, score: number): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${mode}`, String(score));
  } catch {
    // Ignore storage quota errors
  }
}

function distPointToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 0.0001) {
    return Math.hypot(px - x1, py - y1);
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

export class GameEngine {
  private width = 1280;
  private height = 720;
  private mode: GameMode = 'missions';
  private paused = false;
  private ended = false;

  private score = 0;
  private bestScore = 0;
  private lives = 4;
  private maxLives = 4;
  private timeRemaining = 0;
  private elapsed = 0;
  private waveCount = 0;
  private nextWaveTimer = 0.6;
  private frenzySpawnTimer = 0;
  private missGraceTimer = 0;

  // Mission progression
  private currentMission = 1;
  private missionBlueprint: MissionBlueprint = getMissionBlueprint(1);
  private slicedInMission = 0;
  private missionTransitionTimer = 0;

  // Multipliers & combo state
  private flowStreak = 0;
  private flowTier = 0;
  private comboCount = 0;
  private comboTimer = 0;
  private comboLastX = 0;
  private comboLastY = 0;

  // Power-ups
  private powerUps: ActivePowerUpState = {
    cryoRemaining: 0,
    cryoDuration: POWERUP_DURATIONS.cryo,
    solarRemaining: 0,
    solarDuration: POWERUP_DURATIONS.solar,
    solarStacks: 0,
    frenzyRemaining: 0,
    frenzyDuration: POWERUP_DURATIONS.frenzy,
    magnetRemaining: 0,
    magnetDuration: POWERUP_DURATIONS.magnet,
  };

  // Run statistics
  private itemsSliced = 0;
  private criticalCuts = 0;
  private bestCombo = 0;
  private peakMultiplier = 1;
  private starsActivated = 0;
  private armoredBroken = 0;
  private nextItemId = 1;

  // Entities
  private items: ActiveItem[] = [];
  private halves: SlicedHalf[] = [];
  private particles: Particle[] = [];
  private stains: BoardStain[] = [];
  private callouts: FloatingCallout[] = [];
  private blade: BladePoint[] = [];

  // Pointer tracking
  private pointerActive = false;
  private prevPointerX = 0;
  private prevPointerY = 0;

  // Juice & feel
  private hitstopTimer = 0;
  private shakeMag = 0;
  private flashAlpha = 0;
  private hudEmitCooldown = 0;

  private backdropImg: HTMLImageElement | null = null;
  private onHudUpdate: (snapshot: HudSnapshot) => void;
  private onGameOver: (summary: RunSummary) => void;

  constructor(
    backdropImg: HTMLImageElement | null,
    onHudUpdate: (snapshot: HudSnapshot) => void,
    onGameOver: (summary: RunSummary) => void
  ) {
    this.backdropImg = backdropImg;
    this.onHudUpdate = onHudUpdate;
    this.onGameOver = onGameOver;
  }

  public setDimensions(width: number, height: number): void {
    this.width = Math.max(320, width);
    this.height = Math.max(320, height);
  }

  public startRun(mode: GameMode): void {
    this.mode = mode;
    const cfg = MODE_CONFIG[mode];
    this.paused = false;
    this.ended = false;
    this.score = 0;
    this.bestScore = getSavedBest(mode);
    this.lives = cfg.maxLives;
    this.maxLives = cfg.maxLives;
    this.timeRemaining = cfg.durationSeconds;
    this.elapsed = 0;
    this.waveCount = 0;
    this.nextWaveTimer = 0.75;
    this.frenzySpawnTimer = 0;
    this.missGraceTimer = 0;

    this.currentMission = 1;
    this.missionBlueprint = getMissionBlueprint(1);
    this.slicedInMission = 0;
    this.missionTransitionTimer = 0;

    this.flowStreak = 0;
    this.flowTier = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    this.powerUps = {
      cryoRemaining: 0,
      cryoDuration: POWERUP_DURATIONS.cryo,
      solarRemaining: 0,
      solarDuration: POWERUP_DURATIONS.solar,
      solarStacks: 0,
      frenzyRemaining: 0,
      frenzyDuration: POWERUP_DURATIONS.frenzy,
      magnetRemaining: 0,
      magnetDuration: POWERUP_DURATIONS.magnet,
    };

    this.itemsSliced = 0;
    this.criticalCuts = 0;
    this.bestCombo = 0;
    this.peakMultiplier = 1;
    this.starsActivated = 0;
    this.armoredBroken = 0;

    this.items = [];
    this.halves = [];
    this.particles = [];
    this.stains = [];
    this.callouts = [];
    this.blade = [];
    this.pointerActive = false;
    this.hitstopTimer = 0;
    this.shakeMag = 0;
    this.flashAlpha = 0;

    if (mode === 'missions') {
      this.addCallout(
        this.width * 0.5,
        this.height * 0.36,
        `MISSION 1 · ${this.missionBlueprint.themeLabel.toUpperCase()}`,
        `${this.missionBlueprint.title} · Slice ${this.missionBlueprint.targetCount}`,
        '#fde047',
        1.25
      );
    }

    this.emitHud();
  }

  public setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.pointerActive = false;
      this.blade = [];
    }
  }

  public handlePointerDown(x: number, y: number): void {
    if (this.paused || this.ended) return;
    soundEngine.unlock();
    this.pointerActive = true;
    this.prevPointerX = x;
    this.prevPointerY = y;
    this.blade.push({ x, y, age: 0 });
  }

  public handlePointerMove(x: number, y: number): void {
    if (this.paused || this.ended || !this.pointerActive) return;

    const dx = x - this.prevPointerX;
    const dy = y - this.prevPointerY;
    const dist = Math.hypot(dx, dy);

    if (dist < 2) return;

    this.blade.push({ x, y, age: 0 });
    if (this.blade.length > 26) {
      this.blade.shift();
    }

    if (dist > 14) {
      soundEngine.playWhoosh(Math.min(1.5, dist / 65));
    }

    this.checkSliceSegment(this.prevPointerX, this.prevPointerY, x, y);

    this.prevPointerX = x;
    this.prevPointerY = y;
  }

  public handlePointerUp(): void {
    this.pointerActive = false;
    this.flushComboIfReady();
  }

  public update(rawDt: number): void {
    if (this.paused) return;

    const dt = Math.min(rawDt, 0.05);

    for (let i = this.blade.length - 1; i >= 0; i--) {
      this.blade[i].age += dt;
      if (this.blade[i].age > 0.14) {
        this.blade.splice(i, 1);
      }
    }

    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - dt);
      return;
    }

    this.elapsed += dt;
    this.shakeMag = Math.max(0, this.shakeMag - dt * 42);
    this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.8);
    this.missGraceTimer = Math.max(0, this.missGraceTimer - dt);
    this.missionTransitionTimer = Math.max(0, this.missionTransitionTimer - dt);

    if (this.ended) {
      this.updateVisualEffectsOnly(dt);
      return;
    }

    if (this.mode !== 'missions') {
      const timeScale = this.powerUps.cryoRemaining > 0 ? 0.5 : 1;
      this.timeRemaining = Math.max(0, this.timeRemaining - dt * timeScale);
      if (this.timeRemaining <= 0 && this.items.length === 0) {
        this.finishRun('time');
        return;
      }
    }

    if (this.powerUps.cryoRemaining > 0) {
      this.powerUps.cryoRemaining = Math.max(0, this.powerUps.cryoRemaining - dt);
    }
    if (this.powerUps.solarRemaining > 0) {
      this.powerUps.solarRemaining = Math.max(0, this.powerUps.solarRemaining - dt);
      if (this.powerUps.solarRemaining === 0) {
        this.powerUps.solarStacks = 0;
      }
    }
    if (this.powerUps.frenzyRemaining > 0) {
      this.powerUps.frenzyRemaining = Math.max(0, this.powerUps.frenzyRemaining - dt);
      this.frenzySpawnTimer -= dt;
      if (this.frenzySpawnTimer <= 0) {
        this.spawnFrenzyBurst();
        this.frenzySpawnTimer = 0.3;
      }
    }
    if (this.powerUps.magnetRemaining > 0) {
      this.powerUps.magnetRemaining = Math.max(0, this.powerUps.magnetRemaining - dt);
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.flushComboIfReady();
      }
    }

    // Wave spawning
    const canSpawn =
      (this.mode === 'missions' || this.timeRemaining > 1.2) &&
      this.missionTransitionTimer <= 0;
    if (canSpawn && this.powerUps.frenzyRemaining <= 0) {
      this.nextWaveTimer -= dt;
      if (this.nextWaveTimer <= 0) {
        this.spawnWave();
        if (this.mode === 'missions') {
          this.nextWaveTimer = this.missionBlueprint.waveInterval;
        } else {
          const ramp = Math.min(1.0, this.elapsed / 65);
          const baseInterval = this.mode === 'arcade' ? 1.85 : 1.95;
          this.nextWaveTimer = Math.max(1.05, baseInterval - ramp * 0.7);
        }
      }
    }

    const physicsScale = this.powerUps.cryoRemaining > 0 ? 0.44 : 1.0;
    const speedScale = this.mode === 'missions' ? this.missionBlueprint.speedScale : 1.0;
    const simDt = dt * physicsScale * speedScale;
    const gravity = this.height * 1.04;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.spawnAge += dt;
      item.sliceCooldown = Math.max(0, item.sliceCooldown - dt);
      item.hitFlash = Math.max(0, item.hitFlash - dt * 5);

      item.squashX += (1 - item.squashX) * Math.min(1, dt * 14);
      item.squashY += (1 - item.squashY) * Math.min(1, dt * 14);

      const spec = ITEM_SPECS[item.kind];
      if (this.powerUps.magnetRemaining > 0 && spec.category !== 'hazard') {
        const targetX = this.width * 0.5;
        const targetY = this.height * 0.42;
        item.vx += (targetX - item.x) * 1.15 * simDt;
        item.vy += (targetY - item.y) * 0.55 * simDt;
      }

      item.x += item.vx * simDt;
      item.y += item.vy * simDt;
      item.vy += gravity * spec.weight * simDt;
      item.rotation += item.vr * simDt;

      if (item.y < this.height - item.radius * 0.3) {
        item.enteredScreen = true;
      }

      if (item.y > this.height + item.radius * 2.2 && item.vy > 0) {
        this.items.splice(i, 1);

        if (item.enteredScreen && spec.category !== 'hazard' && spec.category !== 'powerup') {
          this.handleMissedItem(item);
          if (this.ended) return;
        }
      }
    }

    this.updateVisualEffectsOnly(dt);

    this.hudEmitCooldown -= dt;
    if (this.hudEmitCooldown <= 0) {
      this.emitHud();
      this.hudEmitCooldown = 0.06;
    }
  }

  private updateVisualEffectsOnly(dt: number): void {
    const gravity = this.height * 1.05;

    for (let i = this.halves.length - 1; i >= 0; i--) {
      const h = this.halves[i];
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      h.vy += gravity * dt;
      h.rotation += h.vr * dt;
      if (h.y > this.height + h.radius * 2) {
        this.halves.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += gravity * p.gravityScale * dt;
      p.vx *= p.shape === 'dust' ? Math.max(0.85, 1 - dt * 2.6) : 1;
      p.size += p.growRate * dt;
      p.rotation += p.vr * dt;
      p.alpha = p.shape === 'dust' ? (p.life / p.maxLife) * 0.55 : p.life / p.maxLife;
    }

    for (let i = this.stains.length - 1; i >= 0; i--) {
      this.stains[i].alpha -= dt * 0.045;
      if (this.stains[i].alpha <= 0) {
        this.stains.splice(i, 1);
      }
    }

    for (let i = this.callouts.length - 1; i >= 0; i--) {
      const c = this.callouts[i];
      c.life -= dt;
      c.y += c.vy * dt;
      if (c.life <= 0) {
        this.callouts.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const shakeX = this.shakeMag > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;
    const shakeY = this.shakeMag > 0 ? (Math.random() * 2 - 1) * this.shakeMag : 0;

    renderArena(
      ctx,
      this.width,
      this.height,
      this.backdropImg,
      this.stains,
      this.halves,
      this.items,
      this.particles,
      this.blade,
      this.callouts,
      this.powerUps,
      this.flashAlpha,
      shakeX,
      shakeY,
      this.elapsed
    );
  }

  private spawnWave(): void {
    this.waveCount++;

    let minCount = 2;
    let maxCount = 4;
    if (this.mode === 'missions') {
      minCount = this.missionBlueprint.waveMin;
      maxCount = this.missionBlueprint.waveMax;
    } else {
      const difficulty = Math.min(1, this.elapsed / 70);
      minCount = this.mode === 'arcade' ? 3 : 2;
      maxCount = Math.min(6, minCount + 1 + Math.floor(difficulty * 3));
    }

    const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));

    let spawnedHazardThisWave = false;
    for (let i = 0; i < count; i++) {
      const kind = this.pickItemKind(spawnedHazardThisWave);
      if (ITEM_SPECS[kind].category === 'hazard') {
        spawnedHazardThisWave = true;
      }
      this.launchItem(kind, i * 0.09);
    }

    // Star Power-Up spawn
    const starChance = this.mode === 'arcade' ? 0.3 : this.mode === 'zen' ? 0.24 : 0.22;
    if (this.waveCount >= 2 && Math.random() < starChance) {
      const sKind = STAR_POWERUP_KINDS[Math.floor(Math.random() * STAR_POWERUP_KINDS.length)];
      this.launchItem(sKind, 0.14);
    }
  }

  private spawnFrenzyBurst(): void {
    const pool =
      this.mode === 'missions'
        ? this.missionBlueprint.itemPool
        : [...CLASSIC_FRUIT_KINDS, ...PLANET_KINDS, ...VEGETABLE_KINDS, ...NEW_FRUIT_KINDS];

    for (let side = 0; side < 2; side++) {
      const kind = pool[Math.floor(Math.random() * pool.length)];
      const spec = ITEM_SPECS[kind];
      const fromLeft = side === 0;
      const x = fromLeft ? -spec.radius : this.width + spec.radius;
      const y = this.height * (0.45 + Math.random() * 0.3);
      const vx = (fromLeft ? 1 : -1) * (this.width * (0.31 + Math.random() * 0.22));
      const vy = -(this.height * (0.62 + Math.random() * 0.24));

      this.items.push({
        id: this.nextItemId++,
        kind,
        x,
        y,
        vx,
        vy,
        radius: spec.radius,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() * 2 - 1) * 4.2,
        hp: spec.maxHp ?? 1,
        maxHp: spec.maxHp ?? 1,
        squashX: 1,
        squashY: 1,
        hitFlash: 0,
        enteredScreen: true,
        spawnAge: 0,
        sliceCooldown: 0,
      });
    }
  }

  private pickItemKind(alreadyHasHazard: boolean): ItemKind {
    // Hazards: Eclipse Moon & Flare Sun (never in Zen mode, max 1 per wave unless deep mission)
    if (this.mode !== 'zen' && this.waveCount >= 2 && !alreadyHasHazard) {
      const hazardChance =
        this.mode === 'missions'
          ? this.missionBlueprint.hazardChance
          : Math.min(0.24, 0.12 + (this.elapsed / 70) * 0.1);
      if (Math.random() < hazardChance) {
        return Math.random() < 0.52 ? 'eclipse_moon' : 'flare_sun';
      }
    }

    if (this.mode === 'missions') {
      const pool = this.missionBlueprint.itemPool;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    // Arcade & Zen: progressive mix of Fruits -> Vegetables -> New Fruits -> Planets
    const difficulty = Math.min(1, this.elapsed / 65);
    const mixedPool: ItemKind[] = [...CLASSIC_FRUIT_KINDS, ...VEGETABLE_KINDS];
    if (difficulty > 0.22) {
      mixedPool.push(...NEW_FRUIT_KINDS);
    }
    if (difficulty > 0.45) {
      mixedPool.push(...PLANET_KINDS);
    }
    return mixedPool[Math.floor(Math.random() * mixedPool.length)];
  }

  private launchItem(kind: ItemKind, delayOffset = 0): void {
    const spec = ITEM_SPECS[kind];
    const margin = Math.max(80, this.width * 0.12);
    const x = margin + Math.random() * (this.width - margin * 2);
    const y = this.height + spec.radius + delayOffset * 120;

    const targetX = this.width * (0.25 + Math.random() * 0.5);
    const flightTime = 1.38 + Math.random() * 0.32;
    const vx = (targetX - x) / flightTime;

    const peakHeight = this.height * (0.68 + Math.random() * 0.2);
    const gravity = this.height * 1.04 * spec.weight;
    const vy = -Math.sqrt(2 * gravity * peakHeight);

    this.items.push({
      id: this.nextItemId++,
      kind,
      x,
      y,
      vx,
      vy,
      radius: spec.radius,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() * 2 - 1) * 3.4,
      hp: spec.maxHp ?? 1,
      maxHp: spec.maxHp ?? 1,
      squashX: 0.88,
      squashY: 1.15,
      hitFlash: 0,
      enteredScreen: false,
      spawnAge: 0,
      sliceCooldown: 0,
    });
  }

  private checkSliceSegment(x1: number, y1: number, x2: number, y2: number): void {
    const cutAngle = Math.atan2(y2 - y1, x2 - x1);
    const radiusBoost = this.powerUps.magnetRemaining > 0 ? 1.28 : 1.05;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (item.sliceCooldown > 0) continue;

      const hitRadius = item.radius * radiusBoost;
      const dist = distPointToSegment(item.x, item.y, x1, y1, x2, y2);

      if (dist <= hitRadius) {
        const isCritical = dist <= item.radius * 0.24;
        this.handleItemHit(i, item, cutAngle, isCritical);
        if (this.ended) return;
      }
    }
  }

  private handleItemHit(
    index: number,
    item: ActiveItem,
    cutAngle: number,
    isCritical: boolean
  ): void {
    const spec = ITEM_SPECS[item.kind];

    // 1. Hazards: Eclipse Moon & Flare Sun
    if (spec.category === 'hazard') {
      this.items.splice(index, 1);
      this.triggerHazardBlast(item);
      return;
    }

    // 2. Armored 2-hit targets (Obsidian Planetoid & Armored Durian)
    if (item.hp > 1 && this.powerUps.solarRemaining <= 0) {
      item.hp -= 1;
      item.sliceCooldown = 0.16;
      item.hitFlash = 1;
      item.squashX = 1.22;
      item.squashY = 0.82;
      item.vy = Math.min(item.vy, -this.height * 0.34);
      item.vr *= -1.35;

      this.hitstopTimer = 0.032;
      this.shakeMag = Math.max(this.shakeMag, 6);
      soundEngine.playArmorCrack(false);
      this.spawnDustBlast(item.x, item.y, spec.dustColor, 10);
      this.addCallout(item.x, item.y - 36, 'CRACKED!', 'SLICE AGAIN', spec.innerColor, 0.95);
      return;
    }

    // 3. Item cleanly sliced!
    this.items.splice(index, 1);
    this.itemsSliced++;

    this.flowStreak++;
    this.updateFlowTier();

    if (spec.maxHp && spec.maxHp > 1) {
      this.armoredBroken++;
      soundEngine.playArmorCrack(true);
      this.hitstopTimer = 0.042;
      this.shakeMag = Math.max(this.shakeMag, 9);
    } else {
      soundEngine.playSlice(spec.category, spec.weight, isCritical);
    }

    if (isCritical) {
      this.criticalCuts++;
      this.hitstopTimer = Math.max(this.hitstopTimer, 0.036);
      this.shakeMag = Math.max(this.shakeMag, 6);
    }

    if (spec.powerUp) {
      this.activateStarPowerUp(spec.powerUp, item.x, item.y);
    }

    // Low, clean point calculation
    const totalMult = this.getTotalMultiplier();
    this.peakMultiplier = Math.max(this.peakMultiplier, totalMult);
    const critBonus = isCritical ? 2 : 0;
    const pts = spec.points * totalMult + critBonus;
    this.addScore(pts);

    // Track combo swipe
    this.comboCount++;
    this.comboTimer = 0.19;
    this.comboLastX = item.x;
    this.comboLastY = item.y;

    // Halves + Dusty Blast Effect (especially rich cosmic dust for Planets!)
    this.spawnSlicedHalves(item, cutAngle);
    const isPlanet = spec.category === 'planet';
    this.spawnDustBlast(item.x, item.y, spec.dustColor, isPlanet ? 20 : 12);

    if (spec.category !== 'planet' && spec.category !== 'powerup') {
      this.addStain(item.x, item.y, spec.dustColor, item.radius * 1.0);
    }

    if (isCritical) {
      this.spawnSparks(item.x, item.y, '#fef08a', 8);
      this.addCallout(item.x, item.y - 24, `CRIT +2`, `+${pts} PTS`, '#fde047', 1.08);
    } else if (!spec.powerUp) {
      this.addCallout(
        item.x,
        item.y - 14,
        `+${pts}`,
        totalMult > 1 ? `×${totalMult} FLOW` : undefined,
        spec.innerColor,
        0.88
      );
    }

    // Mission progression tracking (non-powerup items count toward mission quota)
    if (this.mode === 'missions' && spec.category !== 'powerup') {
      this.slicedInMission++;
      if (this.slicedInMission >= this.missionBlueprint.targetCount) {
        this.advanceMission();
      }
    }

    this.emitHud();
  }

  private advanceMission(): void {
    soundEngine.playMissionClear();
    const clearedNum = this.currentMission;
    this.currentMission++;
    this.missionBlueprint = getMissionBlueprint(this.currentMission);
    this.slicedInMission = 0;
    this.missionTransitionTimer = 1.45;

    // Restore +1 life on mission completion (up to maxLives)
    if (this.lives < this.maxLives) {
      this.lives++;
    }

    // Clear remaining airborne items cleanly into dust
    for (const item of this.items) {
      const spec = ITEM_SPECS[item.kind];
      this.spawnDustBlast(item.x, item.y, spec.dustColor, 10);
    }
    this.items = [];

    this.addCallout(
      this.width * 0.5,
      this.height * 0.34,
      `MISSION ${clearedNum} COMPLETE!`,
      `NEXT: M${this.currentMission} · ${this.missionBlueprint.themeLabel.toUpperCase()}`,
      '#4ade80',
      1.26
    );
  }

  private activateStarPowerUp(type: PowerUpType, x: number, y: number): void {
    this.starsActivated++;
    soundEngine.playPowerUp(type);
    this.hitstopTimer = 0.038;
    this.shakeMag = Math.max(this.shakeMag, 6);

    if (type === 'cryo') {
      this.powerUps.cryoRemaining = POWERUP_DURATIONS.cryo;
      this.spawnDustBlast(x, y, '#7dd3fc', 16);
      this.addCallout(x, y - 34, 'FROST STAR', 'TIME SLOWED · +1× BONUS', '#7dd3fc', 1.15);
    } else if (type === 'solar') {
      this.powerUps.solarRemaining = POWERUP_DURATIONS.solar;
      this.powerUps.solarStacks = 1;
      this.spawnDustBlast(x, y, '#fde047', 16);
      this.addCallout(x, y - 34, 'SOLARIS STAR', '2× MULTIPLIER ACTIVE', '#fde047', 1.15);
    } else if (type === 'frenzy') {
      this.powerUps.frenzyRemaining = POWERUP_DURATIONS.frenzy;
      this.frenzySpawnTimer = 0.05;
      this.spawnDustBlast(x, y, '#fb923c', 18);
      this.addCallout(x, y - 34, 'NOVA STAR', 'COSMIC BARRAGE!', '#fdba74', 1.16);
    } else {
      this.powerUps.magnetRemaining = POWERUP_DURATIONS.magnet;
      this.spawnDustBlast(x, y, '#34d399', 16);
      this.addCallout(x, y - 34, 'GRAVITY STAR', 'WIDE BLADE · PULL', '#6ee7b7', 1.14);
    }
  }

  private triggerHazardBlast(item: ActiveItem): void {
    const spec = ITEM_SPECS[item.kind];
    soundEngine.playHazardBlast();
    this.hitstopTimer = 0.06;
    this.shakeMag = 24;
    this.flashAlpha = 0.65;

    this.flowStreak = 0;
    this.flowTier = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    // Dramatic dusty cosmic shockwave on Moon/Sun blast
    this.spawnDustBlast(item.x, item.y, spec.dustColor, 26);
    this.spawnSparks(item.x, item.y, '#ef4444', 18);

    const hazardTitle = item.kind === 'eclipse_moon' ? 'ECLIPSE MOON!' : 'FLARE SUN!';

    if (this.mode === 'missions') {
      this.lives = Math.max(0, this.lives - 1);
      this.addCallout(item.x, item.y, hazardTitle, '-1 LIFE · STREAK RESET', '#fca5a5', 1.22);
      this.emitHud();
      if (this.lives <= 0) {
        this.finishRun('hazard');
      }
    } else {
      this.score = Math.max(0, this.score - 15);
      this.addCallout(item.x, item.y, hazardTitle, '-15 PTS · STREAK RESET', '#fca5a5', 1.18);
      this.emitHud();
    }
  }

  private handleMissedItem(item: ActiveItem): void {
    if (this.flowTier > 0) {
      this.flowTier = Math.max(0, this.flowTier - 1);
      this.flowStreak = FLOW_TIERS[this.flowTier].threshold;
    } else {
      this.flowStreak = 0;
    }

    if (
      this.mode === 'missions' &&
      this.powerUps.frenzyRemaining <= 0 &&
      this.missGraceTimer <= 0
    ) {
      this.missGraceTimer = 0.55;
      this.lives = Math.max(0, this.lives - 1);
      soundEngine.playMiss();
      this.shakeMag = Math.max(this.shakeMag, 7);
      this.addCallout(
        Math.max(80, Math.min(this.width - 80, item.x)),
        this.height - 46,
        'MISSED',
        '-1 LIFE',
        '#fca5a5',
        0.92
      );
      this.emitHud();

      if (this.lives <= 0) {
        this.finishRun('lives');
      }
    } else {
      this.emitHud();
    }
  }

  private flushComboIfReady(): void {
    if (this.comboCount >= 3) {
      const bonus = this.comboCount * 2;
      this.addScore(bonus);
      this.bestCombo = Math.max(this.bestCombo, this.comboCount);
      soundEngine.playCombo(this.comboCount);

      this.addCallout(
        Math.max(110, Math.min(this.width - 110, this.comboLastX)),
        Math.max(90, Math.min(this.height - 110, this.comboLastY - 40)),
        `${this.comboCount} HIT BLITZ!`,
        `+${bonus} BONUS PTS`,
        '#fde047',
        1.18
      );
      this.emitHud();
    } else if (this.comboCount > this.bestCombo) {
      this.bestCombo = this.comboCount;
    }

    this.comboCount = 0;
    this.comboTimer = 0;
  }

  private updateFlowTier(): void {
    for (let i = FLOW_TIERS.length - 1; i >= 0; i--) {
      if (this.flowStreak >= FLOW_TIERS[i].threshold) {
        this.flowTier = i;
        break;
      }
    }
  }

  private getTotalMultiplier(): number {
    const flowMult = FLOW_TIERS[this.flowTier].multiplier;
    const cryoBonus = this.powerUps.cryoRemaining > 0 ? 1 : 0;
    const solarFactor = this.powerUps.solarRemaining > 0 ? 2 : 1;
    return (flowMult + cryoBonus) * solarFactor;
  }

  private getFlowProgress(): number {
    if (this.flowTier >= FLOW_TIERS.length - 1) return 1;
    const curThresh = FLOW_TIERS[this.flowTier].threshold;
    const nextThresh = FLOW_TIERS[this.flowTier + 1].threshold;
    return Math.max(0, Math.min(1, (this.flowStreak - curThresh) / (nextThresh - curThresh)));
  }

  private addScore(points: number): void {
    this.score += points;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      saveBest(this.mode, this.bestScore);
    }
  }

  private spawnSlicedHalves(item: ActiveItem, cutAngle: number): void {
    const perpX = -Math.sin(cutAngle);
    const perpY = Math.cos(cutAngle);
    const splitSpeed = 135;

    for (const side of [-1, 1] as const) {
      this.halves.push({
        kind: item.kind,
        x: item.x + perpX * side * 6,
        y: item.y + perpY * side * 6,
        vx: item.vx + perpX * side * splitSpeed,
        vy: Math.min(item.vy, -80) + perpY * side * splitSpeed - 40,
        radius: item.radius,
        rotation: item.rotation,
        vr: side * (2.6 + Math.random() * 2.2),
        cutAngle: cutAngle - item.rotation,
        side,
        alpha: 1,
      });
    }
  }

  private spawnDustBlast(x: number, y: number, color: string, count: number): void {
    if (this.particles.length > 320) return;

    // Soft expanding cosmic/botanical dust puffs
    const puffCount = Math.max(5, Math.floor(count * 0.45));
    for (let i = 0; i < puffCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 115;
      const maxLife = 0.55 + Math.random() * 0.45;
      this.particles.push({
        x: x + (Math.random() * 2 - 1) * 10,
        y: y + (Math.random() * 2 - 1) * 10,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 20,
        size: 16 + Math.random() * 14,
        growRate: 36 + Math.random() * 24,
        color,
        alpha: 0.52,
        life: maxLife,
        maxLife,
        gravityScale: 0.04,
        shape: 'dust',
        rotation: 0,
        vr: 0,
      });
    }

    // Fine debris shards & dust specks
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 110 + Math.random() * 310;
      const maxLife = 0.4 + Math.random() * 0.4;
      const shape = i % 3 === 0 ? 'shard' : 'circle';
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 50,
        size: 2.5 + Math.random() * 4.5,
        growRate: 0,
        color,
        alpha: 1,
        life: maxLife,
        maxLife,
        gravityScale: 0.65,
        shape,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() * 2 - 1) * 9,
      });
    }
  }

  private spawnSparks(x: number, y: number, color: string, count: number): void {
    if (this.particles.length > 320) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 320;
      const maxLife = 0.34 + Math.random() * 0.3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 40,
        size: 3.5 + Math.random() * 4,
        growRate: 0,
        color,
        alpha: 1,
        life: maxLife,
        maxLife,
        gravityScale: 0.35,
        shape: 'spark',
        rotation: a,
        vr: 0,
      });
    }
  }

  private addStain(x: number, y: number, color: string, radius: number): void {
    const blobs = Array.from({ length: 5 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = radius * (0.45 + Math.random() * 0.65);
      return {
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d,
        r: radius * (0.22 + Math.random() * 0.32),
      };
    });
    this.stains.push({
      x,
      y,
      radius,
      color,
      alpha: 0.28,
      blobs,
    });
    if (this.stains.length > 16) {
      this.stains.shift();
    }
  }

  private addCallout(
    x: number,
    y: number,
    title: string,
    subtitle: string | undefined,
    color: string,
    scale: number
  ): void {
    const clampedX = Math.max(115, Math.min(this.width - 115, x));
    const clampedY = Math.max(95, Math.min(this.height - 95, y));
    this.callouts.push({
      x: clampedX,
      y: clampedY,
      vy: -44,
      title,
      subtitle,
      color,
      scale,
      life: 1.0,
      maxLife: 1.0,
    });
  }

  private finishRun(endedBy: RunSummary['endedBy']): void {
    if (this.ended) return;
    this.ended = true;
    this.flushComboIfReady();
    this.pointerActive = false;

    const prevBest = getSavedBest(this.mode);
    const isNewBest = this.score > 0 && this.score >= prevBest && this.score === this.bestScore;
    if (this.score > prevBest) {
      saveBest(this.mode, this.score);
    }

    this.emitHud();
    this.onGameOver({
      mode: this.mode,
      score: this.score,
      bestScore: Math.max(prevBest, this.score),
      isNewBest,
      itemsSliced: this.itemsSliced,
      criticalCuts: this.criticalCuts,
      bestCombo: this.bestCombo,
      peakMultiplier: this.peakMultiplier,
      starsActivated: this.starsActivated,
      armoredBroken: this.armoredBroken,
      missionReached: this.currentMission,
      endedBy,
    });
  }

  private emitHud(): void {
    this.onHudUpdate({
      score: this.score,
      bestScore: this.bestScore,
      lives: this.lives,
      maxLives: this.maxLives,
      timeRemaining: this.timeRemaining,
      flowTier: this.flowTier,
      flowProgress: this.getFlowProgress(),
      flowStreak: this.flowStreak,
      solarStacks: this.powerUps.solarStacks,
      totalMultiplier: this.getTotalMultiplier(),
      powerUps: { ...this.powerUps },
      comboCount: this.comboCount,
      mission:
        this.mode === 'missions'
          ? {
              missionNumber: this.missionBlueprint.missionNumber,
              title: this.missionBlueprint.title,
              themeLabel: this.missionBlueprint.themeLabel,
              slicedInMission: this.slicedInMission,
              targetInMission: this.missionBlueprint.targetCount,
            }
          : null,
    });
  }
}

export function getSavedBestScore(mode: GameMode): number {
  return getSavedBest(mode);
}
