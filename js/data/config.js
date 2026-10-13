// Dados que o casal edita: datas, endereço, links e chave PIX.
export const CONFIG = {
  weddingDate: "2027-06-12T16:00:00-03:00",
  rsvpDeadline: "2027-04-12T23:59:00-03:00",
  pixKey: "presente@emilyeaugusto.com.br",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Villa%20das%20Flores",
  calendar: {
    title: "Casamento Emily & Augusto",
    start: "20270612T190000Z",          // 16h em Brasília (UTC-3)
    end: "20270613T040000Z",
    location: "Villa das Flores, Estrada das Flores, 1200",
    details: "Cerimônia às 16h no Jardim das Oliveiras. Recepção às 18h na Estufa de Vidro. Dress code: esporte fino."
  },
  autoEnterSeconds: 6                  // tempo lendo o cartão antes de seguir para o site
};

export function calendarUrl() {
  const c = CONFIG.calendar;
  const q = new URLSearchParams({ action: "TEMPLATE", text: c.title, dates: `${c.start}/${c.end}`, location: c.location, details: c.details });
  return `https://calendar.google.com/calendar/render?${q}`;
}
