// Estado global da experiência:
// loading → idle → opening → open → entering → site → leaving → idle …
export const app = { state: "loading" };

export function lockScroll(on) {
  document.documentElement.classList.toggle("is-locked", on);
}
