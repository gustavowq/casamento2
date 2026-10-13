// Dúvidas: acordeão com animação de altura feita em CSS
import { $$ } from "../core/dom.js";

export function initFaq() {
  $$(".faq-q").forEach(q => q.addEventListener("click", () => {
    const item = q.parentElement, open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    q.setAttribute("aria-expanded", String(open));
    setTimeout(() => ScrollTrigger.refresh(), 850);
  }));
}
