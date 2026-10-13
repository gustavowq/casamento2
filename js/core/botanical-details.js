// Detalhes botânicos em canvas: marfim, verde sálvia e traços de aquarela.
const TAU = Math.PI * 2;
const ivory = a => `rgba(255,253,247,${a})`;
const petalInk = a => `rgba(105,116,81,${a})`;

export function drawLeaf(x, bx, by, ang, len, wid, bend, u, p) {
  x.save();
  x.translate(bx, by); x.rotate(ang + Math.PI / 2);
  const drift = bend * len;
  const center = t => [drift * (3 * t * t - 2 * t * t * t) + wid * .12 * Math.sin(t * Math.PI), -len * t];
  const breadth = t => wid * .76 * Math.pow(Math.sin(t * Math.PI), 1.18) * (1 - t * .18);
  const edge = (t, side) => {
    const [cx, cy] = center(t), w = breadth(t);
    return [cx + side * w * (side < 0 ? 1 : .84) * (1 + .035 * Math.sin(t * Math.PI * 5)), cy];
  };
  const trace = () => {
    x.beginPath(); x.moveTo(0, 0);
    for (let i = 1; i <= 32; i++) x.lineTo(...edge(i / 32, -1));
    for (let i = 31; i >= 0; i--) x.lineTo(...edge(i / 32, 1));
    x.closePath();
  };
  trace();
  const g = x.createLinearGradient(-wid, -len * .2, wid + drift * .7, -len * .65);
  g.addColorStop(0, p.leafB(.76)); g.addColorStop(.32, p.leafA(.48));
  g.addColorStop(.54, p.leafA(.3)); g.addColorStop(.8, p.leafB(.56));
  g.addColorStop(1, p.leafA(.28));
  x.fillStyle = g; x.fill();
  x.save(); x.clip();
  // Duas faces com luz diferente tornam a dobra legível mesmo no cartão pequeno.
  x.beginPath(); x.moveTo(0, 0);
  for (let i = 1; i <= 32; i++) x.lineTo(...center(i / 32));
  for (let i = 31; i >= 0; i--) x.lineTo(...edge(i / 32, -1));
  x.closePath(); x.fillStyle = 'rgba(33,65,38,.13)'; x.fill();
  x.beginPath(); x.moveTo(0, 0);
  for (let i = 1; i <= 32; i++) x.lineTo(...center(i / 32));
  for (let i = 31; i >= 0; i--) {
    const [cx, cy] = center(i / 32);
    x.lineTo(cx + breadth(i / 32) * .23, cy);
  }
  x.closePath(); x.fillStyle = ivory(.16); x.fill();
  // Nervuras paralelas seguem toda a curvatura e convergem nas extremidades.
  for (let i = -6; i <= 6; i++) {
    x.beginPath();
    for (let j = 0; j <= 28; j++) {
      const t = .025 + j / 28 * (.935 - Math.abs(i) * .006);
      const [cx, cy] = center(t), vx = cx + i / 6 * breadth(t) * .87;
      j ? x.lineTo(vx, cy) : x.moveTo(vx, cy);
    }
    x.lineWidth = (i === 0 ? .65 : .25) * u;
    x.strokeStyle = p.ink(i === 0 ? .57 : .13 + (6 - Math.abs(i)) * .014); x.stroke();
  }
  // Veias muito finas e pigmento irregular, sem transformar a folha em uma grade.
  for (let i = 0; i < 18; i++) {
    const t = .13 + i * .038, side = i % 2 ? 1 : -1;
    const [cx, cy] = center(t), w = breadth(t);
    x.beginPath(); x.moveTo(cx + side * w * .13, cy);
    x.quadraticCurveTo(cx + side * w * .4, cy - len * .018, cx + side * w * .78, cy - len * .039);
    x.lineWidth = .2 * u; x.strokeStyle = p.ink(.1); x.stroke();
    const spot = Math.sin(i * 17.3 + bend * 31);
    x.beginPath(); x.ellipse(cx + spot * w * .62, cy - len * .008, .32 * u, .65 * u, spot * .3, 0, TAU);
    x.fillStyle = p.leafB(.15); x.fill();
  }
  x.beginPath();
  for (let i = 0; i <= 28; i++) {
    const t = .055 + i / 28 * .865, [cx, cy] = center(t);
    i ? x.lineTo(cx + u * .7, cy) : x.moveTo(cx + u * .7, cy);
  }
  x.lineWidth = .62 * u; x.strokeStyle = ivory(.34); x.stroke();
  x.restore();
  trace(); x.lineWidth = .55 * u; x.strokeStyle = p.ink(.47); x.stroke();
  // Uma pequena dobra na ponta revela o verso da folha.
  const [tipx, tipy] = center(1), [foldx, foldy] = edge(.87, 1);
  x.beginPath(); x.moveTo(tipx, tipy); x.lineTo(foldx, foldy);
  x.quadraticCurveTo(tipx + wid * .055, -len * .92, tipx, tipy);
  x.fillStyle = p.leafA(.32); x.fill(); x.lineWidth = .3 * u; x.strokeStyle = p.ink(.25); x.stroke();
  // Base engainante: a folha envolve o caule na sua inserção.
  x.beginPath(); x.moveTo(-u * .7, u * 1.4);
  x.quadraticCurveTo(-u * 1.4, -len * .045, 0, -len * .085);
  x.quadraticCurveTo(u * 1.1, -len * .03, u * .8, u * .7);
  x.fillStyle = p.leafB(.6); x.fill(); x.lineWidth = .3 * u; x.strokeStyle = p.ink(.3); x.stroke();
  x.restore();
}

export function drawStem(x, point, width, u, p) {
  const count = 32;
  const samples = Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count, [cx, cy] = point(t);
    const a = point(Math.max(0, t - .002)), b = point(Math.min(1, t + .002));
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy) || 1;
    return { cx, cy, nx: -dy / length, ny: dx / length, r: width * (.5 - t * .32) };
  });
  const at = (s, offset) => [s.cx + s.nx * s.r * offset, s.cy + s.ny * s.r * offset];
  const ribbon = (left, right, fill) => {
    x.beginPath(); x.moveTo(...at(samples[0], left));
    for (let i = 1; i <= count; i++) x.lineTo(...at(samples[i], left));
    for (let i = count; i >= 0; i--) x.lineTo(...at(samples[i], right));
    x.closePath(); x.fillStyle = fill; x.fill();
  };
  x.save();
  // Volume arredondado: borda sombreada, corpo sálvia e reflexo longitudinal.
  ribbon(-1, 1, p.leafB(.87));
  ribbon(-.62, .7, p.leafA(.52));
  ribbon(-1, -.62, 'rgba(27,54,32,.23)');
  ribbon(.08, .38, ivory(.22));
  for (const offset of [-.82, -.35, .63]) {
    x.beginPath();
    samples.forEach((s, i) => i ? x.lineTo(...at(s, offset)) : x.moveTo(...at(s, offset)));
    x.lineWidth = .22 * u; x.strokeStyle = p.ink(offset < 0 ? .25 : .14); x.stroke();
  }
  // Estrias curtas e espaçadas, como numa gravura botânica.
  for (let i = 3; i < count - 2; i += 3) {
    const s = samples[i], n = samples[i + 1];
    x.beginPath(); x.moveTo(...at(s, -.6)); x.lineTo(...at(n, -.3));
    x.lineWidth = .23 * u; x.strokeStyle = p.ink(.18); x.stroke();
  }
  x.restore();
}

export function drawNode(x, cx, cy, angle, side, u, p) {
  x.save(); x.translate(cx, cy); x.rotate(angle + Math.PI / 2);
  // Colar curvo, pequena bráctea e sombra na junção da folha.
  x.beginPath(); x.ellipse(0, .3 * u, 1.7 * u, 2.3 * u, -.2 * side, 0, TAU);
  x.fillStyle = p.leafB(.65); x.fill();
  x.beginPath(); x.moveTo(-1.3 * u, .9 * u);
  x.quadraticCurveTo(0, 1.8 * u, 1.4 * u, .7 * u);
  x.lineWidth = .4 * u; x.strokeStyle = ivory(.38); x.stroke();
  x.beginPath(); x.moveTo(side * .7 * u, -.4 * u);
  x.quadraticCurveTo(side * 3.5 * u, -2.7 * u, side * 2.6 * u, -6 * u);
  x.quadraticCurveTo(side * .8 * u, -3.3 * u, side * .7 * u, -.4 * u);
  x.fillStyle = p.leafA(.48); x.fill(); x.lineWidth = .3 * u; x.strokeStyle = p.ink(.32); x.stroke();
  x.restore();
}

function petal(x, a, L, W, back, rnd, u) {
  x.save(); x.rotate(a + Math.PI / 2);
  const lean = (rnd() - .5) * W * .24, tip = W * .16 + lean;
  const trace = () => {
    x.beginPath(); x.moveTo(0, -L * .045);
    x.bezierCurveTo(-W * .62, -L * .23, -W * .91 + lean, -L * .61, tip - W * .24, -L * .9);
    x.bezierCurveTo(tip - W * .12, -L * 1.02, tip + W * .12, -L * 1.035, tip + W * .19, -L * .965);
    x.bezierCurveTo(tip + W * .32, -L * .88, W * .94 + lean, -L * .6, W * .56, -L * .28);
    x.quadraticCurveTo(W * .22, -L * .12, 0, -L * .045);
    x.closePath();
  };
  trace();
  const body = x.createLinearGradient(-W, 0, W * .7, -L);
  body.addColorStop(0, back ? 'rgba(178,184,137,.93)' : 'rgba(186,193,144,.95)');
  body.addColorStop(.18, 'rgba(231,222,204,.97)');
  body.addColorStop(.38, back ? 'rgba(240,237,225,.98)' : ivory(.99));
  body.addColorStop(.72, ivory(.99));
  body.addColorStop(1, back ? 'rgba(224,220,205,.98)' : 'rgba(244,234,223,.99)');
  x.fillStyle = body; x.fill();
  x.save(); x.clip();
  // Sombra translúcida e reflexo suave para dar volume.
  const shade = x.createLinearGradient(-W * .75, 0, W * .7, 0);
  shade.addColorStop(0, 'rgba(137,140,104,.2)');
  shade.addColorStop(.36, 'rgba(187,174,149,.07)');
  shade.addColorStop(.56, ivory(.3));
  shade.addColorStop(1, 'rgba(155,143,121,.13)');
  x.fillStyle = shade; x.fillRect(-W * 1.2, -L * 1.08, W * 2.4, L * 1.08);
  const tint = x.createRadialGradient(W * .12, -L * .25, 0, W * .12, -L * .25, L * .43);
  tint.addColorStop(0, 'rgba(192,207,178,.15)'); tint.addColorStop(1, 'rgba(192,207,178,0)');
  x.fillStyle = tint; x.fillRect(-W, -L, W * 2, L);
  // Nervuras finas e irregulares, deixando as pontas leves.
  for (let i = -5; i <= 5; i++) {
    const v = i / 5, end = .74 + rnd() * .16;
    x.beginPath(); x.moveTo(v * W * .08, -L * (.08 + rnd() * .025));
    x.bezierCurveTo(v * W * .47, -L * .29, v * W * .5 + lean * .5, -L * .59, tip * end + v * W * .13, -L * end);
    x.lineWidth = (i === 0 ? .46 : .24 + rnd() * .08) * u;
    x.strokeStyle = petalInk(i === 0 ? .3 : .1 + rnd() * .08); x.stroke();
  }
  // Reflexo na nervura central e pequenas hachuras junto à base.
  x.beginPath(); x.moveTo(u * .55, -L * .14);
  x.bezierCurveTo(u, -L * .35, lean * .4 + u, -L * .64, tip * .75, -L * .82);
  x.lineWidth = .8 * u; x.strokeStyle = ivory(.58); x.stroke();
  for (let i = 0; i < 9; i++) {
    const t = .18 + i * .035, side = i % 2 ? 1 : -1;
    x.beginPath(); x.moveTo(side * W * .09, -L * t);
    x.quadraticCurveTo(side * W * .27, -L * (t + .035), side * W * .36, -L * (t + .095));
    x.lineWidth = .23 * u; x.strokeStyle = 'rgba(158,139,111,.15)'; x.stroke();
  }
  // Pintinhas naturais concentradas na garganta, em tons discretos.
  for (let i = 0; i < 19; i++) {
    const t = .12 + rnd() * .37, off = (rnd() - .5) * W * .84 * Math.sin(t * Math.PI);
    x.beginPath(); x.ellipse(off + lean * t, -L * t, (.32 + rnd() * .48) * u, (.55 + rnd() * .8) * u, (rnd() - .5) * .4, 0, TAU);
    x.fillStyle = `rgba(153,108,90,${.2 + rnd() * .23})`; x.fill();
  }
  x.restore();
  trace(); x.lineWidth = (back ? .54 : .65) * u;
  x.strokeStyle = petalInk(back ? .36 : .46); x.stroke();
  // Borda recurvada: verso marfim e sombra delicada sob a dobra.
  x.beginPath(); x.moveTo(tip - W * .24, -L * .9);
  x.bezierCurveTo(tip - W * .06, -L * 1.025, tip + W * .15, -L * 1.02, tip + W * .19, -L * .965);
  x.quadraticCurveTo(tip + W * .08, -L * .925, tip - W * .24, -L * .9);
  const fold = x.createLinearGradient(0, -L * 1.03, 0, -L * .88);
  fold.addColorStop(0, ivory(.96)); fold.addColorStop(1, 'rgba(196,186,165,.48)');
  x.fillStyle = fold; x.fill();
  x.lineWidth = .34 * u; x.strokeStyle = petalInk(.3); x.stroke();
  x.restore();
}

export function drawLily(x, cx, cy, r, rot, rnd, u) {
  x.save(); x.translate(cx, cy);
  // Duas camadas de três pétalas, levemente desiguais e sobrepostas.
  for (let layer = 0; layer < 2; layer++) {
    for (let i = layer; i < 6; i += 2) {
      const a = rot + i * TAU / 6 + (rnd() - .5) * .12;
      petal(x, a, r * (layer ? 1 : .91) * (.95 + rnd() * .09), r * (layer ? .37 : .3), layer === 0, rnd, u);
    }
  }
  const throat = x.createRadialGradient(0, 0, 0, 0, 0, r * .18);
  throat.addColorStop(0, 'rgba(116,141,79,.54)');
  throat.addColorStop(.45, 'rgba(164,174,114,.23)'); throat.addColorStop(1, 'rgba(164,174,114,0)');
  x.beginPath(); x.arc(0, 0, r * .18, 0, TAU); x.fillStyle = throat; x.fill();
  // Filamentos curvos, anteras alongadas com sulco e grãos de pólen.
  for (let i = 0; i < 6; i++) {
    const a = rot + TAU / 12 + i * TAU / 6 + (rnd() - .5) * .2;
    const L = r * (.43 + rnd() * .17), ex = Math.cos(a) * L, ey = Math.sin(a) * L;
    x.beginPath(); x.moveTo(0, 0);
    x.bezierCurveTo(Math.cos(a - .26) * L * .25, Math.sin(a - .26) * L * .25, Math.cos(a + .17) * L * .75, Math.sin(a + .17) * L * .75, ex, ey);
    x.lineWidth = 1.05 * u; x.strokeStyle = 'rgba(111,137,80,.74)'; x.stroke();
    x.lineWidth = .4 * u; x.strokeStyle = 'rgba(241,233,196,.9)'; x.stroke();
    x.save(); x.translate(ex, ey); x.rotate(a + Math.PI / 2 + (rnd() - .5) * .4);
    const anther = x.createLinearGradient(0, -u * 1.5, 0, u * 1.5);
    anther.addColorStop(0, '#c1a176'); anther.addColorStop(.5, '#9a764d'); anther.addColorStop(1, '#72583d');
    x.beginPath(); x.ellipse(0, 0, 3.15 * u, 1.2 * u, 0, 0, TAU); x.fillStyle = anther; x.fill();
    x.beginPath(); x.moveTo(-2.25 * u, .2 * u); x.quadraticCurveTo(0, .65 * u, 2.25 * u, .15 * u);
    x.lineWidth = .35 * u; x.strokeStyle = 'rgba(77,61,40,.65)'; x.stroke();
    for (let j = 0; j < 5; j++) {
      x.beginPath(); x.arc((rnd() - .5) * 4.5 * u, (rnd() - .5) * 1.3 * u, .18 * u, 0, TAU);
      x.fillStyle = 'rgba(236,211,159,.7)'; x.fill();
    }
    x.restore();
  }
  // Pistilo terminado por um estigma com três lóbulos.
  const a = rot - .38, ex = Math.cos(a) * r * .65, ey = Math.sin(a) * r * .65;
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(ex * .35 - r * .035, ey * .5, ex, ey);
  x.lineWidth = 1.35 * u; x.strokeStyle = 'rgba(112,139,82,.85)'; x.stroke();
  x.lineWidth = .45 * u; x.strokeStyle = 'rgba(225,234,187,.85)'; x.stroke();
  for (let i = 0; i < 3; i++) {
    const a = i * TAU / 3;
    x.beginPath(); x.ellipse(ex + Math.cos(a) * .8 * u, ey + Math.sin(a) * .8 * u, 1.15 * u, .8 * u, a, 0, TAU);
    x.fillStyle = 'rgba(141,161,105,.97)'; x.fill();
    x.lineWidth = .3 * u; x.strokeStyle = petalInk(.45); x.stroke();
  }
  x.restore();
}

export function drawBud(x, bx, by, ang, len, u, p) {
  x.save(); x.translate(bx, by); x.rotate(ang + Math.PI / 2);
  const w = len * .17, lean = len * .045;
  const trace = () => {
    x.beginPath(); x.moveTo(0, 0);
    x.bezierCurveTo(-w * .8, -len * .2, -w * .8, -len * .65, lean, -len);
    x.bezierCurveTo(w * 1.05, -len * .71, w * .9, -len * .25, 0, 0); x.closePath();
  };
  trace();
  const body = x.createLinearGradient(-w, 0, w, -len);
  body.addColorStop(0, 'rgba(139,165,106,.96)'); body.addColorStop(.28, 'rgba(204,217,170,.96)');
  body.addColorStop(.55, ivory(.99)); body.addColorStop(.82, 'rgba(245,235,224,.98)');
  body.addColorStop(1, 'rgba(222,211,191,.97)');
  x.fillStyle = body; x.fill();
  x.save(); x.clip();
  for (let i = -2; i <= 2; i++) {
    x.beginPath(); x.moveTo(i * w * .06, -len * .06);
    x.bezierCurveTo(i * w * .39, -len * .32, i * w * .4 + lean * .4, -len * .68, lean, -len * .98);
    x.lineWidth = (i === 0 ? .5 : .3) * u; x.strokeStyle = petalInk(i === 0 ? .4 : .23); x.stroke();
  }
  x.beginPath(); x.moveTo(w * .12, -len * .15);
  x.quadraticCurveTo(w * .4, -len * .48, lean, -len * .92);
  x.lineWidth = 1.1 * u; x.strokeStyle = ivory(.55); x.stroke();
  x.restore();
  trace(); x.lineWidth = .62 * u; x.strokeStyle = p.ink(.48); x.stroke();
  // Brácteas finas ao redor da base do botão.
  for (const side of [-1, 1]) {
    x.beginPath(); x.moveTo(0, len * .015);
    x.quadraticCurveTo(side * w * .72, -len * .07, side * w * .7, -len * .24);
    x.quadraticCurveTo(side * w * .3, -len * .11, 0, len * .015);
    x.fillStyle = p.leafB(.46); x.fill(); x.lineWidth = .38 * u; x.strokeStyle = p.ink(.35); x.stroke();
  }
  x.restore();
}
