// Topo: entrada coreografada, contagem regressiva e um leve paralaxe
import { $, $$, motionOK } from "../core/dom.js";
import { CONFIG } from "../data/config.js";

export function initHero() {
  startCountdown();
  if (!motionOK) return;
  gsap.to(".hero-figure", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-text", { yPercent: 6, autoAlpha: .3, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
}

// timeline pausada; quem chama decide quando tocar (por baixo do véu da transição)
export function heroIn() {
  const tl = gsap.timeline({ paused: true });
  if (!motionOK) return tl;
  tl.fromTo(".hero-names .ln > span", { yPercent: 115 }, { yPercent: 0, duration: 1.7, ease: "power4.out", stagger: .14 }, 0)
    .fromTo(".hero [data-hero]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power3.out", stagger: .1 }, .5)
    .fromTo(".hero .arch", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "power3.inOut" }, .1)
    .fromTo(".hero .arch-line", { autoAlpha: 0, x: -12, y: 12 }, { autoAlpha: 1, x: 0, y: 0, duration: 1.6, ease: "power3.out" }, .9)
    .fromTo(".hero-vert, .scroll-hint", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 1.4);
  tl.progress(0);
  return tl;
}

function startCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const out = $$("[data-cd]");
  const tick = () => {
    const d = Math.max(0, target - Date.now());
    const v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
    v.forEach((n, i) => { const s = String(n).padStart(2, "0"); if (out[i].textContent !== s) out[i].textContent = s; });
  };
  tick();
  setInterval(tick, 1000);
}
