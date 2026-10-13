# Emily & Augusto — convite e site do casamento (paleta verde)

Página única em HTML, CSS e JavaScript puro (sem framework e sem etapa de build).
Abre com a animação do envelope e, depois do convite, segue para o site com rolagem.

## GitHub Pages

Repositório: https://github.com/gustavowq/casamento2

Endereço do site: https://gustavowq.github.io/casamento2/

A publicação é feita pelo workflow `.github/workflows/pages.yml` a cada push em `main`. Em **Settings → Pages**, a origem deve ser **GitHub Actions**. O workflow valida o JavaScript e publica apenas `index.html`, `css/`, `js/` e `assets/`, mantendo os caminhos relativos compatíveis com `/casamento2/`.

Para validar o pacote localmente, execute `node scripts/build-pages.cjs`. O resultado fica em `.pages-dist/`, que não é incluída nos commits.

## Como rodar no VS Code
1. **Arquivo → Abrir pasta…** e escolha esta pasta.
2. Instale a extensão recomendada **Live Server**.
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

O Live Server é necessário: o JavaScript usa módulos (`type="module"`), que o navegador
não carrega abrindo o arquivo com dois cliques. É preciso internet para as fontes e bibliotecas.

## Estrutura
```
index.html            marcação: abertura, site e gaveta de presentes
css/main.css          importa todos os estilos, na ordem
css/base/             tokens (cores, fontes), reset, tipografia
css/components/       botões, formulários, ilustrações, gaveta lateral
css/invite/           abertura, envelope, cartão
css/site/             uma folha por seção (nav, hero, história, dia, dress, presentes, rsvp, dúvidas, rodapé)
js/main.js            ponto de entrada
js/data/              config.js (datas, PIX, links) e gifts.js (lista de presentes)
js/core/              utilidades, texturas de papel, ilustração botânica em canvas, pétalas, rolagem suave
js/invite/            sequência do envelope e transição para o site
js/site/              um módulo por seção
assets/img/           imagens opcionais (veja docs/imagens.md)
docs/                 guias de edição
```

## Bibliotecas (via CDN)
- GSAP 3.12.5 + ScrollTrigger — animações e efeitos ligados à rolagem
- Lenis 1.1.20 — rolagem suave
- Google Fonts — Bodoni Moda, Pinyon Script, Cormorant Garamond, Jost

## Antes de publicar de verdade
A reserva de presentes e o cartão-resposta ainda não salvam em lugar nenhum.
Os pontos para conectar um serviço (Google Sheets, Formspree, Supabase…) estão marcados com `TODO`
em `js/site/gifts.js` e `js/site/rsvp.js`.
