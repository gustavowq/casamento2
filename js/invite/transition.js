// Passagem convite → site: o papel do cartão se expande até cobrir a tela e revela o site.
import { $, $$ } from "../core/dom.js";
import { app, lockScroll } from "../core/state.js";
import { clearPetals } from "../core/petals.js";
import { smoothStart, smoothStop, scrollToTarget } from "../core/smooth.js";
import { inv, stopAuto, resetInvite, showIntro } from "./sequence.js";
import { initSiteOnce, heroIn, closeMenu } from "../site/site.js";
import { startEntrances, stopEntrances } from "../core/entrance.js";

export function enterSite() {
  if (app.state !== "open") return;
  app.state = "entering";
  stopAuto();
  const veil = $("#veil"), site = $("#site");
  initSiteOnce();
  scrollToTarget(0, { immediate: true });
  site.inert = false;
  const hero = heroIn();                 // estado inicial do topo já aplicado, por baixo do véu

  gsap.timeline()
    .to(inv.controls, { autoAlpha: 0, duration: .5 }, 0)
    .to($$(".card-paper > *", inv.card), { autoAlpha: 0, duration: .55, ease: "power2.in" }, 0)
    .call(() => {
      const r = inv.card.getBoundingClientRect();
      gsap.set(veil, { autoAlpha: 1, clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)` });
    }, null, .55)
    .to(veil, { clipPath: "inset(0px 0px 0px 0px)", duration: 1.3, ease: "power3.inOut" }, .6)
    .call(() => {
      inv.opening.style.display = "none";
      clearPetals(false);
      lockScroll(false);
      smoothStart();
      ScrollTrigger.refresh();
      startEntrances();
    }, null, 1.95)
    .to(veil, { autoAlpha: 0, duration: 1.2, ease: "power2.out" }, 2.05)
    .add(hero.play(), 2.15)
    .call(() => { app.state = "site"; }, null, 2.6);
}

export function backToInvite() {
  if (app.state !== "site") return;
  app.state = "leaving";
  stopEntrances();
  closeMenu();
  const veil = $("#veil"), site = $("#site");
  gsap.timeline()
    .set(veil, { clipPath: "inset(0px 0px 0px 0px)" })
    .to(veil, { autoAlpha: 1, duration: .9, ease: "power2.inOut" })
    .call(() => {
      smoothStop();
      scrollToTarget(0, { immediate: true });
      lockScroll(true);
      site.inert = true;
      inv.opening.style.display = "";
      resetInvite();
      showIntro();
    })
    .to(veil, { autoAlpha: 0, duration: 1.1, ease: "power2.out" }, "+=.15");
}
