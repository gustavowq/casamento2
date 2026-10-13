// Lista de presentes: grade com filtros, gaveta lateral para reservar e resumo fixo
import { $, $$, motionOK } from "../core/dom.js";
import { toast, copyText } from "../core/ui.js";
import { driftPetals } from "../core/petals.js";
import { CONFIG } from "../data/config.js";
import { GIFTS, GIFT_CATEGORIES } from "../data/gifts.js";
import { onView } from "../core/entrance.js";

const brl = v => "R$ " + v.toLocaleString("pt-BR");
let mine = null, current = null, qty = 1, filter = "all";

function giftHTML(g) {
  return `
  <article class="gift" data-id="${g.id}" data-cat="${g.cat}">
    <div class="g-media">
      <div class="g-img art" data-art="gift" data-seed="${g.seed}" data-hue="${g.hue}" data-src="assets/img/presentes/${g.id}.webp"></div>
      <span class="g-ring" aria-hidden="true"></span>
      <span class="g-tag" hidden></span>
      <span class="g-seal" aria-hidden="true"><span class="wax"><b>E<em>&amp;</em>A</b></span></span>
    </div>
    <div class="g-body">
      <p class="label">${GIFT_CATEGORIES[g.cat]}</p>
      <h3>${g.name}</h3>
      <p>${g.desc}</p>
      ${g.quota ? `<div class="quota"><div class="quota-bar"><i></i></div><small></small></div>` : ""}
      <div class="g-foot">
        <span class="g-price">${brl(g.price)}${g.quota ? "<small>por cota</small>" : ""}</span>
        <button class="link g-btn" type="button"></button>
      </div>
    </div>
  </article>`;
}

function paintGift(g) {
  const el = $(`.gift[data-id="${g.id}"]`), isMine = mine && mine.id === g.id, taken = !!g.taken && !isMine;
  el.classList.toggle("is-taken", taken);
  el.classList.toggle("is-mine", !!isMine);
  const tag = $(".g-tag", el);
  tag.hidden = !(taken || isMine);
  tag.textContent = isMine ? "Reservado por você" : "Já reservado";
  const btn = $(".g-btn", el);
  btn.textContent = isMine ? "Alterar" : taken ? "Indisponível" : "Reservar";
  btn.disabled = taken;
  btn.setAttribute("aria-label", `${btn.textContent}: ${g.name}`);
  if (g.quota) {
    const sold = g.quota.sold + (isMine ? mine.qty : 0);
    $(".quota-bar i", el).style.setProperty("--p", `${Math.min(100, (sold / g.quota.total) * 100)}%`);
    $(".quota small", el).textContent = `${sold} de ${g.quota.total} cotas`;
  }
}

function paintCounts() {
  $$("#giftFilters button").forEach(b => {
    const f = b.dataset.f, n = GIFTS.filter(g => f === "all" || g.cat === f).length;
    b.querySelector("sup").textContent = n;
  });
}

function applyFilter(f) {
  filter = f;
  $$("#giftFilters button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
  const cards = $$(".gift");
  gsap.killTweensOf(cards);
  const swap = () => {
    cards.forEach(c => c.classList.toggle("is-hidden", !(f === "all" || c.dataset.cat === f)));
    ScrollTrigger.refresh();
    if (motionOK) gsap.fromTo(cards.filter(c => !c.classList.contains("is-hidden")), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .07, ease: "power3.out" });
  };
  if (motionOK) gsap.to(cards, { autoAlpha: 0, y: -10, duration: .35, ease: "power2.in", onComplete: swap });
  else swap();
}

/* ---------- gaveta ---------- */
const drawer = () => $("#drawer");
function paintQty() { $("#dwQty").textContent = qty; $("#dwTotal").textContent = `Total ${brl(qty * current.price)}`; }

function openDrawer(g) {
  current = g;
  const form = $("#drawerForm"), editing = mine && mine.id === g.id;
  qty = editing ? mine.qty : 1;
  $("#dwTitle").textContent = g.name;
  $("#dwPrice").textContent = brl(g.price) + (g.quota ? " por cota" : "");
  $("#dwQtyRow").hidden = !g.quota;
  if (g.quota) paintQty();
  $("#dwNote").hidden = !(mine && !editing);
  $("#dwErr").textContent = "";
  $("#dwName").value = editing ? mine.name : ($("#dwName").value || "");
  $("#dwMsg").value = editing ? mine.msg : "";
  form.mode.value = editing ? mine.mode : "dia";
  $("#dwPix").hidden = form.mode.value !== "pix";
  drawer().showModal();
  if (motionOK) gsap.fromTo(".drawer-in", { xPercent: 12, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: .8, ease: "power3.out" });
}
function closeDrawer() {
  const d = drawer();
  if (!d.open) return;
  if (!motionOK) return d.close();
  gsap.to(".drawer-in", { xPercent: 8, autoAlpha: 0, duration: .4, ease: "power2.in", onComplete: () => { d.close(); gsap.set(".drawer-in", { clearProps: "all" }); } });
}

function confirmGift() {
  const name = $("#dwName").value.trim();
  const field = $("#dwName").parentElement;
  if (name.length < 2) {
    field.classList.add("is-invalid");
    $("#dwErr").textContent = "Escreva seu nome para sabermos de quem é o carinho.";
    $("#dwName").focus();
    return;
  }
  const previous = mine && mine.id !== current.id ? GIFTS.find(g => g.id === mine.id) : null;
  mine = { id: current.id, name, qty: current.quota ? qty : 1, mode: $("#drawerForm").mode.value, msg: $("#dwMsg").value.trim() };
  // TODO: enviar `mine` para um serviço (Google Sheets, Formspree, Supabase…) para bloquear o presente para os demais convidados.
  if (previous) paintGift(previous);
  paintGift(current);
  closeDrawer();
  $("#myGiftText").textContent = `${current.name}${current.quota ? ` · ${qty} cota${qty > 1 ? "s" : ""}` : ""} · ${mine.mode === "pix" ? "via PIX" : "levo no dia"}`;
  const bar = $("#myGift");
  bar.hidden = false;
  if (motionOK) gsap.fromTo(bar, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .9, ease: "power3.out", delay: .3 });
  driftPetals({ count: innerWidth < 640 ? 8 : 14, spread: 1.5 });
  toast(`Obrigado, ${name.split(" ")[0]}. Seu presente está reservado.`);
}

export function initGifts() {
  $("#giftGrid").innerHTML = GIFTS.map(giftHTML).join("");
  GIFTS.forEach(paintGift);
  paintCounts();
  $$(".pix-key").forEach(el => { el.textContent = CONFIG.pixKey; });
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => copyText(CONFIG.pixKey, "Chave PIX copiada.")));

  $$("#giftFilters button").forEach(b => b.addEventListener("click", () => { if (b.dataset.f !== filter) applyFilter(b.dataset.f); }));
  $("#giftGrid").addEventListener("click", e => {
    const b = e.target.closest(".g-btn");
    if (!b || b.disabled) return;
    openDrawer(GIFTS.find(g => g.id === b.closest(".gift").dataset.id));
  });

  const d = drawer(), form = $("#drawerForm");
  $$("[data-close]", d).forEach(b => b.addEventListener("click", closeDrawer));
  d.addEventListener("cancel", e => { e.preventDefault(); closeDrawer(); });
  d.addEventListener("click", e => { if (e.target === d) closeDrawer(); });
  $$('[name="mode"]', form).forEach(r => r.addEventListener("change", () => { $("#dwPix").hidden = form.mode.value !== "pix"; }));
  $$("#dwStep button").forEach(b => b.addEventListener("click", () => {
    const max = current.quota.total - current.quota.sold;
    qty = Math.max(1, Math.min(max, qty + Number(b.dataset.step)));
    paintQty();
  }));
  $("#dwName").addEventListener("input", () => { $("#dwName").parentElement.classList.remove("is-invalid"); $("#dwErr").textContent = ""; });
  form.addEventListener("submit", e => { e.preventDefault(); confirmGift(); });

  $("#myGiftUndo").addEventListener("click", () => {
    const g = GIFTS.find(x => x.id === mine.id);
    mine = null; paintGift(g);
    const bar = $("#myGift");
    gsap.to(bar, { autoAlpha: 0, y: 16, duration: .4, onComplete: () => { bar.hidden = true; gsap.set(bar, { clearProps: "all" }); } });
    toast("Tudo bem. O presente voltou para a lista.");
  });

  if (motionOK) {
    onView(".gift", b => gsap.fromTo(b, { y: 26 },
      { y: 0, duration: .8, stagger: .06, ease: "power3.out", overwrite: "auto", clearProps: "transform" }));
  }
}
