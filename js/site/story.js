// Nossa história: o ano em destaque acompanha o capítulo que está na tela
import { $, $$, motionOK } from "../core/dom.js";

export function initStory() {
  const yearEl = $("#storyYear"), idxEl = $("#storyIdx");
  let current = yearEl.textContent;
  const setYear = (year, idx) => {
    if (year === current) return;
    current = year;
    idxEl.textContent = idx;
    if (!motionOK) { yearEl.textContent = year; return; }
    gsap.timeline()
      .to(yearEl, { yPercent: -105, duration: .5, ease: "power3.in" })
      .call(() => { yearEl.textContent = year; })
      .fromTo(yearEl, { yPercent: 105 }, { yPercent: 0, duration: .9, ease: "power4.out" });
  };
  $$(".chapter").forEach(ch => {
    ScrollTrigger.create({ trigger: ch, start: "top 60%", end: "bottom 60%",
      onToggle: s => { if (s.isActive) setYear(ch.dataset.year, ch.dataset.idx); } });
  });
}
