// O grande dia: links de mapa/agenda e programação com linhas pontilhadas
import { $$, motionOK } from "../core/dom.js";
import { CONFIG, calendarUrl } from "../data/config.js";
import { onView } from "../core/entrance.js";

export function initDay() {
  $$("[data-maps]").forEach(a => { a.href = CONFIG.mapsUrl; });
  $$("[data-calendar]").forEach(a => { a.href = calendarUrl(); });
  if (!motionOK) return;
  onView($$(".program-list li"), items => items.forEach(li => {
    const tl = gsap.timeline();
    tl.fromTo(li, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out" })
      .fromTo(li.querySelector(".leader"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, .15);
  }), .88);
}
