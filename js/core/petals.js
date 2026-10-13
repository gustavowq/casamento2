// Petalas brancas, verdes suaves e azuis da paleta.
import { $, rand, motionOK } from "./dom.js";

const live = new Set();

export function driftPetals({ count = 18, spread = 4 } = {}) {
  if (!motionOK) return;
  const layer = $("#petals"), W = innerWidth, H = innerHeight;
  const kinds = ["w", "w", "b", "m", "b"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div"), s = rand(9, 17);
    p.className = `petal petal--${kinds[i % kinds.length]}`;
    p.style.width = `${s}px`; p.style.height = `${s * rand(.8, 1.1)}px`;
    layer.appendChild(p); live.add(p);
    gsap.set(p, { x: rand(-.05, 1.05) * W, y: -30, rotation: rand(0, 360), autoAlpha: 0 });
    const dur = rand(8, 13), delay = rand(0, spread);
    const done = () => { gsap.killTweensOf(p); p.remove(); live.delete(p); };
    gsap.to(p, { autoAlpha: .9, duration: 1.2, delay });
    gsap.to(p, { y: H + 40, duration: dur, delay, ease: "none", onComplete: done });
    gsap.to(p, { x: `+=${rand(-110, 110)}`, duration: rand(2.6, 4), delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(p, { rotation: `+=${rand(-200, 200)}`, rotationX: rand(180, 540), duration: dur, delay, ease: "none" });
  }
}

export function clearPetals(fade = true) {
  live.forEach(p => {
    if (fade) gsap.to(p, { autoAlpha: 0, duration: .6, onComplete: () => { gsap.killTweensOf(p); p.remove(); } });
    else { gsap.killTweensOf(p); p.remove(); }
  });
  live.clear();
}
