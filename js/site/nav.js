// Navegação: fica sólida ao rolar, esconde ao descer e volta ao subir; menu de tela cheia no celular
import { $, $$, motionOK } from "../core/dom.js";
import { app } from "../core/state.js";
import { scrollToTarget } from "../core/smooth.js";
import { backToInvite } from "../invite/transition.js";

const site = () => $("#site");

export function closeMenu() {
  site().classList.remove("menu-open");
  $("#navMenu").setAttribute("aria-expanded", "false");
  $("#navMenu").textContent = "Menu";
}

export function initNav() {
  const nav = $("#nav"), links = $$(".nav-links a");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle("is-solid", y > 40);
      const menuOpen = site().classList.contains("menu-open");
      nav.classList.toggle("is-hidden", !menuOpen && y > innerHeight * .9 && self.direction === 1);
    }
  });
  links.forEach(a => {
    const sec = $(a.getAttribute("href"));
    ScrollTrigger.create({ trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: s => { if (s.isActive) links.forEach(l => l.classList.toggle("is-active", l === a)); } });
  });

  $("#navMenu").addEventListener("click", () => {
    const open = !site().classList.contains("menu-open");
    site().classList.toggle("menu-open", open);
    $("#navMenu").setAttribute("aria-expanded", String(open));
    $("#navMenu").textContent = open ? "Fechar" : "Menu";
    if (open && motionOK) gsap.fromTo($$("#menu .menu-links a, #menu > .link"), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: .06, ease: "power3.out", delay: .1 });
  });

  // âncoras internas com rolagem suave
  site().addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || app.state !== "site") return;
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target.id === "inicio" ? 0 : target);
  });

  $$("[data-back]").forEach(b => b.addEventListener("click", backToInvite));
}
