// Pequenos componentes de interface reutilizáveis
import { $ } from "./dom.js";

export function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  gsap.killTweensOf(el);
  gsap.timeline()
    .fromTo(el, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: .6, ease: "power3.out" })
    .to(el, { autoAlpha: 0, y: -8, duration: .5, ease: "power2.in", delay: 3 });
}

export function copyText(text, message = "Copiado.") {
  const fallback = () => {
    const t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); toast(message); } catch (e) { toast(text); }
    t.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(message), fallback);
  else fallback();
}
