// Entradas ao rolar, sem deixar conteudo preso em opacity:0 antes da abertura.
import { $$, motionOK } from "../core/dom.js";
import { onView } from "../core/entrance.js";

export function initReveals() {
  if (!motionOK) return;
  onView($$(".title").filter(t => !t.closest(".hero")), titles => {
    titles.forEach(t => gsap.fromTo(t.querySelectorAll(".ln > span"), { yPercent: 115 },
      { yPercent: 0, duration: 1.6, ease: "power4.out", stagger: .12, clearProps: "transform" }));
  }, .86);
  onView($$("#site [data-reveal]"), items => gsap.fromTo(items, { autoAlpha: 0, y: 26 },
    { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: .08, overwrite: "auto", clearProps: "transform,opacity,visibility" }));
  onView($$(".ch-media"), items => gsap.fromTo(items, { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power3.inOut", clearProps: "clipPath" }), .85);
  onView($$(".ch-text"), items => items.forEach(t => gsap.fromTo(t.children, { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: .1, clearProps: "transform,opacity,visibility" })), .88);
  onView($$(".ornament, .footer-art"), items => gsap.fromTo(items, { autoAlpha: 0, scale: .92 },
    { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform,opacity,visibility" }));
}
