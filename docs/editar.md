# Onde editar cada coisa

| O quê | Onde |
|---|---|
| Cores e fontes | `css/base/tokens.css` |
| Data da contagem, prazo do RSVP, chave PIX, links do mapa e da agenda | `js/data/config.js` |
| Presentes (nome, descrição, preço, categoria, cotas, já reservado) | `js/data/gifts.js` |
| Tempo que o cartão fica na tela antes de seguir sozinho | `autoEnterSeconds` em `js/data/config.js` |
| Textos do convite, história, programação, dress code e dúvidas | direto no `index.html` |
| Perguntas frequentes | seção `#duvidas` no `index.html` |

## Dicas
- Para marcar um presente como já reservado, use `taken: true` no item.
- Para um presente em cotas, use `quota: { total: 40, sold: 14 }`.
- A cor de destaque de cada ilustração de presente é `hue: "neutral" | "mist" | "sage"`.

## Paletas
Esta cópia já abre na paleta **verde sálvia pastel**, com `#95A58D` como fundo principal. As cores de apoio são `#DADEDF`, `#C0CFB2`, `#9BAED4` e `#5D7B9F`.
- Verde sálvia pastel (atual): `<html lang="pt-BR" class="is-locked" data-palette="verde">` e `theme-color` `#95A58D`
- Para usar a superfície clara: apague `data-palette="verde"` da tag `<html>` e use `theme-color` `#F4F6F3`.

Os ajustes da paleta verde ficam em `css/base/palette-verde.css`. Envelope, convite e cartão-resposta
usam superfícies claras coordenadas com o cinza da paleta.
