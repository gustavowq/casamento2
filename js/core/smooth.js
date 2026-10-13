// Rolagem suave (Lenis) integrada ao ScrollTrigger; desligada se o usuário prefere menos movimento
import { motionOK } from "./dom.js";

let lenis = null;

export function initSmooth() {
  if (!motionOK || !window.Lenis) return;
  lenis = new window.Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
export const smoothStart = () => lenis && lenis.start();
export const smoothStop = () => lenis && lenis.stop();

export function scrollToTarget(target, { immediate = false } = {}) {
  if (lenis) return lenis.scrollTo(target, { offset: 0, immediate, duration: 1.8, force: true });
  const y = typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: y, behavior: immediate || !motionOK ? "auto" : "smooth" });
}
