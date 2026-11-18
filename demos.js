var DPH = [
  'photos/Studios/Riso_Prints/©IaritzaMenjivar-8113.JPG',
  'photos/Projects/Zine_Night_Workshop/©IaritzaMenjivar-6100.JPG',
  'photos/Projects/Postering/©IaritzaMenjivar-7594.JPG',
  'photos/Projects/Wheat_Paste/©IaritzaMenjivar-7623.JPG',
  'photos/Studios/Final_day/©IaritzaMenjivar-8392.JPG',
  'photos/Projects/Print_Boxes/©IaritzaMenjivar-6152.JPG',
  'photos/Projects/Postering_Session_2/©IaritzaMenjivar-9023.JPG',
  'photos/Studios/Riso_Prints/©IaritzaMenjivar-8147.JPG'
]

function dmt(x, y, w, h, html, o) {
  return Object.assign({ type: 'text', x: x, y: y, w: w, h: h, html: html, sty: 'body copy' }, o || {})
}

function dml(x, y, w, t) {
  return dmt(x, y, w, 1, t, { sty: 'caption', fg: '#555555' })
}

function dms(x, y, w, h, o) {
  return Object.assign({ type: 'shape', x: x, y: y, w: w, h: h, sh: 'rect', fill: '#e8382c', sw: 0, sc: '#111111' }, o || {})
}

function dmb(x, y, w, h, cols, rows, cells, o) {
  return Object.assign({ type: 'table', x: x, y: y, w: w, h: h, tc: cols, tr: rows, cells: cells, sw: 1, sc: '#111111', lo: true, lh: true, lv: true, cp: 10 }, o || {})
}

function dmi(n, o) { return Object.assign({ k: 'img', src: DPH[n % DPH.length] }, o || {}) }

function dtables() {
  var b = []
  b.push(dmt(0, 0, 8, 3, 'tables', { sty: 'H1' }))
  b.push(dmt(0, 3, 7, 3, 'everything on this page is a table block. click a cell to style it, shift click to pick a range, double click to type in it, and drag the blue lines between columns and rows to resize them.'))
  b.push(dml(0, 7, 12, '01 · a shop front made only of tables'))
  b.push(dmb(0, 8, 2, 31, [1], [1, 1, 1, 1, 1, 1, 4], [
    [{ html: '<a href="@">shop</a>', bg: '#fff45c' }], [{ html: '<a href="@">workshops</a>' }], [{ html: '<a href="@">studio</a>' }], [{ html: '<a href="@">radio</a>' }],
    [{ html: '<a href="@">visit us</a>' }], [{ html: '<a href="@">archive</a>' }], [{ html: 'zine fest<br>this saturday', bg: '#e8382c', fg: '#ffffff', size: 22, va: 'bottom' }]
  ], { tm: 'fit' }))
  b.push(dmb(2, 8, 10, 8, [3, 2], [1], [[{ html: 'november<br>print sale', bg: '#f4c6d8', size: 56, wt: '700', va: 'middle', al: 'center' }, dmi(0)]]))
  b.push(dmb(2, 16, 10, 2, [1, 1, 1, 1, 1], [1], [[{ html: 'prints' }, { html: 'zines' }, { html: 'posters' }, { html: 'stationery' }, { html: 'filter by +', al: 'right' }]], { tm: 'scroll', mw: 520, tva: 'middle' }))
  b.push(dmb(2, 18, 10, 21, [1, 1, 1], [5, 1, 5, 1], [
    [dmi(1, { ip: true }), dmi(2, { ip: true }), dmi(3, { ip: true })],
    [{ html: 'riso poster, 3 colors <span style="float:right">$30</span>' }, { html: 'zine no. 4 <span style="float:right"><s>$12</s> $9</span>', bg: '#fff45c' }, { html: 'tote bag <span style="float:right">$22</span>' }],
    [dmi(4, { ip: true }), dmi(5, { ip: true }), dmi(6, { ip: true })],
    [{ html: 'sticker pack <span style="float:right">$6</span>' }, { html: 'linocut print <span style="float:right">$45</span>' }, { html: 'gift card <span style="float:right">$25</span>' }]
  ]))

  b.push(dml(0, 41, 12, '02 · a schedule: black header, striped rows, dashed lines'))
  var hd = { bg: '#111111', fg: '#ffffff', size: 13, sw: 2, ds: 'solid' }, z = { bg: '#fff45c' }
  b.push(dmb(0, 42, 12, 16, [1, 3, 1.2, 1.6], [1, 1, 1, 1, 1, 1, 1], [
    [Object.assign({ html: 'date' }, hd), Object.assign({ html: 'what' }, hd), Object.assign({ html: 'time' }, hd), Object.assign({ html: 'where' }, hd)],
    [{ html: 'thu 20' }, { html: 'open studio · taller abierto' }, { html: '6–9 pm' }, { html: 'main room' }],
    [Object.assign({ html: 'sat 22' }, z), Object.assign({ html: 'riso 101 workshop' }, z), Object.assign({ html: '1–4 pm' }, z), Object.assign({ html: 'riso corner' }, z)],
    [{ html: 'sun 23' }, { html: 'zine night' }, { html: '5–8 pm' }, { html: 'main room' }],
    [Object.assign({ html: 'thu 27' }, z), Object.assign({ html: 'closed for the holiday' }, z), Object.assign({ html: '—' }, z), Object.assign({ html: '—' }, z)],
    [{ html: 'sat 29' }, { html: 'holiday print market' }, { html: 'all day' }, { html: 'the whole studio' }],
    [Object.assign({ html: 'sun 30' }, z), Object.assign({ html: 'screen printing: tote bags' }, z), Object.assign({ html: '12–3 pm' }, z), Object.assign({ html: 'screen room' }, z)]
  ], { ds: 'dashed', dl: 6, dg: 4, tva: 'middle' }))

  b.push(dml(0, 60, 8, '03 · space between cells, merged cells, lines per cell'))
  b.push(dmb(0, 61, 8, 22, [1, 1, 1, 1], [1, 1, 1, 1], [
    [dmi(7, { cs: 2, rs: 2 }), {}, { html: 'the press,<br>room by room', cs: 2, bg: '#e8382c', fg: '#ffffff', size: 30, wt: '700', va: 'bottom' }, {}],
    [{}, {}, { html: 'riso', bg: '#fff45c', va: 'bottom' }, { html: 'dotted', sw: 3, sc: '#e8382c', ds: 'dotted', va: 'bottom' }],
    [{ html: 'screen', va: 'bottom' }, { html: 'thick', sw: 5, va: 'bottom' }, dmi(2, { cs: 2, rs: 2 }), {}],
    [{ html: 'no left, no bottom', hs: 'lb', va: 'bottom' }, { html: 'letterpress', bg: '#f4c6d8', va: 'bottom' }, {}, {}]
  ], { tg: 8, sw: 1.5 }))
  b.push(dml(8, 60, 4, '04 · a price list: lines between rows only'))
  b.push(dmb(8, 61, 4, 14, [3, 1], [1, 1, 1, 1, 1, 1], [
    [{ html: 'poster, 11 × 17' }, { html: '$30', al: 'right' }], [{ html: 'poster, 18 × 24' }, { html: '$45', al: 'right' }], [{ html: 'zine, 16 pages' }, { html: '$12', al: 'right' }],
    [{ html: 'studio day pass' }, { html: '$20', al: 'right' }], [{ html: 'monthly membership' }, { html: '$60', al: 'right' }], [{ html: 'riso, per 100 prints' }, { html: '$15', al: 'right' }]
  ], { lo: false, lv: false, cp: 6, tva: 'middle' }))
  b.push(dml(8, 76, 4, '05 · a ticket, turned a little'))
  b.push(dmb(8, 77, 4, 6, [2, 1], [1, 1], [
    [{ html: 'admit one', size: 22, wt: '700', bg: '#fff45c' }, { html: 'no. 0042', al: 'right', size: 13 }],
    [{ html: 'holiday print market', size: 13 }, { html: 'sat 29', al: 'right', size: 13 }]
  ], { rot: -4, sw: 2 }))

  b.push(dml(0, 85, 12, '06 · on phones: stack (left), shrink to fit (middle), scroll sideways (right)'))
  var sm = function () { return [[{ html: 'a', bg: '#fff45c' }, { html: 'b' }, { html: 'c' }], [{ html: 'd' }, { html: 'e', bg: '#f4c6d8' }, { html: 'f' }]] }
  b.push(dmb(0, 86, 4, 5, [1, 1, 1], [1, 1], sm(), { tm: '' }))
  b.push(dmb(4, 86, 4, 5, [1, 1, 1], [1, 1], sm(), { tm: 'fit' }))
  b.push(dmb(8, 86, 4, 5, [1, 1, 1], [1, 1], sm(), { tm: 'scroll', mw: 600 }))
  return { title: 'tables demo', slug: 'demo-tables', blocks: b }
}

function dshapes() {
  var b = []
  b.push(dms(0, 0, 5, 14, { sh: 'ellipse', fill: '#fff45c' }))
  b.push(dms(3, 3, 3, 7, { fill: '#e8382c', rot: 14, op: 85 }))
  b.push(dms(7, 1, 4, 13, { sh: 'ellipse', fill: 'none', sw: 5, ds: 'dotted', dg: 6 }))
  b.push(dmt(1, 4, 6, 3, 'shapes', { sty: 'H1', z: 5 }))
  b.push(dmt(1, 8, 5, 3, 'rectangles, ellipses and lines, with fills, strokes, dashes, dots, image dashes, corners, opacity and rotation.', { z: 5 }))
  b.push(dms(8, 4, 2, 7, { fill: 'none', sw: 2, ds: 'dashed', dl: 14, dg: 8, cap: 'round' }))
  b.push(dmt(8, 7, 2, 1, 'dashed frame', { sty: 'caption', al: 'center', z: 5 }))

  b.push(dml(0, 16, 12, '01 · kinds'))
  ;[['rect', {}], ['rect', { rd: 40 }], ['ellipse', {}], ['line', { dir: '' }], ['line', { dir: 'v' }], ['line', { dir: 'd' }]].forEach(function (k, i) {
    var o = Object.assign({ sh: k[0], fill: '#111111' }, k[1])
    if (k[0] == 'line') Object.assign(o, { sw: 3, fill: 'none' })
    b.push(dms(i * 2, 17, 2, 6, o))
    b.push(dml(i * 2, 23, 2, ['rectangle', 'rounded corners', 'ellipse', 'line across', 'line down', 'diagonal'][i]))
  })

  b.push(dml(0, 26, 12, '02 · where the stroke sits: inside, center, outside'))
  ;[['', 'inside'], ['c', 'center'], ['o', 'outside']].forEach(function (k, i) {
    b.push(dms(i * 4 + 1, 28, 2, 6, { fill: '#f4c6d8', sw: 12, sa: k[0], sc: '#111111' }))
    b.push(dml(i * 4 + 1, 35, 2, k[1]))
  })

  b.push(dml(0, 38, 12, '03 · dashes and dots'))
  ;[
    [{ ds: 'dashed', sw: 4, dl: 16, dg: 8 }, 'dashed'],
    [{ ds: 'dashed', sw: 6, dl: 14, dg: 10, cap: 'round' }, 'round ends'],
    [{ ds: 'dotted', sw: 7, dg: 6 }, 'dotted'],
    [{ ds: 'dashed', sw: 5, dn: 12 }, '12 spread evenly'],
    [{ sh: 'ellipse', ds: 'dotted', sw: 9, dn: 16 }, '16 dots around'],
    [{ ds: 'img', sw: 30, di: DPH[1], iu: true }, 'image dashes']
  ].forEach(function (k, i) {
    b.push(dms(i * 2, 39, 2, 6, Object.assign({ fill: 'none', sc: '#111111' }, k[0])))
    b.push(dml(i * 2, 46, 2, k[1]))
  })

  b.push(dml(0, 49, 6, '04 · overprint: three see-through circles, like riso inks'))
  b.push(dms(0, 50, 3, 9, { sh: 'ellipse', fill: '#ff48b0', op: 75 }))
  b.push(dms(2, 50, 3, 9, { sh: 'ellipse', fill: '#ffe800', op: 75 }))
  b.push(dms(1, 55, 3, 9, { sh: 'ellipse', fill: '#0078bf', op: 75 }))
  b.push(dml(6, 49, 6, '05 · rotation'))
  ;[0, 15, 30, 45].forEach(function (r, i) {
    b.push(dms(7, 51, 4, 10, { fill: 'none', sw: 2, rot: r, sc: ['#111111', '#e8382c', '#0078bf', '#ff48b0'][i] }))
  })

  b.push(dml(0, 66, 12, '06 · shapes behind type'))
  for (var i = 0; i < 6; i++) b.push(dms(i * 2, 67, 2, 6, { sh: 'ellipse', fill: i % 2 ? '#fff45c' : '#e8382c' }))
  b.push(dmt(0, 68, 12, 3, 'workshop week', { sty: 'H1', al: 'center', z: 5 }))
  return { title: 'shapes demo', slug: 'demo-shapes', blocks: b }
}

function dtype() {
  var b = [], y, st = s.styles || {}
  b.push(dmt(0, 0, 9, 3, 'type specimen', { sty: 'H1' }))
  b.push(dmt(9, 0, 3, 9, 'ñ', { font: '"Degular Display", Helvetica, Arial, sans-serif', size: 190, wt: '400', lh: 1, al: 'right', fm: 'lock' }))
  b.push(dmt(0, 3, 7, 3, 'every text style on the site, sizes, weights, families and the fine print: optical margins, hyphenation, tracking, small caps, figures and ligatures.'))

  b.push(dml(0, 10, 12, '01 · the site styles'))
  y = 11
  Object.keys(st).forEach(function (n) {
    var o = st[n], h = Math.max(2, Math.ceil((o.size || 18) * 1.4 / 24) + 1)
    b.push(dml(0, y, 3, n + ' · ' + (o.size || 18) + ' px · ' + (o.wt || '400')))
    b.push(dmt(3, y, 9, h, n == 'caption' ? 'caption text for photo credits and small notes' : (o.size || 18) >= 40 ? 'Imprenta comunitaria' : 'Imprenta comunitaria en East Boston', { sty: n }))
    y += h + 1
  })

  b.push(dml(0, y, 12, '02 · sizes'))
  y++
  ;[12, 16, 24, 36, 56, 88].forEach(function (z) {
    var h = Math.max(1, Math.ceil(z * 1.25 / 24))
    b.push(dml(0, y, 1, z + ''))
    b.push(dmt(1, y, 11, h, 'ñ press imprime aquí', { size: z, lh: 1.15 }))
    y += h
  })

  y++
  b.push(dml(0, y, 12, '03 · weights of Degular'))
  y++
  ;[[100, 'thin'], [300, 'light'], [400, 'regular'], [500, 'medium'], [600, 'semibold'], [700, 'bold'], [900, 'black']].forEach(function (w, i) {
    b.push(dmt((i % 4) * 3, y + Math.floor(i / 4) * 3, 3, 3, 'Ññ ' + w[1], { size: 34, wt: String(w[0]), lh: 1.1 }))
  })
  y += 7

  b.push(dml(0, y, 12, '04 · families'))
  y++
  ;[['Degular', '"Degular", Helvetica, Arial, sans-serif'], ['Degular Display', '"Degular Display", Helvetica, Arial, sans-serif'], ['Degular Mono', '"Degular Mono", Menlo, monospace'], ['Sofia Pro', '"Sofia Pro", Helvetica, Arial, sans-serif']].forEach(function (f, i) {
    b.push(dml(i * 3, y, 3, f[0]))
    b.push(dmt(i * 3, y + 1, 3, 4, 'Aa Ññ 0123', { font: f[1], size: 40, lh: 1.1 }))
  })
  y += 6

  var q = '“Print is how a neighborhood talks to itself,” said one member. Very often the work starts on a Thursday, with tea, paper and a deadline. “Yes” is the answer.'
  b.push(dml(0, y, 12, '05 · optical margins: off (left) and on (right)'))
  y++
  b.push(dmt(0, y, 5, 9, q, { size: 24, lh: 1.25, bg: '#ffffff' }))
  b.push(dmt(6, y, 5, 9, q, { size: 24, lh: 1.25, bg: '#ffffff', hq: true }))
  y += 10

  var hy = 'Typographically speaking, extraordinarily long words like internationalization need hyphenation in narrow columns.'
  b.push(dml(0, y, 6, '06 · hyphenation off, then on'))
  b.push(dmt(0, y + 1, 2, 7, hy, { size: 16, hy: false }))
  b.push(dmt(3, y + 1, 2, 7, hy, { size: 16, hy: true }))
  b.push(dml(6, y, 6, '07 · tracking and case'))
  b.push(dmt(6, y + 1, 6, 2, 'workshop schedule', { size: 20, up: true, ls: .18, wt: '500' }))
  b.push(dmt(6, y + 3, 6, 2, 'workshop schedule', { size: 20, up: true, ls: -.02, wt: '500' }))
  b.push(dmt(6, y + 5, 6, 2, 'Small Caps For Labels', { size: 20, ff: 'c2sc smcp' }))
  y += 9

  b.push(dml(0, y, 4, '08 · figures: default, tabular, oldstyle'))
  ;['', 'tnum', 'onum'].forEach(function (f, i) {
    b.push(dmt(0, y + 1 + i * 2, 4, 2, '0123456789 · $1,140.50', { size: 22, ff: f }))
  })
  b.push(dml(4, y, 4, '09 · ligatures on, then off'))
  b.push(dmt(4, y + 1, 4, 2, 'office fifty flyers', { size: 30 }))
  b.push(dmt(4, y + 3, 4, 2, 'office fifty flyers', { size: 30, ff: '-liga' }))
  b.push(dml(8, y, 4, '10 · italic, skew and highlight'))
  b.push(dmt(8, y + 1, 4, 2, 'an italic line', { size: 26, it: true }))
  b.push(dmt(8, y + 3, 4, 2, 'a skewed line', { size: 26, sk: 12 }))
  b.push(dmt(8, y + 5, 4, 2, 'mark <span style="background-color: rgb(255, 244, 92);">what matters</span>', { size: 26 }))
  y += 9

  b.push(dml(0, y, 12, '11 · color'))
  b.push(dmt(0, y + 1, 4, 4, 'black on yellow', { size: 30, bg: '#fff45c', pd: 14, fm: 'lock', va: 'bottom' }))
  b.push(dmt(4, y + 1, 4, 4, 'white on red', { size: 30, bg: '#e8382c', fg: '#ffffff', pd: 14, fm: 'lock', va: 'bottom' }))
  b.push(dmt(8, y + 1, 4, 4, 'pink on black', { size: 30, bg: '#111111', fg: '#f4c6d8', pd: 14, fm: 'lock', va: 'bottom' }))
  y += 6
  b.push({ type: 'marquee', x: 0, y: y, w: 12, h: 4, html: 'ñ press · type specimen · imprenta comunitaria · ', speed: 30, size: 56, wt: '700' })
  return { title: 'type specimen', slug: 'demo-type', blocks: b }
}

function demo(k) {
  var p = { tables: dtables, shapes: dshapes, type: dtype }[k]()
  p.id = Math.random().toString(36).slice(2, 8)
  p.blocks.forEach(function (b) { b.id = Math.random().toString(36).slice(2, 8) })
  p.slug = slg(p.slug)
  s.pages.push(p)
  pi = s.pages.length - 1
  CUR = p.slug
  sel = null
  SS = []
  dirty()
  setup()
  st.textContent = 'added the ' + p.title + ' page at /' + p.slug
}
