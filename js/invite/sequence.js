// Abertura do convite: o selo racha, a aba gira em 3D, o cartão sai do envelope e se centraliza.
import { $, $$, motionOK } from "../core/dom.js";
import { app } from "../core/state.js";
import { driftPetals, clearPetals } from "../core/petals.js";
import { CONFIG } from "../data/config.js";
import { enterSite } from "./transition.js";

export const inv = {};
let tlOpen = null, tlCard = null, tlAuto = null, hintTw = null;

export function initInvite() {
  Object.assign(inv, {
    opening: $("#opening"), head: $("#opHead"), wrap: $("#envWrap"), envelope: $("#envelope"),
    hint: $("#opHint"), seal: $("#seal"), halfL: $("#halfL"), halfR: $("#halfR"), crack: $("#sealCrack"), sprig: $("#envSprig"),
    flap: $("#flap"), flapShadow: $("#flapShadow"), pocket: $("#pocket"), card: $("#card"), layer: $("#cardLayer"),
    controls: $("#opControls"), enter: $("#opEnter"), again: $("#opAgain"), progress: $("#opProgress"),
    corners: $$(".op-corner")
  });
  gsap.set([inv.head, inv.wrap, inv.hint, ...inv.corners], { autoAlpha: 0 });
  inv.wrap.addEventListener("click", openInvite);
  inv.wrap.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvite(); } });
  inv.again.addEventListener("click", replayInvite);
  inv.enter.addEventListener("click", enterSite);
  addEventListener("resize", () => {
    if (app.state !== "open") return;
    const t = cardTarget();
    gsap.set(inv.card, { width: t.W, x: t.x, y: t.y, scale: 1 });
  });
}

/* ---------- entrada da cena ---------- */
export function showIntro() {
  inv.wrap.classList.add("is-introducing");
  gsap.fromTo(inv.corners, { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: 2.6, ease: "power2.out", stagger: .25 });
  gsap.fromTo([inv.head, inv.wrap], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.8, ease: "power3.out", stagger: .2, delay: .2,
    onComplete: () => { gsap.set(inv.wrap, { clearProps: "transform" }); inv.wrap.classList.remove("is-introducing"); } });
  $("span", inv.hint).textContent = "Toque no selo para abrir";
  gsap.fromTo(inv.hint, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, delay: 1 });
  hintTw && hintTw.kill();
  if (motionOK) hintTw = gsap.fromTo($$("i", inv.hint), { scaleX: 1 }, { scaleX: .35, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
  inv.wrap.classList.add("is-ready");
  inv.wrap.setAttribute("aria-disabled", "false");
  app.state = "idle";
}

/* ---------- lascas de cera ---------- */
function addWaxChips(timeline, ew) {
  // Lascas discretas, na mesma timeline para limpar corretamente no replay.
  [{ top: 34, side: -1, size: .0045 }, { top: 61, side: 1, size: .006 }, { top: 78, side: -1, size: .0035 }].forEach((chip, i) => {
    const c = document.createElement("i"), s = ew * chip.size, at = 1.12 + i * .09;
    c.className = "wax-chip";
    Object.assign(c.style, { width: `${s}px`, height: `${s * .8}px`, left: "49%", top: `${chip.top}%` });
    inv.seal.appendChild(c);
    timeline
      .set(c, { autoAlpha: .8 }, at)
      .to(c, { x: chip.side * ew * .012, y: ew * .008, rotation: chip.side * 16, duration: .32, ease: "sine.out" }, at)
      .to(c, { x: chip.side * ew * .022, y: ew * .1, rotation: chip.side * 42, duration: .76, ease: "power2.in" }, at + .32)
      .to(c, { autoAlpha: 0, duration: .46, ease: "sine.in" }, at + .62)
      .call(() => c.remove(), null, at + 1.08);
  });
}

function animateSeal(timeline, ew) {
  if (!motionOK) {
    timeline.to(inv.seal, { autoAlpha: 0, duration: .28 }, .05);
    return;
  }
  timeline
    // Pressão e recuperação suaves, sem ressalto elástico.
    .to(inv.seal, { scaleX: 1.012, scaleY: .968, y: ew * .002, duration: .34, ease: "sine.inOut" }, .05)
    .to(inv.seal, { scaleX: 1, scaleY: 1, y: 0, duration: .48, ease: "sine.inOut" }, .39)
    .to(inv.crack, { opacity: .85, duration: .22, ease: "sine.in" }, .44)
    .to($$("path", inv.crack), { strokeDashoffset: 66, duration: .25, ease: "sine.in" }, .44)
    .to($$("path", inv.crack), { strokeDashoffset: 38, duration: .21, ease: "sine.inOut" }, .69)
    .to($$("path", inv.crack), { strokeDashoffset: 0, duration: .3, ease: "sine.out" }, .9)
    // A tensão cede primeiro no topo; as metades se afastam pouco a pouco.
    .to(inv.halfL, { x: -ew * .0015, rotation: -.65, duration: .32, ease: "sine.inOut" }, .76)
    .to(inv.halfR, { x: ew * .001, rotation: .5, duration: .36, ease: "sine.inOut" }, .8)
    .to(inv.halfL, { x: -ew * .007, y: ew * .001, rotation: -2.4, duration: .4, ease: "sine.inOut" }, 1.08)
    .to(inv.halfR, { x: ew * .006, y: -ew * .001, rotation: 1.9, duration: .44, ease: "sine.inOut" }, 1.14)
    .to(inv.crack, { opacity: 0, duration: .2 }, 1.18)
    // Desprendimento, inclinação e queda progressiva, com uma leve assimetria.
    .to(inv.halfL, { x: -ew * .013, y: ew * .018, rotation: -5, rotationY: -7, duration: .34, ease: "sine.in" }, 1.48)
    .to(inv.halfR, { x: ew * .012, y: ew * .014, rotation: 4, rotationY: 6, duration: .36, ease: "sine.in" }, 1.58)
    .to(inv.halfL, { x: -ew * .027, y: ew * .095, rotation: -10, rotationY: -12, duration: .4, ease: "none" }, 1.82)
    .to(inv.halfR, { x: ew * .025, y: ew * .083, rotation: 8, rotationY: 10, duration: .4, ease: "none" }, 1.94)
    .to(inv.halfL, { x: -ew * .043, y: ew * .24, rotation: -16, rotationY: -16, duration: .44, ease: "power1.in" }, 2.22)
    .to(inv.halfR, { x: ew * .04, y: ew * .22, rotation: 14, rotationY: 14, duration: .44, ease: "power1.in" }, 2.34)
    .to(inv.halfL, { autoAlpha: 0, duration: .64, ease: "sine.inOut" }, 1.98)
    .to(inv.halfR, { autoAlpha: 0, duration: .64, ease: "sine.inOut" }, 2.1);
  addWaxChips(timeline, ew);
}

/* ---------- abrir ---------- */
function openInvite() {
  if (app.state !== "idle") return;
  app.state = "opening";
  hintTw?.kill(); hintTw = null;
  // Encerra a entrada se o convidado tocar antes de ela terminar.
  gsap.killTweensOf([inv.wrap, inv.head]);
  gsap.set(inv.wrap, { clearProps: "transform", autoAlpha: 1 });
  inv.wrap.classList.remove("is-introducing");
  gsap.set([inv.envelope, inv.card], { willChange: "transform,opacity" });
  inv.wrap.classList.remove("is-ready"); inv.wrap.classList.add("is-busy");
  inv.wrap.setAttribute("aria-disabled", "true");
  const ew = inv.envelope.offsetWidth;
  const release = motionOK ? 2.2 : .55;

  tlOpen = gsap.timeline({ defaults: { ease: "power2.out" } })
    .to(inv.hint, { autoAlpha: 0, duration: .5 }, 0)
    .add("release", release)
    .to(inv.sprig, { x: ew * .05, y: -ew * .035, rotation: 5, autoAlpha: 0, duration: 1.2, ease: "sine.inOut" }, "release-=.5")
    .to(inv.head, { autoAlpha: 0, y: -14, duration: 1, ease: "power2.inOut" }, "release-=.3")
    // 3. a aba gira em 3D e revela o forro
    .to(inv.flapShadow, { autoAlpha: 0, duration: .45 }, "release")
    .to(inv.flap, { rotationX: 180, duration: 1.5, ease: "power2.inOut" }, "release")
    .set(inv.flap, { zIndex: 2 }, "release+=.75")
    // 4. o cartão sai do bolso enquanto o envelope desce
    .to(inv.card, { yPercent: -94, duration: 1.5, ease: "power2.inOut" }, "release+=1.4")
    .to(inv.envelope, { y: () => innerHeight * .16, duration: 1.4, ease: "power2.inOut" }, "release+=1.9")
    .call(liftCard, null, "release+=2.95");
  animateSeal(tlOpen, ew);
  if (!motionOK) tlOpen.timeScale(2.5);
}

function cardTarget() {
  const vw = innerWidth, vh = innerHeight, top = 28, bottom = 110;
  const W = Math.min(vw * .86, (vh - top - bottom) / 1.5, 600), H = W * 1.5;
  return { W, H, x: (vw - W) / 2, y: top + (vh - top - bottom - H) / 2 };
}

/* ---------- 5. o cartão vai para a frente, centraliza e cresce ---------- */
function liftCard() {
  const r = inv.card.getBoundingClientRect(), t = cardTarget();
  inv.pocket.style.overflow = "visible";
  gsap.set(inv.card, { clearProps: "transform" });
  inv.card.classList.add("is-lifted");
  inv.layer.appendChild(inv.card);
  gsap.set(inv.card, { width: t.W, x: r.left, y: r.top, scale: r.width / t.W });

  tlCard = gsap.timeline()
    .to(inv.card, { x: t.x, y: t.y, scale: 1, duration: 1.5, ease: "power3.inOut" }, 0)
    .fromTo(inv.card, { rotation: -1.2 }, { rotation: 0, duration: 1.5, ease: "power2.out" }, 0)
    .to(inv.envelope, { y: `+=${innerHeight * .1}`, autoAlpha: 0, duration: 1.1, ease: "power2.in" }, .1)
    .fromTo($(".card-sheen", inv.card), { xPercent: -100 }, { xPercent: 100, duration: 1.8, ease: "power2.inOut" }, 1.1)
    .call(() => driftPetals({ count: innerWidth < 640 ? 12 : 20 }), null, 1)
    .call(() => { app.state = "open"; }, null, 1.9)
    .call(() => {
      gsap.set([inv.envelope, inv.card], { clearProps: "willChange" });
      inv.wrap.classList.remove("is-busy");
    }, null, 1.9)
    .fromTo(inv.controls, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out" }, 1.9)
    .call(startAuto, null, 2.6);
}

function startAuto() {
  if (app.state !== "open") return;
  inv.enter.focus({ preventScroll: true });
  tlAuto = gsap.fromTo(inv.progress, { scaleX: 0 }, { scaleX: 1, duration: CONFIG.autoEnterSeconds * (motionOK ? 1 : 1.5), ease: "none", onComplete: enterSite });
}
export function stopAuto() { tlAuto && tlAuto.kill(); tlAuto = null; }

/* ---------- ver novamente ---------- */
function replayInvite() {
  if (app.state !== "open") return;
  app.state = "resetting";
  stopAuto();
  clearPetals();
  gsap.timeline({ onComplete: () => { resetInvite(); showIntro(); } })
    .to(inv.controls, { autoAlpha: 0, duration: .4 }, 0)
    .to(inv.card, { autoAlpha: 0, y: "+=18", duration: .7, ease: "power2.in" }, 0);
}

export function resetInvite() {
  tlOpen && tlOpen.kill(); tlCard && tlCard.kill(); stopAuto();
  $$(".wax-chip", inv.seal).forEach(chip => chip.remove());
  gsap.set([inv.crack, ...$$("path", inv.crack)], { clearProps: "all" });
  inv.card.classList.remove("is-lifted");
  inv.pocket.appendChild(inv.card);
  inv.pocket.style.overflow = "";
  gsap.set([inv.card, inv.envelope, inv.seal, inv.halfL, inv.halfR, inv.sprig, inv.flap, inv.flapShadow, inv.head, inv.hint, inv.controls, inv.progress, $(".card-sheen", inv.card), $(".card-paper", inv.card)], { clearProps: "all" });
  gsap.set($$(".card-paper > *", inv.card), { clearProps: "all" });
  gsap.set([inv.head, inv.wrap, inv.hint], { autoAlpha: 0 });
  inv.wrap.classList.remove("is-busy");
}
