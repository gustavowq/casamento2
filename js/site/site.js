// Monta o site uma única vez (de preferência enquanto o convite ainda está na tela)
import { $ } from "../core/dom.js";
import { hydrateArt } from "../core/art.js";
import { initSmooth } from "../core/smooth.js";
import { initNav, closeMenu } from "./nav.js";
import { initHero, heroIn } from "./hero.js";
import { initStory } from "./story.js";
import { initDay } from "./day.js";
import { initDress } from "./dress.js";
import { initGifts } from "./gifts.js";
import { initRsvp } from "./rsvp.js";
import { initFaq } from "./faq.js";
import { initReveals } from "./reveal.js";

let built = false;

export function initSiteOnce() {
  if (built) return;
  built = true;
  gsap.registerPlugin(ScrollTrigger);
  initSmooth();
  initGifts();            // cria os cartões de presente antes de desenhar as ilustrações
  hydrateArt($("#site"));
  initNav();
  initHero();
  initStory();
  initDay();
  initDress();
  initRsvp();
  initFaq();
  initReveals();
}

export { heroIn, closeMenu };
