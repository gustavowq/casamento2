// Dress code: abas Elas/Eles com fio deslizante e paleta de tecidos
import { $, $$, motionOK } from "../core/dom.js";
import { onView } from "../core/entrance.js";

export function initDress() {
  const tabs = $$(".tab"), ink = $(".tabs-ink");
  const place = t => { ink.style.setProperty("--x", `${t.offsetLeft}px`); ink.style.setProperty("--w", `${t.offsetWidth}px`); };
  const select = (t, focus) => {
    tabs.forEach(o => {
      const on = o === t;
      o.setAttribute("aria-selected", String(on)); o.tabIndex = on ? 0 : -1;
      const panel = $(`#${o.getAttribute("aria-controls")}`);
      if (on && panel.hidden) {
        panel.hidden = false;
        if (motionOK) gsap.fromTo(panel.children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .8, stagger: .08, ease: "power3.out" });
      } else if (!on) panel.hidden = true;
    });
    place(t);
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true); }
    });
  });
  requestAnimationFrame(() => place(tabs[0]));
  addEventListener("resize", () => place(tabs.find(t => t.getAttribute("aria-selected") === "true")));
  document.fonts && document.fonts.ready.then(() => place(tabs.find(t => t.getAttribute("aria-selected") === "true")));

  const sw = $$(".swatch"), cap = $("#swatchCaption"), mid = (sw.length - 1) / 2;
  sw.forEach(s => s.addEventListener("click", () => {
    sw.forEach(o => o.classList.toggle("is-active", o === s));
    cap.innerHTML = `<span class="label">${s.dataset.name}</span><em>${s.dataset.note}</em>`;
    if (motionOK) gsap.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .6, ease: "power2.out" });
  }));
  onView([$("#swatches")], () => gsap.fromTo(sw,
    { x: i => (mid - i) * sw[0].offsetWidth * .55, autoAlpha: 0, scale: .9 },
    { x: 0, autoAlpha: 1, scale: 1, duration: 1.8, ease: "power4.out", stagger: .06, clearProps: "transform,opacity,visibility",
      onStart: () => sw.forEach(s => s.classList.add("is-entering")),
      onComplete: () => sw.forEach(s => s.classList.remove("is-entering")) }), .82);
}
