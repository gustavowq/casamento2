// Preenche cada elemento .art com a imagem real (data-src) ou, se ela não existir,
// com uma ilustração desenhada em canvas (data-art = nome da composição).
import { $$ } from "./dom.js";
import { artURL } from "./botanical.js";

const images = new Map();
function loadImage(src) {
  if (!src) return Promise.resolve(false);
  if (images.has(src)) return images.get(src);
  const pending = new Promise(resolve => {
    if (!src) return resolve(false);
    const img = new Image();
    img.onload = async () => {
      try { await img.decode(); } catch {}
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => resolve(false);
    img.src = src;
  });
  images.set(src, pending);
  return pending;
}

export async function hydrateArt(scope = document) {
  await Promise.all($$(".art", scope).map(async el => {
    if (el.dataset.ready) return;
    el.dataset.ready = "1";
    const preset = el.dataset.art;
    let fallback;
    if (preset && preset !== "none") {
      const onPaper = el.closest(".card, .envelope, .reply, .day");
      const tone = !onPaper && document.documentElement.dataset.palette === "verde" ? "dark" : "light";
      fallback = artURL(preset, Number(el.dataset.seed) || 1, el.dataset.hue || "", tone);
      el.style.backgroundImage = `url("${fallback}")`;
      el.classList.add("is-drawn");
    }
    // Imagens opcionais não atrasam a ilustração pronta nem a abertura.
    loadImage(el.dataset.src).then(loaded => {
      if (!loaded) return;
      el.style.backgroundImage = `url("${el.dataset.src}")`;
      el.classList.add("has-img");
    });
    if (fallback) await loadImage(fallback);
  }));
}

export function applyLiner() {
  document.documentElement.style.setProperty("--liner", `url("${artURL("liner", 5)}")`);
}
