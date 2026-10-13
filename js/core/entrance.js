// O conteúdo permanece visível. A animação começa quando a página é liberada e o elemento entra na tela.
import { $$, motionOK } from "./dom.js";

const groups = [];
let active = false;

function observe(group) {
  if (!active || !group.targets.size || !window.IntersectionObserver) return;
  group.observer?.disconnect();
  group.observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
    if (!visible.length) return;
    visible.forEach(target => {
      group.targets.delete(target);
      group.observer.unobserve(target);
    });
    group.onEnter(visible);
  }, { rootMargin: `0px 0px -${Math.round(innerHeight * (1 - group.start))}px 0px` });
  group.targets.forEach(target => group.observer.observe(target));
}

export function onView(targets, onEnter, start = .9) {
  if (!motionOK) return;
  const group = { targets: new Set(typeof targets === "string" ? $$(targets) : targets), onEnter, start };
  groups.push(group);
  observe(group);
}

export function startEntrances() {
  active = true;
  groups.forEach(observe);
}

export function stopEntrances() {
  active = false;
  groups.forEach(group => group.observer?.disconnect());
}

addEventListener("resize", () => { if (active) groups.forEach(observe); });
