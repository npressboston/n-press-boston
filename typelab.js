var LB = null, LG = 'ñ', LM = 4, LK = false, LD = {}

var PAN = '“El veloz murciélago hindú comía feliz cardillo y kiwi.” La cigüeña tocaba el saxofón detrás del palenque de paja. Sphinx of black quartz, judge my vow; the five boxing wizards jump quickly at 1,234 presses.'

var KP = ['AV', 'AW', 'AY', 'AT', 'Av', 'Ay', 'LT', 'LV', 'LY', 'P.', 'Ta', 'Te', 'To', 'Ty', 'Va', 'Vo', 'Wa', 'Yo', 'F.', 'r.', 'y.', '“A', 'ño', 'Ñ.']

var LTX = '', LSN = null, LO = { '01': 1 }, LSO = false, LSC = []
try { LO = JSON.parse(localStorage.getItem('lsec') || 'null') || LO } catch (e) {}

function lsv0() {
  try { localStorage.setItem('lsec', JSON.stringify(LO)) } catch (e) {}
}

function lab(n) {
  if (!s.styles[n]) return
  LB = n
  var w = document.getElementById('lab')
  if (!w) {
    w = document.createElement('div')
    w.id = 'lab'
    w.hidden = true
    w.innerHTML = '<div class="lbw"><header><b>ñ type lab</b><span></span><em class="lst"></em><button class="lrs" title="undo everything since you opened the lab or last kept">revert</button><button class="lsv" title="keep these changes in the editor. the editor save button still saves the site">keep</button><button class="lcl">close</button></header><div class="lask" hidden><span>you changed type styles and did not keep them</span><button class="lno">throw them away</button><button class="lok">keep and close</button><button class="lbk">keep editing</button></div><aside class="ll"></aside><main class="lc"></main><aside class="li"></aside></div>'
    w.querySelector('.lcl').onclick = lclose
    w.querySelector('.lsv').onclick = lsave
    w.querySelector('.lrs').onclick = lreset
    w.querySelector('.lok').onclick = function () { lsave(); lshut() }
    w.querySelector('.lno').onclick = function () { lreset(); lshut() }
    w.querySelector('.lbk').onclick = function () { w.querySelector('.lask').hidden = true }
    w.onpointerdown = function (e) { if (e.target == w) lclose() }
    document.body.appendChild(w)
  }
  if (w.hidden) LSN = JSON.stringify(s)
  w.hidden = false
  w.querySelector('.lask').hidden = true
  lrd(1)
}

function lchg() {
  return LSN != null && JSON.stringify(s) != LSN
}

function lmark(t) {
  var w = document.getElementById('lab'), c = lchg(), m = w.querySelector('.lst')
  m.textContent = t || (c ? 'changes not kept yet' : 'nothing to keep')
  m.className = 'lst' + (c ? ' on' : '')
  w.querySelector('.lsv').disabled = w.querySelector('.lrs').disabled = !c
}

function lsave() {
  LSN = JSON.stringify(s)
  lmark('kept, save the site to write them')
}

function lreset() {
  if (!lchg()) return
  var n = LB
  s = JSON.parse(LSN)
  LB = s.styles[n] ? n : Object.keys(s.styles)[0] || null
  setup()
  dirty()
  if (!LB) return lshut()
  lrd(1)
  lmark('back to how it was')
}

function lclose() {
  var w = document.getElementById('lab')
  if (lchg()) {
    w.querySelector('.lask').hidden = false
    return
  }
  lshut()
}

function lshut() {
  LB = null
  LSN = null
  document.getElementById('lab').hidden = true
  var k = document.getElementById('fpk')
  if (k) k.remove()
  cpx()
  panel()
}

function ev(o) {
  var z = o.size || sb(s).size || 18, r = s.grid.row || 24, lh
  if (o.lr) lh = o.lr * r
  else if (o.lh) lh = String(o.lh).indexOf('px') > -1 ? parseFloat(o.lh) : o.lh * z
  else lh = lead(z)
  return {
    f: o.font || sb(s).font || 'Helvetica, Arial, sans-serif',
    z: z,
    w: +(o.wt || 400),
    lh: lh,
    r: r,
    tr: Math.round((o.ls || 0) * 1000)
  }
}

function fnm(v) {
  var f = fam(v)
  return f ? f[0] : v.split(',')[0].replace(/"/g, '')
}

function wnm(w) {
  var x = WT.filter(function (y) { return y && +y[0] == w })[0]
  return x ? x[1] : w
}

function sline(o) {
  var e = ev(o)
  return fnm(e.f) + ' · ' + wnm(e.w) + ' ' + e.w + (o.it ? ' italic' : '') + ' · ' + e.z + '/' + Math.round(e.lh) + ' · tracking ' + e.tr
}

function cfont(o, px, kn) {
  var e = ev(o), c = document.createElement('canvas').getContext('2d')
  c.font = (o.it ? 'italic ' : '') + e.w + ' ' + px + 'px ' + e.f
  c.fontKerning = kn || 'normal'
  return c
}

function met(o) {
  var c = cfont(o, 1000), h = c.measureText('H'), q = c.measureText(LG)
  return {
    asc: h.fontBoundingBoxAscent,
    dsc: h.fontBoundingBoxDescent,
    cap: h.actualBoundingBoxAscent,
    x: c.measureText('x').actualBoundingBoxAscent,
    as: c.measureText('d').actualBoundingBoxAscent,
    ds: c.measureText('p').actualBoundingBoxDescent,
    adv: q.width,
    lsb: -q.actualBoundingBoxLeft,
    rsb: q.width - q.actualBoundingBoxRight,
    gt: q.actualBoundingBoxAscent,
    gb: q.actualBoundingBoxDescent
  }
}

function el(t, c, h) {
  var x = document.createElement(t)
  if (c) x.className = c
  if (h != null) x.innerHTML = h
  return x
}

function smp(txt) {
  var d = el('div', 'c c-text')
  d.textContent = txt
  sty(d, { sty: LB }, 'text')
  return d
}

function lrd(full) {
  if (!LB) return
  var w = document.getElementById('lab'), o = s.styles[LB]
  if (!o) return lshut()
  if (full) {
    llist(w.querySelector('.ll'))
    linsp(w.querySelector('.li'), o)
  }
  w.querySelector('header span').textContent = LB + ' — ' + sline(o)
  lmark()
  var e = ev(o), fs = (o.it ? 'italic ' : '') + e.w + ' 16px ' + e.f
  lspec(w.querySelector('.lc'), o)
  if (!LD[fs]) document.fonts.load(fs).then(function () {
    LD[fs] = 1
    if (LB) lspec(w.querySelector('.lc'), s.styles[LB])
  })
}

function llist(p) {
  p.innerHTML = '<div class="lbm"></div><div class="lsd"><div class="lsl"' + (LSO ? '' : ' hidden') + '><h6>styles</h6></div><button class="lsb"></button></div>'
  var bt = p.querySelector('.lsb'), o0 = s.styles[LB], ls = p.querySelector('.lsl')
  bt.innerHTML = '<span><small>style</small><b></b></span><i>' + ev(o0).z + '/' + Math.round(ev(o0).lh) + '</i><em>' + (LSO ? '▾' : '▴') + '</em>'
  bt.querySelector('b').textContent = LB
  bt.classList.toggle('on', LSO)
  var rt0 = p
  bt.onclick = function () {
    LSO = !LSO
    llist(rt0)
    lbook()
  }
  p = ls
  Object.keys(s.styles).forEach(function (n) {
    var o = s.styles[n], a = el('a', n == LB ? 'on' : ''), b = el('b'), i = el('i')
    b.textContent = n
    b.style.fontFamily = ev(o).f
    b.style.fontWeight = ev(o).w
    b.style.fontStyle = o.it ? 'italic' : ''
    i.textContent = ev(o).z + '/' + Math.round(ev(o).lh)
    a.appendChild(b)
    a.appendChild(i)
    a.onclick = function () { LSO = false; lab(n) }
    p.appendChild(a)
  })
  var nw = el('button', 'lnew', '+ new style')
  nw.onclick = function () {
    var n = prompt('name for the new style')
    if (!n || s.styles[n]) return
    s.styles[n] = JSON.parse(JSON.stringify(s.styles[LB]))
    dirty()
    lab(n)
  }
  p.appendChild(nw)
}

function sec(p, no, t, x) {
  var d = el('section', LO[no] ? '' : 'shut'), h = el('h3', '', '<i>' + no + '</i><span class="lsn">' + t + '</span>')
  d.dataset.no = no
  if (x) h.appendChild(x)
  h.appendChild(el('b', 'lcv', '›'))
  h.onclick = function (e) {
    if (e.target.closest('button, input, label, a, select')) return
    lopen(no, !LO[no])
  }
  d.appendChild(h)
  p.appendChild(d)
  LSC.push([no, t])
  return d
}

function lopen(no, on, go) {
  var w = document.getElementById('lab'), d = w.querySelector('.lc section[data-no="' + no + '"]')
  if (on) LO[no] = 1
  else delete LO[no]
  lsv0()
  if (d) d.classList.toggle('shut', !on)
  if (d && go) w.querySelector('.lc').scrollTo({ top: ltop(d) - 8, behavior: 'smooth' })
  lbook()
}

function ltop(d) {
  var c = d.closest('.lc')
  return d.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop
}

function lbook() {
  var w = document.getElementById('lab'), p = w && w.querySelector('.lbm'), c = w && w.querySelector('.lc')
  if (!p) return
  p.innerHTML = '<h6>sections</h6>'
  var top = el('a', c.scrollTop < 40 ? 'on' : '', '<i>—</i><span>specification</span>')
  top.onclick = function () { c.scrollTo({ top: 0, behavior: 'smooth' }) }
  p.appendChild(top)
  var cur = ''
  c.querySelectorAll('section[data-no]').forEach(function (d) { if (ltop(d) <= c.scrollTop + c.clientHeight * .3) cur = d.dataset.no })
  LSC.forEach(function (x) {
    var a = el('a', (cur == x[0] && c.scrollTop >= 40 ? 'on' : '') + (LO[x[0]] ? '' : ' cl'), '<i>' + x[0] + '</i><span>' + x[1] + '</span><em>' + (LO[x[0]] ? 'open' : '') + '</em>')
    a.onclick = function () { lopen(x[0], true, true) }
    p.appendChild(a)
  })
  var ac = el('div', 'lba')
  ;[['open all', 1], ['close all', 0]].forEach(function (y) {
    var b = el('button', '', y[0])
    b.onclick = function () { LSC.forEach(function (x) { lopen(x[0], y[1]) }) }
    ac.appendChild(b)
  })
  p.appendChild(ac)
}

function lspec(p, o) {
  var e = ev(o), m = met(o), sc = p.scrollTop
  p.innerHTML = ''
  LSC = []
  if (!p.onscroll) p.onscroll = function () { clearTimeout(p.bt); p.bt = setTimeout(lbook, 60) }

  var hd = el('div', 'lplate')
  var nm = smp(LTX || LB)
  nm.className = 'lname' + (LTX ? ' own' : '')
  nm.contentEditable = 'plaintext-only'
  nm.spellcheck = false
  nm.title = 'click and type anything to try this style'
  nm.dataset.ph = LB
  function big() {
    nm.style.fontSize = LTX ? '' : Math.min(e.z, 88) + 'px'
    nm.style.lineHeight = LTX ? '' : '1.05'
    if (LTX) sty(nm, { sty: LB }, 'text')
  }
  big()
  nm.onfocus = function () {
    nm.querySelectorAll('.hq').forEach(function (x) { x.replaceWith(x.textContent) })
    if (!LTX) nm.textContent = ''
  }
  nm.oninput = function () {
    var a = !LTX
    LTX = nm.textContent
    nm.classList.toggle('own', !!LTX)
    if (a) big()
  }
  nm.onkeydown = function (ev0) { if (ev0.key == 'Escape') nm.blur() }
  nm.onblur = function () {
    if (!nm.textContent.trim()) LTX = ''
    lspec(p, o)
  }
  hd.appendChild(nm)
  if (LTX) {
    var rs = el('a', 'lrs0', 'back to the style name')
    rs.onclick = function () { LTX = ''; lspec(p, o) }
    hd.appendChild(rs)
  }
  var sp = el('dl')
  ;[['family', fnm(e.f)], ['weight', wnm(e.w) + ' ' + e.w], ['style', (o.it ? 'italic' : 'roman') + (o.sk ? ', skew ' + o.sk + '°' : '')], ['size', e.z + ' px'], ['leading', Math.round(e.lh) + ' px · ' + Math.round(e.lh / e.r * 100) / 100 + ' rows'], ['tracking', e.tr + ' /1000 em'], ['kerning', o.kn == 'none' ? 'off' : 'metrics'], ['case', o.up ? 'uppercase' : /smcp/.test(o.ff || '') ? 'small caps' : 'as typed']].forEach(function (x) {
    sp.innerHTML += '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'
  })
  hd.appendChild(sp)
  p.appendChild(hd)

  var s1 = sec(p, '01', 'metrics')
  var S = 170, H = (m.asc + m.dsc) / 1000 * S, wr = el('div', 'lmet'), dg = el('div', 'mdg'), tx0 = smp('Hñxdp')
  dg.style.height = H + 'px'
  tx0.style.cssText += ';position:absolute;left:96px;top:0;white-space:nowrap;line-height:' + H + 'px;font-size:' + S + 'px;transform:none;text-transform:none;letter-spacing:0;font-feature-settings:normal'
  var pt = -99
  ;[['ascender', m.as], ['cap height', m.cap], ['x-height', m.x], ['baseline', 0], ['descender', -m.ds]].sort(function (a, b) { return b[1] - a[1] }).forEach(function (x) {
    var ln = el('div', 'mln' + (x[1] === 0 ? ' bl' : '')), tp = (m.asc - x[1]) / 1000 * S
    if (tp - pt < 15) ln.className += ' alt'
    else pt = tp
    ln.style.top = tp + 'px'
    ln.innerHTML = '<span>' + x[0] + '</span><em>' + Math.round(x[1]) + '</em>'
    dg.appendChild(ln)
  })
  dg.appendChild(tx0)
  wr.appendChild(dg)

  var gc = el('div', 'lgc'), gw = m.adv / 1000 * S, gx = el('div', 'gbx'), g = smp(LG)
  gx.style.width = Math.max(gw, 20) + 'px'
  gx.style.height = H + 'px'
  g.style.cssText += ';position:absolute;left:0;top:0;line-height:' + H + 'px;font-size:' + S + 'px;letter-spacing:0;transform:none;text-transform:none;font-feature-settings:normal'
  var l1 = el('i', 'sb'), l2 = el('i', 'sb')
  l1.style.cssText = 'left:0;width:' + Math.max(0, m.lsb / 1000 * S) + 'px'
  l2.style.cssText = 'right:0;width:' + Math.max(0, m.rsb / 1000 * S) + 'px'
  var bl = el('i', 'gbl')
  bl.style.top = m.asc / 1000 * S + 'px'
  gx.appendChild(l1)
  gx.appendChild(l2)
  gx.appendChild(bl)
  gx.appendChild(g)
  gc.appendChild(gx)
  gc.appendChild(el('dl', '', '<div><dt>glyph</dt><dd>' + LG + ' &nbsp;U+' + ('000' + LG.charCodeAt(0).toString(16).toUpperCase()).slice(-4) + '</dd></div><div><dt>advance</dt><dd>' + Math.round(m.adv) + '</dd></div><div><dt>left / right</dt><dd>' + Math.round(m.lsb) + ' / ' + Math.round(m.rsb) + '</dd></div><div><dt>height</dt><dd>' + Math.round(m.gt) + ' / ' + Math.round(-m.gb) + '</dd></div>'))
  wr.appendChild(gc)
  s1.appendChild(wr)
  s1.appendChild(el('p', 'lnote', 'units per 1000 em. x-height is ' + Math.round(m.x / m.cap * 100) + '% of the cap height, ' + (m.x / 1000 > .52 ? 'large, so it reads big for its size' : m.x / 1000 < .44 ? 'small, so it reads small for its size' : 'a middle x-height') + '. pick a glyph below to measure it.'))

  var s2 = sec(p, '02', 'sizes')
  var sm = e.z > 24 ? 14 : 11, lg = e.z >= 72 ? 144 : 96
  ;[[sm, 'reading'], [e.z, 'set'], [lg, 'display']].sort(function (a, b) { return a[0] - b[0] }).forEach(function (x) {
    var r = el('div', 'lsz' + (x[1] == 'set' ? ' set' : '')), t = smp(x[0] >= 60 ? 'Prensa ñ, tinta & papel' : 'Sphinx of black quartz, judge my vow. Taller ñ press')
    t.style.fontSize = x[0] + 'px'
    t.style.lineHeight = '1.25'
    r.innerHTML = '<label><b>' + x[0] + '</b>' + x[1] + '</label>'
    r.appendChild(t)
    s2.appendChild(r)
  })

  var g0 = pgd(s, pg()), cw = (cv.clientWidth - g0.pad * 2 - g0.gap * (g0.cols - 1)) / g0.cols, ms = LM * cw + (LM - 1) * g0.gap
  var mc = el('span', 'lstep', '<a>−</a><b>' + LM + ' col</b><a>+</a>')
  mc.firstChild.onclick = function () { LM = Math.max(1, LM - 1); lspec(p, o) }
  mc.lastChild.onclick = function () { LM = Math.min(g0.cols, LM + 1); lspec(p, o) }
  var s3 = sec(p, '03', 'setting', mc), st = el('div', 'lset'), ps = smp(PAN)
  st.style.width = ms + 'px'
  st.style.backgroundImage = 'linear-gradient(to top, rgba(232,56,44,.28) 1px, transparent 1px)'
  st.style.backgroundSize = '100% ' + e.r + 'px'
  st.appendChild(ps)
  s3.appendChild(st)
  var fx = smp('fi fl ffi ffl Office · 0123456789 · 1/2 · H&M')
  fx.className += ' lfx'
  s3.appendChild(fx)
  var rd = el('dl', 'lread')
  s3.appendChild(rd)
  var gr = GR
  GR = { row: e.r }
  bas(st)
  GR = gr
  var lines = Math.max(1, Math.round(ps.offsetHeight / e.lh)), cpl = Math.round(PAN.length / lines), ra = e.lh / e.z
  rd.innerHTML = '<div><dt>measure</dt><dd>' + Math.round(ms) + ' px · ' + LM + ' of ' + g0.cols + ' columns</dd></div>' +
    '<div><dt>per line</dt><dd>≈ ' + cpl + ' characters <u class="' + (cpl < 40 || cpl > 80 ? 'no' : cpl < 45 || cpl > 75 ? 'mid' : 'ok') + '">' + (cpl < 40 ? 'short, fine for headings' : cpl > 80 ? 'long, hard to read' : cpl < 45 || cpl > 75 ? 'at the edge' : 'comfortable') + '</u></dd></div>' +
    '<div><dt>leading</dt><dd>' + Math.round(e.lh) + ' / ' + e.z + ' = ' + ra.toFixed(2) + ' <u class="' + (ra < 1.05 || ra > 1.8 ? 'no' : ra < 1.15 || ra > 1.6 ? 'mid' : 'ok') + '">' + (ra < 1.05 ? 'tight, lines may touch' : ra > 1.8 ? 'very open' : ra < 1.15 ? 'tight, good for display' : ra > 1.6 ? 'open' : 'easy reading') + '</u></dd></div>' +
    '<div><dt>baseline</dt><dd>' + (Math.abs(e.lh / e.r - Math.round(e.lh / e.r)) < .01 ? 'on the grid, ' + (Math.round(e.lh / e.r) == 1 ? 'every row' : 'every ' + Math.round(e.lh / e.r) + ' rows') : 'off the grid, ' + Math.round(e.lh) + ' is not a multiple of ' + e.r) + '</dd></div>'

  gsec(p, o)

  var kt = el('label', 'lck', '<input type="checkbox"' + (LK ? ' checked' : '') + '> show without kerning')
  kt.firstChild.onchange = function () { LK = this.checked; lspec(p, o) }
  var s5 = sec(p, '05', 'kerning', kt), kg = el('div', 'lkp'), c1 = cfont(o, 1000, 'normal'), c0 = cfont(o, 1000, 'none')
  KP.forEach(function (k) {
    var v = Math.round(c1.measureText(k).width - c0.measureText(k).width), b = el('div', 'kc'), a = smp(k)
    a.style.fontSize = '46px'
    a.style.lineHeight = '64px'
    a.style.letterSpacing = '0'
    if (LK) {
      var z = smp(k)
      z.className += ' k0'
      z.style.cssText = a.style.cssText + ';font-kerning:none'
      b.appendChild(z)
    }
    b.appendChild(a)
    b.appendChild(el('em', v ? '' : 'z', o.kn == 'none' ? 'off' : (v > 0 ? '+' : '') + v))
    kg.appendChild(b)
  })
  s5.appendChild(kg)
  s5.appendChild(el('p', 'lnote', 'kerning values come from the font, in units per 1000 em. tracking adds ' + e.tr + ' to every pair.'))
  p.scrollTop = sc
  oma(p)
  lbook()
}

function lq(p, t) {
  var r = p.lastChild
  if (r && r.classList && r.classList.contains('lrw')) r.firstChild.appendChild(qmark(t))
  else p.appendChild(el('p', 'lhint', '')).appendChild(qmark(t))
}

function lrow(p, lb, x, v) {
  var r = el('div', 'lrw')
  r.appendChild(el('span', '', lb))
  r.appendChild(x)
  if (v) r.appendChild(v)
  p.appendChild(r)
  return r
}

function lrng(p, lb, mn, mx, st, get, set, fmt) {
  var i = el('input'), v = el('input', 'lnum'), r
  i.type = 'range'
  i.min = mn
  i.max = mx
  i.step = st
  v.type = 'number'
  v.step = st
  function sh() {
    i.value = get()
    v.value = fmt ? '' : get()
    if (fmt) v.placeholder = fmt(get())
  }
  function go(x) {
    set(x)
    sh()
    dirty()
    draw()
  }
  i.oninput = function () { go(+i.value) }
  v.onchange = function () { if (v.value !== '') go(+v.value) }
  if (fmt) v.readOnly = true
  sh()
  r = lrow(p, lb, i, v)
  return r
}

function lseg(p, lb, op, cur, f) {
  var g = el('span', 'lseg')
  op.forEach(function (x) {
    var b = el('button', x[0] == cur ? 'on' : '', x[1])
    b.onclick = function () {
      f(x[0])
      dirty()
      draw()
      lrd(1)
    }
    g.appendChild(b)
  })
  return lrow(p, lb, g)
}

function tog(o, on, off) {
  var a = (o.ff || '').split(' ').filter(function (x) { return x && off.indexOf(x) < 0 })
  if (on) a = a.concat(on.split(' '))
  if (a.length) o.ff = a.join(' ')
  else delete o.ff
}

function linsp(p, o) {
  var e = ev(o), f = fam(e.f), ws = f && f[2] ? f[2] : [100, 200, 300, 400, 500, 600, 700, 800, 900], sc = p.scrollTop
  p.innerHTML = ''
  p.appendChild(el('h6', '', 'family'))
  tg = p
  fpk('font', o)
  tg = pn

  p.appendChild(el('h6', '', 'size & leading'))
  lrng(p, 'size', 6, 240, 1, function () { return o.size || e.z }, function (x) { o.size = Math.max(1, x) })
  lrng(p, 'leading', 0, 10, 1, function () { return o.lr || 0 }, function (x) {
    delete o.lh
    if (x) o.lr = x
    else delete o.lr
  }, function (x) { return x ? x * e.r + 'px' : 'auto ' + lead(o.size || e.z) })
  lq(p, 'leading moves in whole baseline rows of ' + e.r + ' px, so every line lands on the grid')

  p.appendChild(el('h6', '', 'spacing'))
  lrng(p, 'tracking', -100, 400, 5, function () { return Math.round((o.ls || 0) * 1000) }, function (x) {
    if (x) o.ls = x / 1000
    else delete o.ls
  })
  lseg(p, 'kerning', [['', 'metrics'], ['none', 'off']], o.kn || '', function (v) {
    if (v) o.kn = v
    else delete o.kn
  })
  lseg(p, 'hyphenate', [['', 'off'], ['hy', 'on']], o.hy ? 'hy' : '', function (v) {
    if (v) o.hy = true
    else delete o.hy
  })
  lq(p, 'with hyphenation off, a word wider than its box still breaks so nothing spills out')
  lseg(p, 'optical margins', [['', 'off'], ['hq', 'on']], o.hq ? 'hq' : '', function (v) {
    if (v) o.hq = true
    else delete o.hq
  })
  if (o.hq) lrng(p, 'hang', 0, 200, 5, function () { return o.hqa != null ? o.hqa : 100 }, function (x) {
    if (x == 100) delete o.hqa
    else o.hqa = x
  }, function (x) { return x + '%' })
  if (o.hq) lq(p, 'like indesign: quotes, hyphens, periods and commas hang fully outside the edge, dashes and colons partly, and slanted letters like A V W Y T a little, at the start and end of every line, so the edge looks straight. 100% is the classic amount')

  p.appendChild(el('h6', '', 'shape'))
  lrng(p, 'weight', 0, ws.length - 1, 1, function () {
    var i = ws.indexOf(+(o.wt || 400))
    return i < 0 ? ws.indexOf(400) : i
  }, function (x) { o.wt = String(ws[x]) }, function (x) { return wnm(ws[x]) })
  lseg(p, 'style', [['', 'roman'], ['it', 'italic']], o.it ? 'it' : '', function (v) {
    if (v) o.it = true
    else delete o.it
  })
  lrng(p, 'skew °', -20, 20, 1, function () { return o.sk || 0 }, function (x) {
    if (x) o.sk = x
    else delete o.sk
  })
  lseg(p, 'case', [['', 'as typed'], ['up', 'ABC'], ['sc', 'Sᴍᴀʟʟ']], o.up ? 'up' : /smcp/.test(o.ff || '') ? 'sc' : '', function (v) {
    if (v == 'up') o.up = true
    else delete o.up
    tog(o, v == 'sc' ? 'smcp' : '', ['smcp'])
  })

  p.appendChild(el('h6', '', 'opentype'))
  var fg = /onum/.test(o.ff || '') ? 'onum' : /tnum/.test(o.ff || '') ? 'tnum' : ''
  lseg(p, 'figures', [['', 'default'], ['tnum', 'tabular'], ['onum', 'oldstyle']], fg, function (v) {
    tog(o, v == 'tnum' ? 'lnum tnum' : v, ['lnum', 'tnum', 'onum'])
  })
  lseg(p, 'ligatures', [['', 'on'], ['off', 'off']], /-liga/.test(o.ff || '') ? 'off' : '', function (v) {
    tog(o, v ? '-liga -clig' : '', ['-liga', '-clig'])
  })
  fsec(p, o)

  p.appendChild(el('h6', '', 'color'))
  var cl = el('input'), cx = el('a', 'lclr', o.fg ? 'clear' : 'none')
  cl.type = 'color'
  cl.value = o.fg || '#111111'
  cl.oninput = function () { o.fg = cl.value; cx.textContent = 'clear'; dirty(); draw() }
  cx.onclick = function () { delete o.fg; dirty(); draw(); lrd(1) }
  lrow(p, 'text', cl, cx)

  p.appendChild(el('h6', '', 'style'))
  var rn = el('input', 'lrn')
  rn.value = LB
  rn.onchange = function () {
    var v = rn.value.trim()
    if (!v || s.styles[v]) { rn.value = LB; return }
    var k = {}
    Object.keys(s.styles).forEach(function (x) { k[x == LB ? v : x] = s.styles[x] })
    s.styles = k
    rensty(s, LB, v)
    LB = v
    dirty()
    draw()
    panel()
    lrd(1)
  }
  lrow(p, 'name', rn)
  var bt = el('div', 'lbt')
  var du = el('button', '', 'duplicate'), dl = el('button', 'del', 'delete')
  du.onclick = function () {
    var n = LB + ' copy'
    while (s.styles[n]) n += ' copy'
    s.styles[n] = JSON.parse(JSON.stringify(o))
    dirty()
    lab(n)
  }
  dl.onclick = function () {
    if (!confirm('delete the style ' + LB + '? text using it goes back to the site font')) return
    delete s.styles[LB]
    relsty(LB, s)
    dirty()
    draw()
    var n = Object.keys(s.styles)[0]
    n ? lab(n) : lshut()
  }
  bt.appendChild(du)
  bt.appendChild(dl)
  p.appendChild(bt)
  p.scrollTop = sc
}

function rensty(o, a, b) {
  for (var k in o) {
    if (o[k] && typeof o[k] == 'object') rensty(o[k], a, b)
    else if (k == 'sty' && o[k] == a) o[k] = b
  }
}

var CM = {}, FCS = null, LBK = '', LSQ = '', LCP = ''

var BK = [
  [0x20, 0x7f, 'basic latin'],
  [0xa0, 0xff, 'latin-1'],
  [0x100, 0x17f, 'latin extended a'],
  [0x180, 0x24f, 'latin extended b'],
  [0x250, 0x2af, 'ipa'],
  [0x2b0, 0x2ff, 'modifiers'],
  [0x300, 0x36f, 'combining marks'],
  [0x370, 0x3ff, 'greek'],
  [0x400, 0x4ff, 'cyrillic'],
  [0x1e00, 0x1eff, 'latin extended additional'],
  [0x2000, 0x206f, 'punctuation'],
  [0x2070, 0x209f, 'super & subscripts'],
  [0x20a0, 0x20cf, 'currency'],
  [0x2100, 0x214f, 'letterlike'],
  [0x2150, 0x218f, 'fractions & numerals'],
  [0x2190, 0x21ff, 'arrows'],
  [0x2200, 0x22ff, 'math'],
  [0x2300, 0x23ff, 'technical'],
  [0x2460, 0x24ff, 'enclosed'],
  [0x2500, 0x257f, 'box drawing'],
  [0x25a0, 0x25ff, 'shapes'],
  [0x2600, 0x26ff, 'symbols'],
  [0x2700, 0x27bf, 'dingbats'],
  [0xe000, 0xf8ff, 'private use'],
  [0xfb00, 0xfb4f, 'ligatures']
]

var FN = {
  kern: 'kerning', liga: 'ligatures', dlig: 'discretionary ligatures', hlig: 'historical ligatures', clig: 'contextual ligatures', calt: 'contextual alternates',
  onum: 'oldstyle figures', lnum: 'lining figures', tnum: 'tabular figures', pnum: 'proportional figures', zero: 'slashed zero',
  smcp: 'small caps', c2sc: 'caps to small caps', pcap: 'petite caps', case: 'case forms', cpsp: 'capital spacing',
  frac: 'fractions', afrc: 'stacked fractions', numr: 'numerators', dnom: 'denominators', sups: 'superscript', subs: 'subscript', sinf: 'scientific inferiors', ordn: 'ordinals',
  salt: 'stylistic alternates', swsh: 'swashes', titl: 'titling', ornm: 'ornaments', aalt: 'all alternates', hist: 'historical forms'
}

var FX = ['kern', 'liga', 'clig', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'aalt', 'rlig', 'rvrn', 'cpsp', 'size']

function blk(c) {
  for (var i = 0; i < BK.length; i++) if (c >= BK[i][0] && c <= BK[i][1]) return BK[i][2]
  return 'other'
}

function prim(f) {
  return f.split(',')[0].replace(/["']/g, '').trim()
}

async function faces() {
  if (FCS) return FCS
  var t = await (await fetch('fonts.css')).text(), m, re = /@font-face\s*{([^}]*)}/g
  FCS = []
  while ((m = re.exec(t))) {
    var b = m[1]
    FCS.push({
      f: (b.match(/font-family:\s*"([^"]+)"/) || [])[1],
      u: (b.match(/url\("([^"]+)"\)/) || [])[1],
      w: +(b.match(/font-weight:\s*(\d+)/) || [0, 400])[1],
      it: /font-style:\s*italic/.test(b)
    })
  }
  return FCS
}

async function furl(o) {
  var e = ev(o), n = prim(e.f), fs = (await faces()).filter(function (x) { return x.f == n })
  if (!fs.length) return null
  var st = fs.filter(function (x) { return x.it == !!o.it })
  if (!st.length) st = fs
  st.sort(function (a, b) { return Math.abs(a.w - e.w) - Math.abs(b.w - e.w) })
  return st[0].u
}

function sfnt(buf) {
  var d = new DataView(buf), n = d.getUint16(4), tb = {}, out = [], ft = []
  for (var i = 0; i < n; i++) {
    var r = 12 + i * 16, tag = String.fromCharCode(d.getUint8(r), d.getUint8(r + 1), d.getUint8(r + 2), d.getUint8(r + 3))
    tb[tag] = d.getUint32(r + 8)
  }
  var cm = tb.cmap, best = null, bf = 0
  for (var j = 0, k = d.getUint16(cm + 2); j < k; j++) {
    var p = d.getUint16(cm + 4 + j * 8), en = d.getUint16(cm + 6 + j * 8), of = cm + d.getUint32(cm + 8 + j * 8), fm = d.getUint16(of)
    if (fm == 12 && (p == 3 || p == 0)) { best = of; bf = 12 }
    else if (fm == 4 && bf != 12 && (p == 3 || p == 0)) { best = of; bf = 4 }
  }
  if (bf == 12) {
    for (var g = 0, ng = d.getUint32(best + 12); g < ng; g++) {
      var a = d.getUint32(best + 16 + g * 12), z = d.getUint32(best + 20 + g * 12)
      for (var c = a; c <= z && c < 0x30000; c++) out.push(c)
    }
  } else if (bf == 4) {
    var sc = d.getUint16(best + 6) / 2, ec = best + 14, scd = ec + sc * 2 + 2, dl = scd + sc * 2, ro = dl + sc * 2
    for (var s0 = 0; s0 < sc; s0++) {
      var e1 = d.getUint16(ec + s0 * 2), s1 = d.getUint16(scd + s0 * 2), dt = d.getInt16(dl + s0 * 2), r0 = d.getUint16(ro + s0 * 2)
      for (var c2 = s1; c2 <= e1 && c2 != 0xffff; c2++) {
        var gi
        if (!r0) gi = (c2 + dt) & 0xffff
        else {
          gi = d.getUint16(ro + s0 * 2 + r0 + (c2 - s1) * 2)
          if (gi) gi = (gi + dt) & 0xffff
        }
        if (gi) out.push(c2)
      }
    }
  }
  ;['GSUB', 'GPOS'].forEach(function (t) {
    if (!tb[t]) return
    var fl = tb[t] + d.getUint16(tb[t] + 6)
    for (var q = 0, fc = d.getUint16(fl); q < fc; q++) {
      var r2 = fl + 2 + q * 6, tg = String.fromCharCode(d.getUint8(r2), d.getUint8(r2 + 1), d.getUint8(r2 + 2), d.getUint8(r2 + 3)).trim()
      if (ft.indexOf(tg) < 0) ft.push(tg)
    }
  })
  if (tb.kern && ft.indexOf('kern') < 0) ft.push('kern')
  return { u: out.filter(function (c) { return c >= 0x20 && (c < 0x7f || c > 0x9f) }), ft: ft.sort(), ex: true }
}

function guess(o) {
  var e = ev(o), n = prim(e.f), c = document.createElement('canvas').getContext('2d'), out = [], it = o.it ? 'italic ' : ''
  BK.forEach(function (b) {
    if (b[0] > 0x27bf && b[0] != 0xfb00) return
    for (var x = b[0]; x <= b[1]; x++) {
      var ch = String.fromCodePoint(x)
      c.font = it + e.w + ' 40px "' + n + '", monospace'
      var a = c.measureText(ch).width
      c.font = it + e.w + ' 40px "' + n + '", serif'
      if (a == c.measureText(ch).width && a > 0) out.push(x)
    }
  })
  return { u: out, ft: null, ex: false }
}

async function cset(o) {
  var u = await furl(o), k = u || 'sys:' + prim(ev(o).f) + ev(o).w + (o.it ? 'i' : '')
  if (CM[k]) return CM[k]
  if (u) CM[k] = sfnt(await (await fetch(u)).arrayBuffer())
  else CM[k] = guess(o)
  return CM[k]
}

function gsec(p, o) {
  var s4 = sec(p, '04', 'glyphs'), bar = el('div', 'lgb'), gr = el('div', 'lgg'), info = el('span', 'lgi', 'reading the font...')
  var sel0 = el('select'), q = el('input')
  q.placeholder = 'find: ñ, 00F1, arrows'
  q.value = LSQ
  bar.appendChild(sel0)
  bar.appendChild(q)
  bar.appendChild(info)
  s4.appendChild(bar)
  s4.appendChild(gr)
  var e = ev(o)
  gr.style.fontFamily = e.f
  gr.style.fontWeight = e.w
  gr.style.fontStyle = o.it ? 'italic' : ''
  cset(o).then(function (cs) {
    if (!gr.isConnected) return
    var by = {}
    cs.u.forEach(function (c) { (by[blk(c)] = by[blk(c)] || []).push(c) })
    var es = [].map.call('ÑñÁáÉéÍíÓóÚúÜü¿¡«»“”‘’—–€$', function (x) { return x.codePointAt(0) }).filter(function (c) { return cs.u.indexOf(c) > -1 })
    sel0.innerHTML = '<option value="">entire font (' + cs.u.length + ')</option><option value="es">ñ press set (' + es.length + ')</option>'
    BK.concat([[0, 0, 'other']]).forEach(function (b) {
      if (by[b[2]]) sel0.innerHTML += '<option value="' + b[2] + '">' + b[2] + ' (' + by[b[2]].length + ')</option>'
    })
    sel0.value = LBK
    if (sel0.value != LBK) sel0.value = LBK = ''
    function fill() {
      var v = LSQ.trim().toLowerCase(), hx = /^(u\+)?[0-9a-f]{2,5}$/.test(v) ? parseInt(v.replace('u+', ''), 16) : -1, ls
      ls = LBK == 'es' ? es : LBK ? by[LBK] || [] : cs.u
      if (v) ls = ls.filter(function (c) { return c == hx || String.fromCodePoint(c).toLowerCase() == v || blk(c).indexOf(v) > -1 })
      var h = '', mx = Math.min(ls.length, 1500)
      for (var i = 0; i < mx; i++) {
        var ch = String.fromCodePoint(ls[i]), x = ('000' + ls[i].toString(16).toUpperCase()).slice(-4)
        h += '<a data-c="' + ls[i] + '" title="U+' + x + ' · ' + blk(ls[i]) + '"' + (ch == LG ? ' class="on"' : '') + '>' + (ls[i] >= 0x300 && ls[i] <= 0x36f ? '◌' : '') + ch.replace(/[<&]/g, function (m) { return m == '<' ? '&lt;' : '&amp;' }) + '</a>'
      }
      gr.innerHTML = h
      info.textContent = (LCP ? LCP + ' · ' : '') + ls.length + ' shown' + (ls.length > mx ? ', first ' + mx : '') + (cs.ex ? '' : ' · estimated, system font')
    }
    sel0.onchange = function () { LBK = sel0.value; fill() }
    q.oninput = function () { LSQ = q.value; fill() }
    gr.onclick = function (ev0) {
      var a = ev0.target.closest('a')
      if (!a) return
      LG = String.fromCodePoint(+a.dataset.c)
      LCP = LG + ' copied, U+' + ('000' + (+a.dataset.c).toString(16).toUpperCase()).slice(-4)
      if (navigator.clipboard) navigator.clipboard.writeText(LG).catch(function () {})
      lspec(p, s.styles[LB])
    }
    fill()
    LCP = ''
  })
}

function fsec(p, o) {
  var bx = el('div', 'lft')
  p.appendChild(bx)
  cset(o).then(function (cs) {
    if (!cs.ft) {
      bx.appendChild(el('p', 'lhint', 'system fonts can not be read, so features are unknown. the switches above may do nothing'))
      return
    }
    var on = (o.ff || '').split(' ')
    bx.appendChild(el('p', 'lhint', 'in this font'))
    cs.ft.forEach(function (t) {
      if (FX.indexOf(t) > -1) return
      var b = el('button', on.indexOf(t) > -1 ? 'on' : '', '<b>' + t + '</b>' + (FN[t] || (/^ss\d\d$/.test(t) ? 'stylistic set ' + +t.slice(2) : /^cv\d\d$/.test(t) ? 'character variant ' + +t.slice(2) : '')))
      b.onclick = function () {
        tog(o, on.indexOf(t) > -1 ? '' : t, [t])
        dirty()
        draw()
        lrd(1)
      }
      bx.appendChild(b)
    })
    var hs = cs.ft.filter(function (t) { return FX.indexOf(t) > -1 }).filter(function (t) { return 'kern liga calt'.indexOf(t) > -1 })
    if (hs.length) bx.appendChild(el('p', 'lhint', 'always on: ' + hs.join(', ')))
  })
}

var GM = null, GT = {}, GS0 = []

var KW = {
  arrow: '←↑→↓↔↕↖↗↘↙⇐⇑⇒⇓⇔➔➜➝➞➟➠➡➢➣➤➥➦➧➨↩↪↺↻', star: '★☆✦✧✩✪✫✬✭✮✯✰⁎*', heart: '♥♡❤❥❣', check: '✓✔☑', cross: '✗✘×✕✖☒',
  bullet: '•◦‣⁃∙·●', dash: '-‐‒–—―', quote: '“”‘’«»‹›"\'„‚', copyright: '©', registered: '®', trademark: '™', degree: '°', euro: '€',
  dollar: '$', pound: '£', yen: '¥', cent: '¢', currency: '$€£¥¢₩₹₽¤', section: '§', paragraph: '¶', pilcrow: '¶', dagger: '†‡', ellipsis: '…',
  infinity: '∞', plus: '+±', minus: '−-', divide: '÷', times: '×', equal: '=≠≈≡≤≥', fraction: '½⅓⅔¼¾⅛⅜⅝⅞', circle: '○●◯◎⊙◉',
  square: '□■▢▪▫◻◼', triangle: '▲△▶▷▼▽◀◁', diamond: '◆◇♦❖', music: '♩♪♫♬♭♮♯', sun: '☀☼', smile: '☺☻', hand: '☚☛☜☝☞☟', snow: '❄❅❆',
  accent: 'áéíóúàèìòùâêîôûäëïöüñçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÑÇ', spanish: 'ñÑ¿¡áéíóúÁÉÍÓÚüÜ«»', question: '?¿⁇', exclamation: '!¡‼', at: '@', and: '&', ampersand: '&',
  number: '#№', percent: '%‰', slash: '/\\⁄', bracket: '()[]{}⟨⟩', space: '', prime: '′″', ordinal: 'ªº', superscript: '¹²³⁰⁴⁵⁶⁷⁸⁹', math: '∑∏√∫∂∆∇≈≠≤≥±÷×∞'
}

var NQ = 32, PRI = ['basic latin', 'latin-1', 'punctuation', 'currency', 'arrows', 'math', 'shapes', 'symbols', 'dingbats', 'fractions & numerals', 'latin extended a', 'letterlike', 'super & subscripts', 'ligatures']

function thin(b) {
  var N = NQ, ch = true, del = []
  function g(x, y) { return x < 0 || y < 0 || x >= N || y >= N ? 0 : b[y * N + x] }
  for (var it = 0; ch && it < 20; it++) {
    ch = false
    for (var s = 0; s < 2; s++) {
      del = []
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
        if (!b[y * N + x]) continue
        var p = [g(x, y - 1), g(x + 1, y - 1), g(x + 1, y), g(x + 1, y + 1), g(x, y + 1), g(x - 1, y + 1), g(x - 1, y), g(x - 1, y - 1)]
        var n = p.reduce(function (a, v) { return a + v }, 0), tr = 0
        for (var i = 0; i < 8; i++) if (!p[i] && p[(i + 1) % 8]) tr++
        if (n < 2 || n > 6 || tr != 1) continue
        if (s == 0 ? (p[0] * p[2] * p[4] || p[2] * p[4] * p[6]) : (p[0] * p[2] * p[6] || p[0] * p[4] * p[6])) continue
        del.push(y * N + x)
      }
      del.forEach(function (i) { b[i] = 0 })
      if (del.length) ch = true
    }
  }
  return b
}

function dtf(b) {
  var N = NQ, d = new Uint8Array(N * N), x, y, i, v
  for (i = 0; i < N * N; i++) d[i] = b[i] ? 0 : 255
  for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
    i = y * N + x
    v = d[i]
    if (x) v = Math.min(v, d[i - 1] + 3)
    if (y) v = Math.min(v, d[i - N] + 3)
    if (x && y) v = Math.min(v, d[i - N - 1] + 4)
    if (y && x < N - 1) v = Math.min(v, d[i - N + 1] + 4)
    d[i] = v
  }
  for (y = N - 1; y >= 0; y--) for (x = N - 1; x >= 0; x--) {
    i = y * N + x
    v = d[i]
    if (x < N - 1) v = Math.min(v, d[i + 1] + 3)
    if (y < N - 1) v = Math.min(v, d[i + N] + 3)
    if (x < N - 1 && y < N - 1) v = Math.min(v, d[i + N + 1] + 4)
    if (y < N - 1 && x) v = Math.min(v, d[i + N - 1] + 4)
    d[i] = v
  }
  return d
}

function gshape(draw, cut) {
  var N = NQ, c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true }), b = new Uint8Array(N * N), p = []
  c.width = c.height = N
  draw(x, N)
  var d = x.getImageData(0, 0, N, N).data
  for (var i = 0; i < N * N; i++) b[i] = d[i * 4 + 3] > cut * 255 ? 1 : 0
  thin(b)
  for (i = 0; i < N * N; i++) if (b[i]) p.push(i)
  if (p.length > 90) p = p.filter(function (v, j) { return j % Math.ceil(p.length / 90) == 0 })
  return { p: p, d: dtf(b) }
}

function gtpl(o, cs) {
  var k = o.font + o.wt + o.it
  if (GT[k]) return GT[k]
  var f = (o.it ? 'italic ' : '') + o.wt + ' 64px ' + o.font, m = document.createElement('canvas').getContext('2d'), out = [], kw = Object.keys(KW).map(function (w) { return KW[w] }).join('')
  m.font = f
  cs.u.forEach(function (c) {
    if (c <= 0x20 || (c >= 0x300 && c <= 0x36f) || c == 0xa0 || (c >= 0x2000 && c <= 0x200f)) return
    var bk = blk(c), pr = PRI.indexOf(bk), ch = String.fromCodePoint(c)
    if (!cs.ex && pr < 0 && kw.indexOf(ch) < 0) return
    var q = m.measureText(ch), w = q.actualBoundingBoxLeft + q.actualBoundingBoxRight, h = q.actualBoundingBoxAscent + q.actualBoundingBoxDescent
    if (w <= .5 || h <= .5) return
    var g = gshape(function (x, N) {
      var sc = (N - 4) / Math.max(w, h)
      x.setTransform(sc, 0, 0, sc, (N - w * sc) / 2 + q.actualBoundingBoxLeft * sc, (N - h * sc) / 2 + q.actualBoundingBoxAscent * sc)
      x.font = f
      x.fillText(ch, 0, 0)
    }, .3)
    if (!g.p.length) return
    g.c = c
    g.ar = w / h
    g.pr = pr < 0 ? (kw.indexOf(ch) > -1 ? 4 : 12) : pr < 5 ? 0 : pr < 10 ? 2 : 4
    out.push(g)
  })
  GT[k] = out
  return out
}

function gmatch(st, o, cs) {
  var pts = [].concat.apply([], st)
  if (!pts.length) return null
  var x0 = Math.min.apply(0, pts.map(function (p) { return p[0] })), x1 = Math.max.apply(0, pts.map(function (p) { return p[0] }))
  var y0 = Math.min.apply(0, pts.map(function (p) { return p[1] })), y1 = Math.max.apply(0, pts.map(function (p) { return p[1] }))
  var w = Math.max(x1 - x0, 1), h = Math.max(y1 - y0, 1), dot = w < 8 && h < 8, ar = w / h
  var a = gshape(function (x, N) {
    var sc = dot ? 1 : (N - 4) / Math.max(w, h)
    x.lineCap = x.lineJoin = 'round'
    x.lineWidth = dot ? 6 : 2
    x.strokeStyle = '#000'
    st.forEach(function (s) {
      x.beginPath()
      s.forEach(function (p, i) {
        var X = dot ? N / 2 : (p[0] - x0) * sc + (N - w * sc) / 2, Y = dot ? N / 2 : (p[1] - y0) * sc + (N - h * sc) / 2
        i ? x.lineTo(X, Y) : x.moveTo(X, Y)
      })
      if (s.length == 1) x.lineTo((dot ? NQ / 2 : (s[0][0] - x0) * sc + (NQ - w * sc) / 2) + .1, dot ? NQ / 2 : (s[0][1] - y0) * sc + (NQ - h * sc) / 2)
      x.stroke()
    })
  }, .3)
  var sc0 = dot ? 1 : (NQ - 4) / Math.max(w, h), sp = st.map(function (s) {
    var o2 = []
    s.forEach(function (p, i) {
      var X = (p[0] - x0) * sc0 + (NQ - w * sc0) / 2, Y = (p[1] - y0) * sc0 + (NQ - h * sc0) / 2
      if (dot) { X = Y = NQ / 2 }
      var q = i ? s[i - 1] : p, PX = (q[0] - x0) * sc0 + (NQ - w * sc0) / 2, PY = (q[1] - y0) * sc0 + (NQ - h * sc0) / 2
      if (dot) { PX = PY = NQ / 2 }
      var n = Math.max(1, Math.ceil(Math.hypot(X - PX, Y - PY)))
      for (var j = 1; j <= n; j++) {
        var xx = Math.round(PX + (X - PX) * j / n), yy = Math.round(PY + (Y - PY) * j / n)
        o2.push(Math.max(0, Math.min(NQ - 1, yy)) * NQ + Math.max(0, Math.min(NQ - 1, xx)))
      }
    })
    return o2
  })
  return gtpl(o, cs).map(function (g) {
    var s1 = 0, s2 = 0
    sp.forEach(function (ps) {
      var m = 0
      ps.forEach(function (i) { m += g.d[i] })
      s1 += m / ps.length
    })
    s1 /= sp.length
    g.p.forEach(function (i) { s2 += a.d[i] })
    var sc = (s1 * 1.2 + s2 / g.p.length) / 3, r = Math.abs(Math.log(Math.max(ar, .04) / Math.max(g.ar, .04)))
    if (dot) sc = g.ar > .4 && g.ar < 2.5 ? r * 2 + g.p.length / 4 : 99
    return [g.c, sc + Math.min(r, 2.5) * 2.2 + g.pr * .25]
  }).sort(function (p, q) { return p[1] - q[1] }).slice(0, 40).map(function (p) { return p[0] })
}

function gpad(gp) {
  var c = gp.querySelector('.gpd canvas'), x = c.getContext('2d'), tip = gp.querySelector('.gpd span'), cur = null, tm
  function size() {
    var r = c.getBoundingClientRect()
    c.width = r.width * 2
    c.height = r.height * 2
    x.setTransform(2, 0, 0, 2, 0, 0)
    x.lineCap = x.lineJoin = 'round'
    x.lineWidth = 3
    x.strokeStyle = '#2b5cff'
  }
  function redraw() {
    size()
    GS0.forEach(function (s) {
      x.beginPath()
      s.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]) })
      if (s.length == 1) x.lineTo(s[0][0] + .1, s[0][1])
      x.stroke()
    })
    tip.hidden = GS0.length > 0
  }
  c.onpointerdown = function (e) {
    e.preventDefault()
    cap(c, e.pointerId)
    var r = c.getBoundingClientRect()
    cur = [[e.clientX - r.left, e.clientY - r.top]]
    GS0.push(cur)
    clearTimeout(tm)
    redraw()
  }
  c.onpointermove = function (e) {
    if (!cur) return
    var r = c.getBoundingClientRect()
    cur.push([e.clientX - r.left, e.clientY - r.top])
    redraw()
  }
  c.onpointerup = function () {
    if (!cur) return
    cur = null
    clearTimeout(tm)
    tm = setTimeout(function () {
      if (!gp.cs) return
      GM = gmatch(GS0, gp.o, gp.cs)
      gp.fill()
    }, 350)
  }
  gp.querySelector('.gpd button').onclick = function () {
    GS0 = []
    GM = null
    redraw()
    if (gp.fill) gp.fill()
  }
  gp.pad = redraw
}
