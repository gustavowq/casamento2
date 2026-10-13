# Imagens (todas opcionais)

Enquanto um arquivo não existir, a página usa uma ilustração botânica pronta de `assets/art/`. Isso preserva o acabamento dos desenhos sem gerar imagens durante a abertura ou a rolagem.
Formato recomendado: **WebP**, exportado em 2× o tamanho de exibição, qualidade 80–85.
Ilustrações com fundo transparente; fotos com fundo normal.

Após editar `js/core/botanical.js` ou `js/core/botanical-details.js`, rode `node scripts/render-botanicals.cjs` para atualizar os WebP. O script usa Chrome headless; se necessário, indique o executável com `EMILY_CHROME_PATH`. O catálogo de combinações fica em `js/core/botanical-assets.js`; combinações novas ainda podem ser desenhadas pelo código como fallback.

## assets/img/convite/
| Arquivo | Tamanho | Descrição |
|---|---|---|
| `selo-EA.webp` | 600×600 | Selo de cera verde sálvia pastel (#95A58D), monograma E & A, visto de frente, sem sombra |
| `ramo.webp` | 600×760 | Ramo de lírio em pé (base embaixo), lírio aberto no topo, botões, miosótis |
| `guirlanda.webp` | 900×400 | Topo do cartão: ramos de lírio para os lados, lírio central e duas alianças douradas embaixo |
| `buque-canto.webp` | 800×800 | Buquê para o canto superior esquerdo (o canto oposto usa a mesma imagem girada) |

## assets/img/site/
| Arquivo | Tamanho | Descrição |
|---|---|---|
| `casal.webp` | 900×1250 | Foto do casal para o arco do topo (retrato) |
| `historia-1.webp` … `historia-4.webp` | 800×1000 | Fotos dos capítulos 2019, 2021, 2024 e 2027 |

## assets/img/presentes/
Uma foto por presente, com o mesmo nome do `id` em `js/data/gifts.js` (ex.: `tacas.webp`), 600×750.
