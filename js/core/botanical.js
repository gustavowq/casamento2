// Ilustração botânica desenhada em canvas, a traço fino (estilo nanquim + aquarela).
// É usada sempre que uma imagem de assets/ ainda não existe.
import { seeded } from "./dom.js";
import { drawLeaf, drawLily, drawBud, drawStem, drawNode } from "./botanical-details.js";
import { BOTANICAL_ASSETS } from "./botanical-assets.js";

// tons do traço: "light" para papel claro, "dark" para fundo verde
const TONES = {
  light: { ink: "82,100,74", leafA: "149,165,141", leafB: "103,122,95", bg: ["#F4F6F3", "#DADEDF"], giftBg: ["#DADEDF", "#C0CFB2"], washK: 1 },
  dark: { ink: "65,83,59", leafA: "192,207,178", leafB: "103,122,95", bg: ["#A6B39E", "#95A58D"], giftBg: ["#C0CFB2", "#95A58D"], washK: .65 }
};
let T = TONES.light;
const ink = a => `rgba(${T.ink},${a})`;
const leafA = a => `rgba(${T.leafA},${a})`;
const leafB = a => `rgba(${T.leafB},${a})`;
const TAU = Math.PI * 2;

/* ---------- aquarela: manchas suaves e orgânicas ---------- */
function wash(x, spots, rnd) {
  for (const s0 of spots) {
    const s = { ...s0, a: s0.a * T.washK };
    const n = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const ox = s.x + (rnd() - .5) * s.r * .7, oy = s.y + (rnd() - .5) * s.r * .55;
      const r = s.r * (.55 + rnd() * .5);
      const g = x.createRadialGradient(ox, oy, 0, ox, oy, r);
      g.addColorStop(0, `rgba(${s.c},${s.a * .8})`);
      g.addColorStop(.45, `rgba(${s.c},${s.a * .62})`);
      g.addColorStop(.72, `rgba(${s.c},${s.a * .5})`);    // leve acúmulo de pigmento
      g.addColorStop(.9, `rgba(${s.c},${s.a * .16})`);
      g.addColorStop(1, `rgba(${s.c},0)`);
      x.fillStyle = g;
      x.beginPath(); x.ellipse(ox, oy, r, r * (.75 + rnd() * .4), rnd() * TAU, 0, TAU); x.fill();
    }
  }
}

/* ---------- detalhes compartilhados por todas as composições ---------- */
const palette = { ink, leafA, leafB };
function leaf(x, bx, by, ang, len, wid, bend, u) {
  drawLeaf(x, bx, by, ang, len, wid, bend, u, palette);
}
function lily(x, cx, cy, r, rot, rnd, u) {
  drawLily(x, cx, cy, r, rot, rnd, u);
}
function bud(x, bx, by, ang, len, u) {
  drawBud(x, bx, by, ang, len, u, palette);
}

/* ---------- miosótis ---------- */
function forgetMeNot(x, cx, cy, s, rnd, u) {
  const rot = rnd() * TAU;
  for (let i = 0; i < 5; i++) {
    const a = rot + i * TAU / 5, px = cx + Math.cos(a) * s * .46, py = cy + Math.sin(a) * s * .46;
    const g = x.createRadialGradient(px, py, 0, px, py, s * .44);
    g.addColorStop(0, "rgba(218,222,223,.95)"); g.addColorStop(1, "rgba(155,174,212,.92)");
    x.beginPath(); x.arc(px, py, s * .42, 0, TAU); x.fillStyle = g; x.fill();
    x.lineWidth = .45 * u; x.strokeStyle = ink(.32); x.stroke();
    // Nervura e reflexo discretos nas flores pequenas que acompanham os lírios.
    x.beginPath(); x.moveTo(cx + Math.cos(a) * s * .19, cy + Math.sin(a) * s * .19);
    x.quadraticCurveTo(px - Math.sin(a) * s * .045, py + Math.cos(a) * s * .045, px + Math.cos(a) * s * .27, py + Math.sin(a) * s * .27);
    x.lineWidth = .27 * u; x.strokeStyle = "rgba(93,123,159,.35)"; x.stroke();
    x.beginPath(); x.arc(px - s * .08, py - s * .08, s * .18, a + .4, a + 2.2);
    x.lineWidth = .35 * u; x.strokeStyle = "rgba(249,251,255,.45)"; x.stroke();
  }
  x.beginPath(); x.arc(cx, cy, s * .2, 0, TAU); x.fillStyle = "rgba(255,252,240,.95)"; x.fill();
  x.beginPath(); x.arc(cx, cy, s * .11, 0, TAU); x.fillStyle = "rgba(232,192,92,.95)"; x.fill();
  for (let i = 0; i < 5; i++) {
    const a = rot + i * TAU / 5;
    x.beginPath(); x.arc(cx + Math.cos(a) * s * .12, cy + Math.sin(a) * s * .12, s * .026, 0, TAU);
    x.fillStyle = "rgba(148,125,69,.55)"; x.fill();
  }
}

/* ---------- ramo completo, crescendo a partir de (bx,by) na direção ang ---------- */
function sprig(x, bx, by, L, ang, rnd, u, o = {}) {
  x.save();
  x.translate(bx, by); x.rotate(ang + Math.PI / 2);   // eixo local: cresce para -y
  const sway = (o.sway ?? (rnd() - .5) * .3) * L;
  const P = t => { const it = 1 - t; return [2 * it * t * sway * 1.4 + t * t * sway * .6, -(2 * it * t * L * .5 + t * t * L)]; };
  const flower = o.flower !== false, top = flower ? .86 : .96;

  // folhas (atrás do caule)
  const leaves = o.leaves ?? [.08, .17, .27, .38, .5, .62];
  leaves.forEach((t, i) => {
    const s = i % 2 ? 1 : -1, [lx, ly] = P(t * top);
    const len = L * (.46 - t * .3) * (o.leafScale ?? 1), a = -Math.PI / 2 + s * (.42 + rnd() * .38);
    leaf(x, lx, ly, a, len, len * .13, s * (.05 + rnd() * .06), u);
  });

  // Caule afilado cuja curva passa exatamente por cada inserção de folha.
  const [ex, ey] = P(top);
  drawStem(x, t => P(t * top), Math.max(2.7 * u, L * .006), u, palette);
  // Nós e bases engainantes conectam a folhagem ao caule.
  leaves.forEach((t, i) => {
    const [nx, ny] = P(t * top);
    const a = P(t * top - .005), b = P(t * top + .005);
    drawNode(x, nx, ny, Math.atan2(b[1] - a[1], b[0] - a[0]), i % 2 ? 1 : -1, u, palette);
  });

  // botões em hastes laterais
  const buds = o.buds ?? (flower ? [.66] : [.8, .62]);
  buds.forEach((t, i) => {
    const s = i % 2 ? -1 : 1, [sx, sy] = P(t * top);
    const a = -Math.PI / 2 + s * (.5 + rnd() * .25), sl = L * .1;
    const hx = sx + Math.cos(a) * sl, hy = sy + Math.sin(a) * sl;
    const qx = sx + Math.cos(a) * sl * .4, qy = sy + Math.sin(a) * sl * .6;
    drawStem(x, t => [(1 - t) ** 2 * sx + 2 * (1 - t) * t * qx + t * t * hx,
      (1 - t) ** 2 * sy + 2 * (1 - t) * t * qy + t * t * hy], 1.65 * u, u, palette);
    drawNode(x, sx, sy, a, s, .65 * u, palette);
    bud(x, hx, hy, a - s * .15, L * .17, u);
  });
  if (!flower) bud(x, ex, ey, -Math.PI / 2 + sway / L * .4, L * .19, u);

  // miosótis espalhados
  const n = o.fmn ?? 4;
  for (let i = 0; i < n; i++) {
    const t = .12 + rnd() * .42, [fx, fy] = P(t);
    const side = rnd() < .5 ? -1 : 1;
    const hx = fx + side * L * (.06 + rnd() * .1), hy = fy + (rnd() - .5) * L * .06;
    const size = L * (.034 + rnd() * .016), qx = fx + (hx - fx) * .55, qy = fy - L * .027;
    // Até as pequenas flores laterais têm haste e folha conectadas ao ramo.
    drawStem(x, t => [(1 - t) ** 2 * fx + 2 * (1 - t) * t * qx + t * t * hx,
      (1 - t) ** 2 * fy + 2 * (1 - t) * t * qy + t * t * hy], .95 * u, u, palette);
    leaf(x, fx + (hx - fx) * .42, fy + (hy - fy) * .3 - L * .013,
      -Math.PI / 2 + side * .72, L * .043, L * .0055, side * .06, u * .65);
    forgetMeNot(x, hx, hy, size, rnd, u);
  }

  if (flower) {
    drawStem(x, t => [ex, ey - L * .02 * t], 1.15 * u, u, palette);
  }
  if (flower) lily(x, ex, ey - L * .02, L * (o.lilyScale ?? .2), -Math.PI / 2 + (rnd() - .5) * .6, rnd, u);
  x.restore();
}

/* ---------- alianças entrelaçadas (único uso do dourado) ---------- */
function rings(x, cx, cy, r, u) {
  const ring = (ox, oy) => {
    const g = x.createLinearGradient(ox - r, oy - r, ox + r, oy + r);
    g.addColorStop(0, "rgba(220,204,150,1)"); g.addColorStop(.45, "rgba(185,163,106,1)");
    g.addColorStop(.7, "rgba(232,220,174,1)"); g.addColorStop(1, "rgba(150,128,74,1)");
    x.beginPath(); x.arc(ox, oy, r, 0, TAU); x.lineWidth = r * .2; x.strokeStyle = g; x.stroke();
    x.beginPath(); x.arc(ox, oy, r * 1.1, 0, TAU); x.lineWidth = .5 * u; x.strokeStyle = "rgba(120,98,52,.5)"; x.stroke();
  };
  ring(cx - r * .55, cy); ring(cx + r * .55, cy + r * .18);
  // reforça o entrelaçado: um trecho do primeiro anel por cima do segundo
  const g = x.createLinearGradient(cx, cy - r, cx + r, cy);
  g.addColorStop(0, "rgba(220,204,150,1)"); g.addColorStop(1, "rgba(185,163,106,1)");
  x.beginPath(); x.arc(cx - r * .55, cy, r, -.55, .15); x.lineWidth = r * .2; x.strokeStyle = g; x.stroke();
}

/* ---------- composições prontas ---------- */
const PRESETS = {
  sprig(x, W, H, rnd, u) {
    sprig(x, W * .5, H * .98, H * .9, -Math.PI / 2 - .06, rnd, u, { sway: .08 });
  },
  "sprig-lean"(x, W, H, rnd, u) {
    sprig(x, W * .12, H * .98, H * .95, -Math.PI / 2 + .5, rnd, u, { sway: -.05, fmn: 3 });
  },
  corner(x, W, H, rnd, u) {
    wash(x, [
      { x: W * .22, y: H * .2, r: W * .34, c: "218,222,223", a: .32 },
      { x: W * .42, y: H * .1, r: W * .26, c: "155,174,212", a: .26 },
      { x: W * .1, y: H * .42, r: W * .24, c: "149,165,141", a: .12 }
    ], rnd);
    sprig(x, -W * .02, -H * .02, W * .78, .3, rnd, u, { flower: false, fmn: 3 });
    sprig(x, -W * .02, -H * .02, W * .9, .78, rnd, u, { lilyScale: .21 });
    sprig(x, -W * .02, -H * .02, W * .72, 1.22, rnd, u, { lilyScale: .19 });
  },
  garland(x, W, H, rnd, u) {
    wash(x, [
      { x: W * .3, y: H * .45, r: H * .5, c: "218,222,223", a: .26 },
      { x: W * .7, y: H * .4, r: H * .5, c: "155,174,212", a: .22 }
    ], rnd);
    sprig(x, W * .5, H * .64, W * .44, Math.PI + .3, rnd, u, { flower: false, fmn: 3, leafScale: .9 });
    sprig(x, W * .5, H * .64, W * .44, -.3, rnd, u, { flower: false, fmn: 3, leafScale: .9 });
    sprig(x, W * .5, H * .7, H * .62, -Math.PI / 2, rnd, u, { lilyScale: .3, leaves: [.12, .24], buds: [], fmn: 1 });
    rings(x, W * .5, H * .86, H * .065, u);
  },
  ornament(x, W, H, rnd, u) {
    sprig(x, W * .5, H * .96, H * .78, -Math.PI / 2 - .55, rnd, u, { flower: false, fmn: 2, leafScale: .85 });
    sprig(x, W * .5, H * .96, H * .78, -Math.PI / 2 + .55, rnd, u, { flower: false, fmn: 2, leafScale: .85 });
    sprig(x, W * .5, H * .96, H * .7, -Math.PI / 2, rnd, u, { lilyScale: .26, leaves: [.14, .3], buds: [], fmn: 0 });
  },
  arch(x, W, H, rnd, u) {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, T.bg[0]); g.addColorStop(1, T.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    wash(x, [
      { x: W * (.25 + rnd() * .2), y: H * (.28 + rnd() * .1), r: W * .5, c: "218,222,223", a: .42 },
      { x: W * (.62 + rnd() * .2), y: H * (.42 + rnd() * .12), r: W * .48, c: "155,174,212", a: .36 },
      { x: W * .5, y: H * .9, r: W * .5, c: "149,165,141", a: .16 }
    ], rnd);
    sprig(x, W * .5, H * 1.02, H * .58, -Math.PI / 2 - .42, rnd, u, { flower: false, fmn: 3 });
    sprig(x, W * .5, H * 1.02, H * .74, -Math.PI / 2 + .05, rnd, u, { lilyScale: .2 });
    sprig(x, W * .5, H * 1.02, H * .6, -Math.PI / 2 + .45, rnd, u, { lilyScale: .17 });
  },
  wash(x, W, H, rnd) {
    wash(x, [
      { x: W * .3, y: H * .4, r: W * .26, c: "218,222,223", a: .34 },
      { x: W * .7, y: H * .55, r: W * .26, c: "155,174,212", a: .28 },
      { x: W * .5, y: H * .8, r: W * .2, c: "149,165,141", a: .1 }
    ], rnd);
  },
  gift(x, W, H, rnd, u, hue) {
    const tones = { neutral: "218,222,223", mist: "155,174,212", sage: "192,207,178" };
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, T.giftBg[0]); g.addColorStop(1, T.giftBg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    wash(x, [
      { x: W * (.3 + rnd() * .4), y: H * (.3 + rnd() * .2), r: W * .55, c: tones[hue] || tones.neutral, a: .38 },
      { x: W * (.3 + rnd() * .4), y: H * .7, r: W * .4, c: hue === "mist" ? tones.neutral : tones.mist, a: .2 }
    ], rnd);
    const flower = rnd() > .25;
    sprig(x, W * (.42 + rnd() * .16), H * 1.02, H * (.7 + rnd() * .12), -Math.PI / 2 + (rnd() - .5) * .5, rnd, u, { flower, lilyScale: .22 });
  },
  liner(x, W, H, rnd, u) {
    x.fillStyle = "#9BAED4"; x.fillRect(0, 0, W, H);
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    const o = off.getContext("2d");
    sprig(o, W * .25, H * .55, H * .42, -Math.PI / 2 - .4, rnd, u, { lilyScale: .24, fmn: 1 });
    sprig(o, W * .75, H * 1.05, H * .42, -Math.PI / 2 + .4, rnd, u, { lilyScale: .24, fmn: 1 });
    // Mantém nervuras e dobras visíveis no padrão delicado do forro.
    o.globalCompositeOperation = "source-atop"; o.fillStyle = "rgba(255,255,255,.24)"; o.fillRect(0, 0, W, H);
    x.save(); x.globalAlpha = .72; x.drawImage(off, 0, 0); x.restore();
    x.fillStyle = "rgba(255,255,255,.5)";
    for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(rnd() * W, rnd() * H, 1.2 * u, 0, TAU); x.fill(); }
  }
};
const SIZES = {
  sprig: [600, 760], "sprig-lean": [700, 760], corner: [800, 800], garland: [900, 400], ornament: [600, 440],
  arch: [760, 1050], wash: [1400, 900], gift: [600, 750], liner: [240, 240]
};

const cache = new Map();
export function artURL(preset, seed = 1, hue = "", tone = "light") {
  const key = `${preset}|${seed}|${hue}|${tone}`;
  if (BOTANICAL_ASSETS[key]) return BOTANICAL_ASSETS[key];
  if (cache.has(key)) return cache.get(key);
  const [W, H] = SIZES[preset] || [600, 600];
  const scale = preset === "liner" || preset === "wash" ? 1 : 1.5;
  const c = document.createElement("canvas"); c.width = Math.round(W * scale); c.height = Math.round(H * scale);
  const x = c.getContext("2d");
  x.scale(scale, scale);
  x.lineCap = "round"; x.lineJoin = "round";
  const u = Math.min(W, H) / 420;
  T = TONES[tone] || TONES.light;
  (PRESETS[preset] || PRESETS.sprig)(x, W, H, seeded(seed * 31 + preset.length), u, hue);
  const url = c.toDataURL("image/webp", .94);
  cache.set(key, url);
  return url;
}
