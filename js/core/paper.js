// Texturas de papel geradas em canvas: grão e borda artesanal (deckle)
import { seeded } from "./dom.js";

function makeGrain() {
  const c = document.createElement("canvas");
  c.width = c.height = 200;
  const x = c.getContext("2d");
  const d = x.createImageData(200, 200);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = 90 + Math.random() * 70;
    d.data[i] = v; d.data[i + 1] = v - 4; d.data[i + 2] = v - 16;
    d.data[i + 3] = Math.random() < .55 ? Math.random() * 22 : 0;
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL("image/png");
}

// Máscara com bordas irregulares, como papel de algodão rasgado à mão
function makeDeckle(w, h, seed = 1, amp = 5) {
  const rnd = seeded(seed);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  const m = amp + 3;

  const edge = (len, step) => {          // passeio aleatório suave
    const pts = []; let v = 0;
    for (let i = 0; i <= len; i += step) {
      v += (rnd() - .5) * amp * .9;
      v *= .82;
      pts.push(v + (rnd() - .5) * amp * .5);
    }
    return pts;
  };
  const trace = (a) => {
    x.beginPath();
    const s = 3, top = edge(w, s), right = edge(h, s), bottom = edge(w, s), left = edge(h, s);
    top.forEach((v, i) => x.lineTo(i * s, m + v * a));
    right.forEach((v, i) => x.lineTo(w - m + v * a, i * s));
    bottom.forEach((v, i) => x.lineTo(w - i * s, h - m + v * a));
    left.forEach((v, i) => x.lineTo(m + v * a, h - i * s));
    x.closePath();
  };
  x.fillStyle = "rgba(0,0,0,.45)"; trace(1.6); x.fill();   // fibras translúcidas
  x.fillStyle = "#000"; trace(1); x.fill();                 // corpo do papel
  return c.toDataURL("image/png");
}

export function applyPaperTextures() {
  const root = document.documentElement.style;
  root.setProperty("--grain", `url("${makeGrain()}")`);
  root.setProperty("--deckle", `url("${makeDeckle(600, 900, 3, 4)}")`);
  root.setProperty("--deckle-wide", `url("${makeDeckle(760, 1000, 8, 4)}")`);
}
