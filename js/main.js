// Ponto de entrada
import { $, wait } from "./core/dom.js";
import { applyPaperTextures } from "./core/paper.js";
import { hydrateArt, applyLiner } from "./core/art.js";
import { initInvite, showIntro } from "./invite/sequence.js";
import { initSiteOnce } from "./site/site.js";
import { app } from "./core/state.js";

async function boot() {
  applyPaperTextures();
  applyLiner();
  initInvite();
  await Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(2500)]);
  await hydrateArt($("#opening"));
  showIntro();
  // monta o site em segundo plano enquanto o convidado olha o envelope
  const prepare = () => {
    if (app.state === "opening") { setTimeout(prepare, 400); return; }
    initSiteOnce();
  };
  if (window.requestIdleCallback) requestIdleCallback(prepare, { timeout: 2500 });
  else setTimeout(prepare, 2500);
}

boot();
