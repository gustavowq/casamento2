// Atalhos e utilidades compartilhadas
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const rand = (a, b) => a + Math.random() * (b - a);
export const wait = ms => new Promise(r => setTimeout(r, ms));
export const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
export const motionOK = !matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

// gerador pseudoaleatório com semente (desenhos sempre iguais para a mesma semente)
export function seeded(seed = 1) {
  let s = Math.floor(seed * 9973) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
