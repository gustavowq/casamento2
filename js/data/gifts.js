// Lista de presentes. taken: true = já reservado por outro convidado.
// Para usar uma foto, coloque o arquivo em assets/img/presentes/<id>.webp
export const GIFT_CATEGORIES = { casa: "Casa", lua: "Lua de mel", exp: "Experiência" };

export const GIFTS = [
  { id: "cotas-lua", cat: "lua", hue: "mist", seed: 11, name: "Cotas da lua de mel", desc: "Cada cota nos leva um pouco mais longe pela costa de Portugal.", price: 150, quota: { total: 40, sold: 14 } },
  { id: "tacas", cat: "casa", hue: "neutral", seed: 12, name: "Taças de cristal", desc: "Para brindarmos cada conquista, e também as sextas-feiras.", price: 380 },
  { id: "lisboa", cat: "lua", hue: "neutral", seed: 13, name: "Jantar com vista em Lisboa", desc: "Uma noite no miradouro, com vinho verde e fado ao fundo.", price: 450 },
  { id: "espresso", cat: "casa", hue: "sage", seed: 14, name: "Máquina de espresso", desc: "Para o café que começou toda esta história.", price: 1200 },
  { id: "amalfi", cat: "lua", hue: "mist", seed: 15, name: "Barco pela costa de Amalfi", desc: "Um dia inteiro entre Positano e Amalfi.", price: 620, taken: true },
  { id: "ceramica", cat: "exp", hue: "sage", seed: 16, name: "Aula de cerâmica a dois", desc: "Vamos fazer as nossas próprias xícaras, tortas e únicas.", price: 280 },
  { id: "enxoval", cat: "casa", hue: "mist", seed: 17, name: "Jogo de cama de linho", desc: "Linho lavado para domingos sem pressa.", price: 760, taken: true },
  { id: "jardim", cat: "casa", hue: "sage", seed: 18, name: "Mudas para o nosso jardim", desc: "Lírios, miosótis e uma oliveira para crescer com a gente.", price: 190 },
  { id: "spa", cat: "exp", hue: "neutral", seed: 19, name: "Um dia de spa", desc: "Porque organizar um casamento também cansa.", price: 540 }
];
