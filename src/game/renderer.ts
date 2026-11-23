import { ITEM_SPECS } from './catalog';
import {
  ActiveItem,
  ActivePowerUpState,
  BladePoint,
  BoardStain,
  FloatingCallout,
  ItemKind,
  Particle,
  SlicedHalf,
} from './types';

function drawStarPolygon(
  ctx: CanvasRenderingContext2D,
  points: number,
  outerR: number,
  innerR: number
): void {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawItemArtwork(
  ctx: CanvasRenderingContext2D,
  kind: ItemKind,
  r: number,
  time: number,
  hp: number,
  maxHp: number,
  isCrossSection = false
): void {
  switch (kind) {
    // ================= CLASSIC FRUITS =================
    case 'yuzu': {
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.55, '#eab308');
      grad.addColorStop(1, '#a16207');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#65a30d';
        ctx.beginPath();
        ctx.ellipse(r * 0.25, -r * 0.92, r * 0.32, r * 0.14, -0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.beginPath();
        ctx.ellipse(-r * 0.32, -r * 0.35, r * 0.25, r * 0.14, -0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'melon': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.15, 0, 0, r);
      grad.addColorStop(0, '#4ade80');
      grad.addColorStop(0.65, '#15803d');
      grad.addColorStop(1, '#052e16');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#dcfce7';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1c1917';
        for (let i = 0; i < 6; i++) {
          const a = i * 1.05 + 0.3;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, 2.5, 4, a, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = 'rgba(5, 46, 22, 0.72)';
        ctx.lineWidth = r * 0.14;
        ctx.lineCap = 'round';
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.arc(i * r * 0.28, 0, r * 0.85, -0.95, 0.95);
          ctx.stroke();
        }
      }
      break;
    }

    case 'pomegranate': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fb7185');
      grad.addColorStop(0.5, '#be123c');
      grad.addColorStop(1, '#4c0519');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#9f1239';
      ctx.beginPath();
      ctx.moveTo(-r * 0.28, -r * 0.88);
      ctx.lineTo(-r * 0.15, -r * 1.15);
      ctx.lineTo(0, -r * 0.96);
      ctx.lineTo(r * 0.15, -r * 1.15);
      ctx.lineTo(r * 0.28, -r * 0.88);
      ctx.closePath();
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#ffe4e6';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e11d48';
        for (let i = 0; i < 10; i++) {
          const a = (i * Math.PI * 2) / 10;
          const dist = r * (0.35 + (i % 2) * 0.24);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, r * 0.14, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'dragonfruit': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.65, '#db2777');
      grad.addColorStop(1, '#831843');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.92, r * 1.06, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#84cc16';
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.88);
        ctx.lineTo(Math.cos(a - 0.16) * r * 1.12, Math.sin(a - 0.16) * r * 1.18);
        ctx.lineTo(Math.cos(a + 0.18) * r * 0.95, Math.sin(a + 0.18) * r * 1.02);
        ctx.closePath();
        ctx.fill();
      }

      if (isCrossSection) {
        ctx.fillStyle = '#fdf2f8';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#18181b';
        for (let i = 0; i < 12; i++) {
          const a = i * 0.52;
          const d = r * (0.22 + (i % 3) * 0.18);
          ctx.beginPath();
          ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    // ================= PLANETS =================
    case 'mercury': {
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#e2e8f0');
      grad.addColorStop(0.6, '#94a3b8');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Craters
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      for (const [cx, cy, cr] of [
        [-0.32, -0.2, 0.22],
        [0.3, 0.24, 0.26],
        [0.12, -0.45, 0.14],
        [-0.22, 0.42, 0.16],
      ]) {
        ctx.beginPath();
        ctx.arc(r * cx, r * cy, r * cr, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isCrossSection) {
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mars': {
      const grad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.12, 0, 0, r);
      grad.addColorStop(0, '#fdba74');
      grad.addColorStop(0.5, '#dc2626');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Polar ice cap & rust canyons
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.76, r * 0.38, r * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(124, 45, 18, 0.55)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.15, r * 0.15, r * 0.42, r * 0.14, 0.3, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'jupiter': {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();

      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.55, '#d97706');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
      ctx.fillRect(-r, -r, r * 2, r * 2);

      // Atmospheric gas bands
      ctx.fillStyle = 'rgba(154, 52, 18, 0.55)';
      ctx.fillRect(-r, -r * 0.55, r * 2, r * 0.2);
      ctx.fillRect(-r, -r * 0.08, r * 2, r * 0.24);
      ctx.fillStyle = 'rgba(254, 243, 199, 0.45)';
      ctx.fillRect(-r, -r * 0.32, r * 2, r * 0.16);
      ctx.fillRect(-r, r * 0.28, r * 2, r * 0.18);

      // Great Red Spot
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(r * 0.25, r * 0.22, r * 0.24, r * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'saturn': {
      // Back ring arc
      ctx.save();
      ctx.rotate(-0.32);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.72)';
      ctx.lineWidth = r * 0.16;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.48, r * 0.38, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Planet body
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r * 0.85);
      grad.addColorStop(0, '#fef9c3');
      grad.addColorStop(0.6, '#eab308');
      grad.addColorStop(1, '#854d0e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fill();

      // Front ring arc
      ctx.save();
      ctx.rotate(-0.32);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = r * 0.16;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.48, r * 0.38, 0, 0, Math.PI);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(161, 98, 7, 0.65)';
      ctx.lineWidth = r * 0.05;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.32, r * 0.32, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'neptune': {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();

      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#93c5fd');
      grad.addColorStop(0.55, '#2563eb');
      grad.addColorStop(1, '#172554');
      ctx.fillStyle = grad;
      ctx.fillRect(-r, -r, r * 2, r * 2);

      // Swirling methane bands
      ctx.strokeStyle = 'rgba(191, 219, 254, 0.45)';
      ctx.lineWidth = r * 0.12;
      ctx.beginPath();
      ctx.moveTo(-r, -r * 0.2);
      ctx.quadraticCurveTo(0, -r * 0.05, r, -r * 0.25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-r, r * 0.32);
      ctx.quadraticCurveTo(0, r * 0.44, r, r * 0.24);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'planetoid': {
      const isCracked = hp < maxHp;
      ctx.save();
      if (isCracked) {
        ctx.shadowColor = 'rgba(192, 132, 252, 0.8)';
        ctx.shadowBlur = 18;
      }
      ctx.fillStyle = isCracked ? '#4c1d95' : '#1e293b';
      ctx.strokeStyle = isCracked ? '#c084fc' : '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const a = (i * Math.PI * 2) / sides;
        const rad = r * (i % 2 === 0 ? 1.02 : 0.9);
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (isCracked || isCrossSection) {
        const cGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r * 0.65);
        cGrad.addColorStop(0, '#f5d0fe');
        cGrad.addColorStop(0.55, '#a855f7');
        cGrad.addColorStop(1, '#3b0764');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.56, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
          const a = i * 1.5 + 0.4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-r * 0.2, -r * 0.35);
        ctx.lineTo(r * 0.14, -r * 0.15);
        ctx.lineTo(-r * 0.05, r * 0.18);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    // ================= VEGETABLES =================
    case 'carrot': {
      // Tapered bright orange carrot with green frond crown
      const grad = ctx.createLinearGradient(-r * 0.4, -r, r * 0.4, r);
      grad.addColorStop(0, '#fb923c');
      grad.addColorStop(0.6, '#ea580c');
      grad.addColorStop(1, '#9a3412');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-r * 0.52, -r * 0.55);
      ctx.quadraticCurveTo(0, -r * 0.72, r * 0.52, -r * 0.55);
      ctx.lineTo(0, r * 1.08);
      ctx.closePath();
      ctx.fill();

      // Leafy green tops
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      for (const angle of [-0.45, 0, 0.45]) {
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.62);
        ctx.lineTo(Math.sin(angle) * r * 0.65, -r * 1.15);
        ctx.stroke();
      }

      if (isCrossSection) {
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'daikon': {
      const grad = ctx.createLinearGradient(-r * 0.5, -r, r * 0.5, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#e2e8f0');
      grad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.08, r * 0.46, r * 0.95, 0, 0, Math.PI * 2);
      ctx.fill();

      // Green shoulder & leaves
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.65, r * 0.36, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#15803d';
      for (const offset of [-0.22, 0, 0.22]) {
        ctx.beginPath();
        ctx.ellipse(r * offset, -r * 1.0, r * 0.14, r * 0.3, offset, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'broccoli': {
      // Pale green stem
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.roundRect(-r * 0.24, r * 0.1, r * 0.48, r * 0.85, r * 0.16);
      ctx.fill();

      // Fluffy green floret clusters
      const florets = [
        [0, -r * 0.36, r * 0.48],
        [-r * 0.46, -r * 0.12, r * 0.38],
        [r * 0.46, -r * 0.12, r * 0.38],
        [-r * 0.28, -r * 0.55, r * 0.34],
        [r * 0.28, -r * 0.55, r * 0.34],
      ];
      for (const [fx, fy, fr] of florets) {
        const g = ctx.createRadialGradient(fx - fr * 0.2, fy - fr * 0.2, 2, fx, fy, fr);
        g.addColorStop(0, '#4ade80');
        g.addColorStop(1, '#14532d');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'eggplant': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.1, r * 0.1, 0, r * 0.1, r);
      grad.addColorStop(0, '#a855f7');
      grad.addColorStop(0.55, '#6b21a8');
      grad.addColorStop(1, '#2e1065');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.12, r * 0.62, r * 0.92, 0, 0, Math.PI * 2);
      ctx.fill();

      // Green cap calyx
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, -r * 0.52);
      ctx.quadraticCurveTo(0, -r * 0.96, r * 0.45, -r * 0.52);
      ctx.lineTo(r * 0.2, -r * 0.32);
      ctx.lineTo(0, -r * 0.48);
      ctx.lineTo(-r * 0.2, -r * 0.32);
      ctx.closePath();
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.ellipse(0, r * 0.12, r * 0.48, r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'bell_pepper': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.6, '#facc15');
      grad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = grad;
      // 3-lobe pepper silhouette
      for (const ox of [-r * 0.34, r * 0.34, 0]) {
        ctx.beginPath();
        ctx.ellipse(ox, r * 0.06, r * 0.52, r * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stem
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-r * 0.14, -r * 0.98, r * 0.28, r * 0.34);

      if (isCrossSection) {
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.arc(0, r * 0.05, r * 0.46, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // ================= NEW TROPICAL FRUITS =================
    case 'mango': {
      const grad = ctx.createLinearGradient(-r, -r, r, r);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#eab308');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.76, r * 1.02, 0.22, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.62, r * 0.86, 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.24)';
        ctx.beginPath();
        ctx.ellipse(-r * 0.25, -r * 0.35, r * 0.2, r * 0.35, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'lychee': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#fb7185');
      grad.addColorStop(0.65, '#e11d48');
      grad.addColorStop(1, '#881337');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#fff1f2';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.36, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bumpy textured shell dots
        ctx.fillStyle = 'rgba(136, 19, 55, 0.45)';
        for (let i = 0; i < 8; i++) {
          const a = i * 0.78;
          const d = r * 0.55;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'kiwi': {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.88, r * 1.0, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isCrossSection) {
        ctx.fillStyle = '#a3e635';
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.76, r * 0.88, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ecfccb';
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.32, r * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1c1917';
        for (let i = 0; i < 10; i++) {
          const a = (i * Math.PI * 2) / 10;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.54, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.65, r * 0.78, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'mangosteen': {
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#9333ea');
      grad.addColorStop(0.65, '#581c87');
      grad.addColorStop(1, '#2e1065');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#65a30d';
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.85, r * 0.18, r * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (isCrossSection) {
        ctx.fillStyle = '#faf5ff';
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r * 0.34, Math.sin(a) * r * 0.34, r * 0.26, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'durian': {
      const isCracked = hp < maxHp;
      ctx.save();
      if (isCracked) {
        ctx.shadowColor = 'rgba(250, 204, 21, 0.75)';
        ctx.shadowBlur = 16;
      }
      ctx.fillStyle = isCracked ? '#a16207' : '#4d7c0f';
      ctx.strokeStyle = isCracked ? '#fef08a' : '#365314';
      ctx.lineWidth = 2;
      // Spiky silhouette
      drawStarPolygon(ctx, 14, r * 1.08, r * 0.82);
      ctx.fill();
      ctx.stroke();

      if (isCracked || isCrossSection) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    // ================= STAR POWER-UPS =================
    case 'frost_star': {
      const pulse = 1 + Math.sin(time * 5.5) * 0.08;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
      ctx.shadowBlur = 18;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#f0f9ff');
      grad.addColorStop(0.55, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      drawStarPolygon(ctx, 6, r * 1.02, r * 0.44);
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'solar_star': {
      const pulse = 1 + Math.sin(time * 6) * 0.08;
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.shadowBlur = 20;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#fefce8');
      grad.addColorStop(0.55, '#fbbf24');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      drawStarPolygon(ctx, 5, r * 1.06, r * 0.48);
      ctx.fill();
      ctx.strokeStyle = '#fffbeb';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#451a03';
      ctx.font = `700 ${Math.round(r * 0.44)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2×', 0, 2);
      ctx.restore();
      break;
    }

    case 'nova_star': {
      const pulse = 1 + Math.sin(time * 7) * 0.09;
      ctx.save();
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.16 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'rgba(249, 115, 22, 0.85)';
      ctx.shadowBlur = 18;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#fff7ed');
      grad.addColorStop(0.55, '#fb923c');
      grad.addColorStop(1, '#c2410c');
      ctx.fillStyle = grad;
      drawStarPolygon(ctx, 8, r * 1.05, r * 0.46);
      ctx.fill();
      ctx.strokeStyle = '#ffedd5';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'gravity_star': {
      const pulse = 1 + Math.sin(time * 5.5) * 0.08;
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'rgba(16, 185, 129, 0.85)';
      ctx.shadowBlur = 18;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
      grad.addColorStop(0, '#ecfdf5');
      grad.addColorStop(0.55, '#34d399');
      grad.addColorStop(1, '#047857');
      ctx.fillStyle = grad;
      drawStarPolygon(ctx, 4, r * 1.08, r * 0.38);
      ctx.fill();
      ctx.strokeStyle = '#d1fae5';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      break;
    }

    // ================= MOON & SUN HAZARDS =================
    case 'eclipse_moon': {
      const danger = 0.5 + Math.sin(time * 11) * 0.5;
      ctx.save();
      // Pulsing crimson danger ring
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.42 + danger * 0.45})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * (1.14 + danger * 0.06), 0, Math.PI * 2);
      ctx.stroke();

      // Dark cratered eclipse moon
      ctx.shadowColor = 'rgba(220, 38, 38, 0.65)';
      ctx.shadowBlur = 14;
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.55, '#334155');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.94, 0, Math.PI * 2);
      ctx.fill();

      // Lunar craters
      ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      for (const [cx, cy, cr] of [
        [-0.3, -0.25, 0.22],
        [0.28, 0.22, 0.26],
        [-0.1, 0.4, 0.15],
      ]) {
        ctx.beginPath();
        ctx.arc(r * cx, r * cy, r * cr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Danger X emblem
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.24, -r * 0.24);
      ctx.lineTo(r * 0.24, r * 0.24);
      ctx.moveTo(r * 0.24, -r * 0.24);
      ctx.lineTo(-r * 0.24, r * 0.24);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'flare_sun': {
      const danger = 0.5 + Math.sin(time * 13) * 0.5;
      ctx.save();
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.45 + danger * 0.45})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * (1.18 + danger * 0.06), 0, Math.PI * 2);
      ctx.stroke();

      // Blazing solar corona rays
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#dc2626';
      drawStarPolygon(ctx, 12, r * 1.12, r * 0.78);
      ctx.fill();

      // Fiery core
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r * 0.82);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.55, '#f97316');
      grad.addColorStop(1, '#991b1b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
      ctx.fill();

      // Danger X
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.22, -r * 0.22);
      ctx.lineTo(r * 0.22, r * 0.22);
      ctx.moveTo(r * 0.22, -r * 0.22);
      ctx.lineTo(-r * 0.22, r * 0.22);
      ctx.stroke();
      ctx.restore();
      break;
    }
  }
}

export function renderArena(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backdropImg: HTMLImageElement | null,
  stains: BoardStain[],
  halves: SlicedHalf[],
  items: ActiveItem[],
  particles: Particle[],
  blade: BladePoint[],
  callouts: FloatingCallout[],
  powerUps: ActivePowerUpState,
  flashAlpha: number,
  shakeX: number,
  shakeY: number,
  time: number
): void {
  ctx.save();
  ctx.translate(shakeX, shakeY);

  // 1. Dojo backdrop with subtle dark scrim
  if (backdropImg && backdropImg.complete && backdropImg.naturalWidth > 0) {
    const imgRatio = backdropImg.naturalWidth / backdropImg.naturalHeight;
    const viewRatio = width / height;
    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;
    if (viewRatio > imgRatio) {
      drawH = width / imgRatio;
      offsetY = (height - drawH) * 0.5;
    } else {
      drawW = height * imgRatio;
      offsetX = (width - drawW) * 0.5;
    }
    ctx.drawImage(backdropImg, offsetX, offsetY, drawW, drawH);
    ctx.fillStyle = 'rgba(12, 9, 8, 0.42)';
    ctx.fillRect(-20, -20, width + 40, height + 40);
  } else {
    const bg = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      50,
      width * 0.5,
      height * 0.5,
      width * 0.8
    );
    bg.addColorStop(0, '#2a1e18');
    bg.addColorStop(1, '#120d0b');
    ctx.fillStyle = bg;
    ctx.fillRect(-20, -20, width + 40, height + 40);
  }

  // 2. Power-up ambient edge auras
  if (powerUps.cryoRemaining > 0) {
    const frostGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.35,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.72
    );
    frostGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    frostGrad.addColorStop(1, 'rgba(56, 189, 248, 0.24)');
    ctx.fillStyle = frostGrad;
    ctx.fillRect(0, 0, width, height);
  }

  if (powerUps.solarRemaining > 0) {
    const solarGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.38,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.72
    );
    solarGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    solarGrad.addColorStop(1, 'rgba(245, 158, 11, 0.22)');
    ctx.fillStyle = solarGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Residual surface dust/juice stains
  for (const stain of stains) {
    ctx.save();
    ctx.globalAlpha = stain.alpha;
    ctx.fillStyle = stain.color;
    ctx.beginPath();
    ctx.arc(stain.x, stain.y, stain.radius, 0, Math.PI * 2);
    ctx.fill();
    for (const b of stain.blobs) {
      ctx.beginPath();
      ctx.arc(stain.x + b.dx, stain.y + b.dy, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. Sliced halves
  for (const half of halves) {
    ctx.save();
    ctx.globalAlpha = half.alpha;
    ctx.translate(half.x, half.y);
    ctx.rotate(half.rotation);

    ctx.save();
    ctx.rotate(half.cutAngle);
    ctx.beginPath();
    if (half.side === -1) {
      ctx.rect(-half.radius * 1.7, -half.radius * 1.7, half.radius * 3.4, half.radius * 1.7);
    } else {
      ctx.rect(-half.radius * 1.7, 0, half.radius * 3.4, half.radius * 1.7);
    }
    ctx.clip();
    ctx.rotate(-half.cutAngle);
    drawItemArtwork(ctx, half.kind, half.radius, time, 1, 1, true);
    ctx.restore();

    ctx.save();
    ctx.rotate(half.cutAngle);
    const spec = ITEM_SPECS[half.kind];
    ctx.strokeStyle = spec.innerColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-half.radius * 0.85, 0);
    ctx.lineTo(half.radius * 0.85, 0);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // 5. Active airborne items
  for (const item of items) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.scale(item.squashX, item.squashY);
    ctx.rotate(item.rotation);

    ctx.save();
    ctx.translate(6, 10);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    drawItemArtwork(ctx, item.kind, item.radius, time, item.hp, item.maxHp, false);

    if (item.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${item.hitFlash * 0.75})`;
      ctx.beginPath();
      ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 6. Pooled particles including soft expanding dusty blast clouds
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.shape === 'dust') {
      const grad = ctx.createRadialGradient(0, 0, p.size * 0.1, 0, 0, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.55, p.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'circle') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'shard') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.7, p.size * 0.5);
      ctx.lineTo(-p.size * 0.6, p.size * 0.8);
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'petal') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 1.4, -p.size * 0.35, p.size * 2.8, p.size * 0.7);
    }
    ctx.restore();
  }

  // 7. Tapered Katana Blade Trail
  if (blade.length > 1) {
    const isSolar = powerUps.solarRemaining > 0;
    const isCryo = powerUps.cryoRemaining > 0;
    const isMagnet = powerUps.magnetRemaining > 0;

    const outerGlow = isSolar
      ? '#f59e0b'
      : isCryo
        ? '#38bdf8'
        : isMagnet
          ? '#10b981'
          : '#e7e5e4';
    const innerCore = isSolar ? '#fef9c3' : isCryo ? '#e0f2fe' : '#ffffff';

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = outerGlow;
    ctx.shadowBlur = isSolar || isCryo ? 18 : 10;

    for (let i = 1; i < blade.length; i++) {
      const p0 = blade[i - 1];
      const p1 = blade[i];
      const lifeRatio = Math.max(0, 1 - p1.age / 0.14);
      const t = i / blade.length;
      const widthScale = lifeRatio * t * (isMagnet ? 13 : 10);

      if (widthScale <= 0.3) continue;

      ctx.strokeStyle = outerGlow;
      ctx.lineWidth = widthScale;
      ctx.globalAlpha = lifeRatio * 0.72;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();

      ctx.strokeStyle = innerCore;
      ctx.lineWidth = Math.max(1, widthScale * 0.45);
      ctx.globalAlpha = lifeRatio * 0.95;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 8. Floating Callouts
  for (const c of callouts) {
    const progress = 1 - c.life / c.maxLife;
    const alpha = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '700 22px "Fraunces", Georgia, serif';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(18, 13, 11, 0.85)';
    ctx.strokeText(c.title, 0, 0);
    ctx.fillStyle = c.color;
    ctx.fillText(c.title, 0, 0);

    if (c.subtitle) {
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.strokeText(c.subtitle, 0, 22);
      ctx.fillStyle = '#f5efe6';
      ctx.fillText(c.subtitle, 0, 22);
    }
    ctx.restore();
  }

  // 9. Hazard Flash
  if (flashAlpha > 0.01) {
    ctx.fillStyle = `rgba(254, 226, 226, ${flashAlpha})`;
    ctx.fillRect(-20, -20, width + 40, height + 40);
  }

  ctx.restore();
}
