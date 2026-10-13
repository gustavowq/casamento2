// Cartão-resposta: aceita/declina, acompanhantes, restrições e verso de agradecimento
import { $, $$ } from "../core/dom.js";
import { driftPetals } from "../core/petals.js";
import { CONFIG } from "../data/config.js";

export function initRsvp() {
  const form = $("#replyForm"), card = $("#reply");
  let guests = 0;

  const left = Math.ceil((new Date(CONFIG.rsvpDeadline).getTime() - Date.now()) / 864e5);
  $("#rsvpDays").textContent = left > 0 ? ` · faltam ${left} dias` : " · prazo encerrado";

  $$('[name="going"]', form).forEach(r => r.addEventListener("change", () => form.classList.toggle("is-declining", form.going.value === "nao")));
  $$("#rStep button").forEach(b => b.addEventListener("click", () => {
    guests = Math.max(0, Math.min(4, guests + Number(b.dataset.step)));
    $("#rGuests").textContent = guests;
  }));
  $("#rName").addEventListener("input", () => { $("#rName").parentElement.classList.remove("is-invalid"); $("#rErr").textContent = ""; });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rName").value.trim();
    if (name.length < 2) {
      $("#rName").parentElement.classList.add("is-invalid");
      $("#rErr").textContent = "Escreva seu nome completo para reservarmos o seu lugar.";
      $("#rName").focus();
      return;
    }
    const going = form.going.value === "sim";
    const diet = $$(".checks input:checked").map(i => i.value);
    const first = name.split(" ")[0];
    // TODO: enviar { name, contato, going, guests, diet, música, recado } para um serviço externo.
    $("#rbTitle").textContent = going ? `Até lá, ${first}` : `Obrigado, ${first}`;
    $("#rbText").textContent = going
      ? `Reservamos ${1 + guests} lugar${guests ? "es" : ""} para você${guests ? " e sua companhia" : ""}${diet.length ? `, com cardápio ${diet.join(", ")}` : ""}. Nos vemos no dia 12 de junho.`
      : "Vamos sentir a sua falta, mas agradecemos muito o carinho de avisar.";
    card.classList.add("is-done");
    if (going) setTimeout(() => driftPetals({ count: 14, spread: 1.2 }), 700);
  });
  $("#rEdit").addEventListener("click", () => card.classList.remove("is-done"));
}
