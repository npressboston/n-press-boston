var LP = '', LQ = '', PM = {}, BZ = 18, RT = '', L = 'es', LS = ['es'], CUR = '', ST = {}, MOB = false, AU = {}, GR = {}

function tx(v) {
  if (v && typeof v == 'object') return v[L] != null && v[L] !== '' ? v[L] : (v[LS[0]] || '')
  return v == null ? '' : v
}

function url(h) {
  if (h && h.charAt(0) == '@') return (h.length > 1 ? (LP || RT) + h.slice(1) + '/' : LP || RT || './') + LQ
  return rp(h)
}

function rp(p) {
  if (PM[p]) return PM[p]
  if (!p || /^([a-z]+:|\/|#|\?)/i.test(p)) return p
  return RT + p
}

function mig(s) {
  var g = s.grid
  ;(s.common || []).concat.apply(s.common || [], s.pages.map(function (p) { return p.blocks })).forEach(function (b) {
    if (b.type == 'marquee' && b.text != null && b.html == null) {
      b.html = b.text
      delete b.text
    }
  })
  if (g.v >= 2) return
  var k = (g.row + g.gap) / 24
  function f(b) {
    b.y = Math.round(b.y * k)
    b.h = Math.max(1, Math.round(b.h * k))
    if (b.m && b.m.w) {
      b.m.y = Math.round(b.m.y * k)
      b.m.h = Math.max(1, Math.round(b.m.h * k))
    }
  }
  ;(s.common || []).forEach(f)
  s.pages.forEach(function (p) { p.blocks.forEach(f) })
  g.row = 24
  g.v = 2
}

function pgd(s, p) {
  var g = Object.assign({}, s.grid), o = (p && p.g) || {}
  for (var k in o) if (o[k] != null && o[k] !== '') g[k] = o[k]
  return g
}

function pbg(el, s, p) {
  var o = s.base || {}, i = p.bgi || (!p.bg && o.bgi), c = el.style
  c.backgroundColor = p.bg || o.bg || ''
  c.backgroundImage = i ? 'url("' + rp(i) + '")' : ''
  c.backgroundSize = i ? 'cover' : ''
  c.backgroundPosition = i ? 'center top' : ''
}

var PEND = 0

function pend(bl, p) {
  var n = 0
  bl.forEach(function (b) {
    if (b.fix || b.ag || b.wp) return
    var q = ps(b)
    n = Math.max(n, q.y + q.h)
  })
  PEND = MOB ? n : Math.max(n, plr(p))
  return PEND
}

function plr(p) {
  return p.len != null ? p.len : (s.grid && s.grid.len) || 0
}

function plen(el, p, g) {
  var o = ['100vh'], f = 0, n = plr(p)
  if (n && !MOB) o.push(n * g.row + g.pad * 2 + 'px')
  ;(s.common || []).concat(p.blocks).forEach(function (b) { if (b.ag && !b.fix) f = Math.max(f, (b.fy || 0) + (b.fh || 10)) })
  if (f) o.push('calc(' + f.toFixed(2) + 'cqw + ' + g.pad + 'px)')
  el.style.minHeight = o.length > 1 ? 'max(' + o.join(', ') + ')' : ''
}

function shp(el, b) {
  var sw = b.sw || 0, ln = b.sh == 'line', sa = ln ? 'c' : b.sa || 'i', off = sa == 'i' ? sw / 2 : sa == 'o' ? -sw / 2 : 0, ds = b.ds || '', g
  if (ln) {
    var q = { h: ['0', '50%', '100%', '50%'], v: ['50%', '0', '50%', '100%'], d: ['0', '0', '100%', '100%'], u: ['0', '100%', '100%', '0'] }[b.dir || 'h']
    g = '<line class="sp" x1="' + q[0] + '" y1="' + q[1] + '" x2="' + q[2] + '" y2="' + q[3] + '"/>'
  } else if (b.sh == 'ellipse') g = '<ellipse class="sp" cx="50%" cy="50%" rx="50%" ry="50%"/>'
  else g = '<rect class="sp" width="100%" height="100%" rx="' + (b.rd ? Math.max(0, b.rd - off) : 0) + '"/>'
  el.style.position = 'relative'
  el.innerHTML = '<svg style="position:absolute;left:' + off + 'px;top:' + off + 'px;width:calc(100% - ' + off * 2 + 'px);height:calc(100% - ' + off * 2 + 'px);overflow:visible">' + g + '<g class="di"></g></svg>'
  var p = el.querySelector('.sp'), cap = ds == 'dotted' ? 'round' : b.cap || 'butt'
  p.setAttribute('fill', ln ? 'none' : b.fill || 'none')
  if (!sw) return
  if (ds != 'img') {
    p.setAttribute('stroke', b.sc || '#111')
    p.setAttribute('stroke-width', sw)
    p.setAttribute('stroke-linecap', cap)
    p.setAttribute('stroke-linejoin', cap == 'round' ? 'round' : 'miter')
  }
  var dl = b.dl != null ? b.dl : sw * 3, dg = b.dg != null ? b.dg : ds == 'dotted' ? sw * 1.5 : sw * 2
  if (ds == 'dashed') p.setAttribute('stroke-dasharray', dl + ' ' + dg)
  if (ds == 'dotted') p.setAttribute('stroke-dasharray', '0 ' + (dg + sw))
  if (b.dof) p.setAttribute('stroke-dashoffset', -b.dof)
  if (ds && (b.dn || ds == 'img')) {
    var d = el.dataset
    d.k = ds
    d.sw = sw
    d.n = b.dn || ''
    d.dl = b.dl != null ? b.dl : ''
    d.dg = b.dg != null ? b.dg : ''
    d.o = b.dof || 0
    if (ds == 'img') d.src = b.di ? rp(b.di) : ''
    d.u = b.iu ? 1 : ''
  }
}

var AR = {}

function sdash(root) {
  root.querySelectorAll('.c-shape[data-k]').forEach(function (el) {
    var d = el.dataset, p = el.querySelector('.sp'), L = p.getTotalLength(), sw = +d.sw, n = +d.n || 0, ln = p.tagName == 'line'
    if (!L) return
    if (d.k != 'img') {
      var st = L / n, dl = d.k == 'dotted' ? 0 : Math.min(d.dl !== '' ? +d.dl : st * .6, st)
      p.setAttribute('stroke-dasharray', dl + ' ' + (st - dl))
      return
    }
    var src = d.src, ar = AR[src], g = el.querySelector('.di')
    g.innerHTML = ''
    if (!src) return
    if (!ar) {
      var im = new Image()
      im.onload = function () { AR[src] = im.naturalWidth / im.naturalHeight || 1; sdash(el.parentNode) }
      im.src = src
      return
    }
    var h = sw, w = d.dl !== '' ? +d.dl : h * ar, gap = d.dg !== '' ? +d.dg : h * .5, step = n ? L / n : w + gap, o = +d.o || 0, x, h0 = ''
    for (x = o; ln ? x + w <= L + .5 : x < L + o - .5; x += step) {
      var m = (x % L + L) % L, c = p.getPointAtLength(Math.min(L, m + w / 2)), a1 = p.getPointAtLength(Math.max(0, m + w / 2 - 1)), a2 = p.getPointAtLength(Math.min(L, m + w / 2 + 1))
      var an = d.u ? 0 : Math.atan2(a2.y - a1.y, a2.x - a1.x) * 180 / Math.PI
      h0 += '<image href="' + src + '" width="' + w + '" height="' + h + '" x="' + (c.x - w / 2) + '" y="' + (c.y - h / 2) + '" transform="rotate(' + an + ' ' + c.x + ' ' + c.y + ')" preserveAspectRatio="none"/>'
      if (step <= 0) break
    }
    g.innerHTML = h0
  })
}

function cols(g) { return MOB ? g.mc || 4 : g.cols }

function grd(box, g) {
  GR = g
  box.style.display = 'grid'
  box.style.gridTemplateColumns = 'repeat(' + cols(g) + ', minmax(0, 1fr))'
  box.style.gridAutoRows = g.row + 'px'
  box.style.columnGap = g.gap + 'px'
  box.style.rowGap = '0'
  box.style.padding = g.pad + 'px'
}

var TXY = 'text nav tabs cards gallery embed marquee lang button events join table', MPK = ['x', 'y', 'w', 'h', 'hide']

function hid(b) {
  return MOB ? b.on == 'd' || (b.m && b.m.hide) : b.on == 'p'
}

function mob(b) {
  if (!MOB || !b.m) return b
  var o = Object.assign({}, b)
  for (var k in b.m) if (MPK.indexOf(k) < 0) o[k] = b.m[k]
  return o
}

function auto(bl, g) {
  var c = g.mc || 4, C = g.cols || 12, ls = [], pos = {}
  AU = {}
  bl.forEach(function (b) {
    if (b.fix || b.ag || b.wp || (b.m && b.m.w) || b.on == 'd' || (b.m && b.m.hide)) return
    var fb = b.type == 'band' && !b.ic, w = fb ? c : Math.max(1, Math.round(b.w * c / C)), x = fb ? 0 : Math.round(b.x * c / C), h = b._h || b.h
    if (!fb && TXY.indexOf(b.type) > -1 && w < c) { w = c; x = 0 }
    else if (!fb && w < 2 && c > 1) w = 2
    if (x + w > c) x = Math.max(0, c - w)
    if (!b._h && 'image video shape embed banner'.indexOf(b.type) > -1) h = Math.max(1, Math.round(b.h * (w / c * 350) / (b.w / C * 1160)))
    ls.push({ b: b, x: x, w: w, h: h, y0: b.y, y1: b.y + b.h, dx: fb ? 0 : b.x, dw: fb ? C : b.w })
  })
  ls.sort(function (p, q) { return p.y0 - q.y0 || p.dx - q.dx })
  ls.forEach(function (it, i) {
    for (var j = 0; j < i; j++) {
      var q = ls[j]
      if (it.dx < q.dx + q.dw && q.dx < it.dx + it.dw && it.y0 < q.y1 && q.y0 < it.y1) { it.par = q; return }
    }
  })
  function root(it) { while (it.par) it = it.par; return it }
  var bs = ls.filter(function (it) { return !it.par }), y = 0, prev = 0, i = 0
  while (i < bs.length) {
    var cl = [bs[i]], top = bs[i].y0, end = bs[i].y1
    for (i++; i < bs.length && bs[i].y0 < end; i++) { cl.push(bs[i]); end = Math.max(end, bs[i].y1) }
    y += Math.max(0, Math.min(top - prev, 4))
    var ly = y, lb = y, used = []
    cl.sort(function (p, q) { return p.dx - q.dx || p.y0 - q.y0 })
    cl.forEach(function (it) {
      if (used.some(function (u) { return it.x < u.x + u.w && u.x < it.x + it.w })) { ly = lb; used = [] }
      it.py = ly
      used.push(it)
      lb = Math.max(lb, ly + it.h)
    })
    ls.forEach(function (it) {
      if (!it.par || cl.indexOf(root(it)) < 0) return
      var p = it.par
      it.py = p.py + Math.max(0, it.y0 - p.y0)
      var r = p
      while (r) {
        if (it.py + it.h > r.py + r.h && (r.b.type == 'band' || r.b.type == 'shape')) r.h = it.py + it.h - r.py
        r = r.par
      }
    })
    ls.forEach(function (it) { if (it.py != null && cl.indexOf(root(it)) > -1) lb = Math.max(lb, it.py + it.h) })
    y = lb
    prev = end
  }
  ls.forEach(function (it) { AU[it.b.id] = { x: it.x, y: it.py, w: it.w, h: it.h } })
}

function ps(b) {
  if (!MOB) return b
  if (b.m && b.m.w) return b.m
  return AU[b.id] || b
}

function lay(el, b, mm) {
  var p = ps(b), s = el.style
  el.classList.add('t-' + b.type)
  if (b.type == 'text' && !b.fm) el.classList.add('fr')
  s.zIndex = b.type == 'band' && b.wp ? -1 : b.z || (b.fix ? 30 : b.type == 'band' ? 0 : 1)
  s.display = hid(b) ? 'none' : ''
  s.margin = ''
  if (b.type == 'band' && b.wp) {
    s.position = 'absolute'
    s.top = s.left = s.right = s.bottom = '0'
    s.width = s.height = s.transform = s.gridColumn = s.gridRow = ''
    el.classList.add('wp')
    return
  }
  if (b.ag && !b.fix && !b.wp) {
    s.position = 'absolute'
    s.left = (b.fx || 0) + 'cqw'
    s.top = (b.fy || 0) + 'cqw'
    s.width = (b.fw || 10) + 'cqw'
    s.height = b.type == 'text' && !b.fm ? '' : (b.fh || 10) + 'cqw'
    s.right = s.bottom = s.gridColumn = s.gridRow = ''
    s.transform = b.rot ? 'rotate(' + b.rot + 'deg)' : ''
    el.classList.add('ag')
    return
  }
  if (b.fix && b.type != 'band') {
    var c = cols(GR), w = Math.min(p.w, c)
    s.position = mm ? 'absolute' : 'fixed'
    s.width = 'calc(' + (w / c * 100) + '% - ' + (GR.pad * 2 * w / c) + 'px)'
    s.height = p.h * GR.row + 'px'
    s.top = b.fix == 'top' ? (b.fo || 0) + '%' : ''
    s.bottom = b.fix == 'bottom' ? (b.fo || 0) + '%' : ''
    s.left = b.fa == 'right' ? '' : b.fa == 'left' ? GR.pad + 'px' : '50%'
    s.right = b.fa == 'right' ? GR.pad + 'px' : ''
    s.transform = ((!b.fa || b.fa == 'center' ? 'translateX(-50%) ' : '') + (b.rot ? 'rotate(' + b.rot + 'deg)' : '')).trim()
    return
  }
  s.position = s.width = s.height = s.top = s.bottom = s.left = s.right = ''
  s.transform = b.rot ? 'rotate(' + b.rot + 'deg)' : ''
  s.gridColumn = (p.x + 1) + ' / span ' + p.w
  s.gridRow = (p.y + 1) + ' / span ' + p.h
  if (b.type == 'band' && !b.ic) {
    s.gridColumn = '1 / -1'
    s.margin = (p.y ? 0 : -GR.pad + 'px') + ' ' + -GR.pad + 'px ' + (PEND && p.y + p.h >= PEND ? -GR.pad + 'px' : 0)
    el.classList.add('fb')
  }
}

function bly(L) {
  var d = document.createElement('i'), c = d.style, fx = L.fx == null ? (L.fit == 'tile' ? 0 : 50) : L.fx, fy = L.fy == null ? (L.fit == 'tile' ? 0 : 50) : L.fy
  d.className = 'bl'
  if (L.k == 'grad') {
    var st = (L.st || []).map(function (x) { return x.c + (x.p == null ? '' : ' ' + x.p + '%') }).join(', ')
    if ((L.st || []).length < 2) st = st ? st + ', ' + st : 'transparent, transparent'
    c.backgroundImage = (L.rp ? 'repeating-' : '') + (L.kd == 'radial' ? 'radial-gradient(circle at ' + fx + '% ' + fy + '%, ' : 'linear-gradient(' + (L.ang == null ? 180 : L.ang) + 'deg, ') + st + ')'
  } else if (L.src) {
    d.dataset.src = L.src
    c.backgroundImage = 'url("' + rp(L.src) + '")'
    c.backgroundPosition = fx + '% ' + fy + '%'
    if (L.fit == 'tile') {
      c.backgroundSize = L.tn ? 'calc(100% / ' + L.tn + ') auto' : L.tw ? L.tw + 'px auto' : 'calc(100% / 4) auto'
      c.backgroundRepeat = L.rx == 'x' ? 'repeat-x' : L.rx == 'y' ? 'repeat-y' : 'repeat'
    } else {
      c.backgroundSize = L.fit == 'contain' ? 'contain' : L.fit == 'stretch' ? '100% 100%' : 'cover'
      c.backgroundRepeat = 'no-repeat'
    }
  }
  if (L.att) c.backgroundAttachment = 'fixed'
  if (L.op != null) c.opacity = L.op / 100
  return d
}

function lead(z) {
  var r = GR.row || 24
  return Math.max(1, Math.ceil(z * 1.1 / r)) * r
}

function fitx(el) {
  if (!el.dataset.fs) el.dataset.fs = parseFloat(getComputedStyle(el).fontSize)
  var hi = +el.dataset.fs, lo = 4
  el.style.fontSize = hi + 'px'
  if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) return
  for (var i = 0; i < 12; i++) {
    var m = (lo + hi) / 2
    el.style.fontSize = m + 'px'
    if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) lo = m
    else hi = m
  }
  el.style.fontSize = Math.floor(lo * 10) / 10 + 'px'
}

var BL = {}

function bas(root) {
  var r = GR.row || 24
  root.querySelectorAll('.c-text:not(.m-fit)').forEach(function (c) {
    if (c.style.display == 'flex') return
    var cs = getComputedStyle(c), f = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + '/' + cs.lineHeight + ' ' + cs.fontFamily
    if (BL[f] == null) {
      var p = document.createElement('div'), i = document.createElement('i')
      p.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;font:' + f
      p.textContent = 'x'
      i.style.cssText = 'display:inline-block;width:0;height:0'
      p.appendChild(i)
      document.body.appendChild(p)
      BL[f] = i.offsetTop
      p.remove()
    }
    var y = BL[f] + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth), sh = (r - y % r) % r
    c.style.position = sh ? 'relative' : ''
    c.style.top = sh ? sh.toFixed(1) + 'px' : ''
  })
}

function sty(el, b, t) {
  var o = Object.assign({}, ST[b.sty] || {}, b), c = el.style
  if (o.font) c.fontFamily = o.font
  if (o.size) c.fontSize = o.size + 'px'
  if (o.wt) c.fontWeight = o.wt
  if (o.it) c.fontStyle = 'italic'
  if (o.un) c.textDecoration = 'underline'
  if (o.up) c.textTransform = 'uppercase'
  if (o.lr && t == 'text' && b.fm != 'fit') c.lineHeight = o.lr * (GR.row || 24) + 'px'
  else if (o.lh) c.lineHeight = o.lh
  else if (t == 'text' && b.fm != 'fit') c.lineHeight = lead(o.size || BZ) + 'px'
  if (o.kn) c.fontKerning = o.kn
  if (o.hy) c.hyphens = c.webkitHyphens = 'auto'
  if (o.ff) c.fontFeatureSettings = o.ff.split(' ').filter(Boolean).map(function (f) { return '"' + f.replace('-', '') + '" ' + (f.charAt(0) == '-' ? 0 : 1) }).join(', ')
  if (t == 'text' && b.fm == 'fit') c.lineHeight = 1.15
  if (o.ls) c.letterSpacing = o.ls + 'em'
  if (o.al) c.textAlign = o.al
  if (o.va && (t == 'text' || t == 'button')) {
    c.display = 'flex'
    c.flexDirection = 'column'
    c.justifyContent = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[o.va]
  }
  if (o.pd != null) c.padding = o.pd + 'px'
  if (o.bw) c.border = o.bw + 'px solid ' + (o.bc || 'var(--ln, #000)')
  if (o.rd) c.borderRadius = o.rd + 'px'
  if (o.op != null) c.opacity = o.op / 100
  if (o.sk) c.transform = 'skewX(' + -o.sk + 'deg)'
  if (o.bg) c.backgroundColor = o.bg
  if (o.fg) c.color = o.fg
}

function sb(s) {
  var b = s.base || {}, y = (s.styles || {})[b.sty || 'body copy']
  return y || { font: b.font, size: b.size }
}

function base(el, s, p) {
  var o = Object.assign({}, s.base), c = el.style, y = sb(s)
  if (p) ['fg', 'hl', 'ln'].forEach(function (k) { if (p[k]) o[k] = p[k] })
  c.fontFamily = y.font || ''
  c.fontSize = y.size ? y.size + 'px' : ''
  c.fontWeight = y.wt || ''
  c.fontStyle = y.it ? 'italic' : ''
  c.letterSpacing = y.ls ? y.ls + 'em' : ''
  BZ = y.size || 18
  c.color = o.fg || ''
  c.setProperty('--hl', o.hl || '#fff45c')
  c.setProperty('--ln', o.ln || '#000')
  ST = s.styles || {}
}

function ln(it) {
  var a = document.createElement('a')
  a.href = url(it.href) || '#'
  a.textContent = tx(it.t)
  if (it.href && it.href.charAt(0) == '@' && it.href.slice(1) == CUR) a.className = 'on'
  return a
}

function mq(el, b) {
  var w = document.createElement('div'), t = '', h = tx(b.html) || tx(b.text) || '', dr = b.dir || ''
  for (var i = 0; i < 4; i++) t += '<span>' + h + '</span>'
  w.className = 'mqi'
  w.innerHTML = t + t
  w.style.animationDuration = (b.speed || 20) + 's'
  if (dr == 'r' || dr == 'd') w.style.animationDirection = 'reverse'
  if (dr == 'u' || dr == 'd') el.classList.add('mqv')
  if (b.hp) el.classList.add('mqh')
  if (b.gp != null) el.style.setProperty('--mg', b.gp + 'px')
  if (b.ih) el.style.setProperty('--mih', b.ih / 100)
  w.querySelectorAll('img').forEach(function (im) {
    var k = im.getAttribute('src')
    im.dataset.src = k
    im.src = rp(k)
    im.alt = im.alt || ''
  })
  pl(w)
  el.appendChild(w)
}

var EV = null, EVD = 0, EVX = 0, ETZ = 'America/New_York', EFM = {}
var EVW = {
  es: { add: 'añadir a mi calendario', none: 'no hay eventos próximos', past: 'eventos pasados', all: 'todo el día', demo: 'eventos de muestra · el calendario aún no está conectado', today: 'hoy', g: 'google calendar', i: 'apple, outlook (.ics)' },
  en: { add: 'add to my calendar', none: 'no upcoming events', past: 'past events', all: 'all day', demo: 'sample events · the calendar is not connected yet', today: 'today', g: 'google calendar', i: 'apple, outlook (.ics)' }
}

function ew() { return EVW[L] || EVW.en }

function ef(k, o) {
  var n = L + k
  if (!EFM[n]) EFM[n] = new Intl.DateTimeFormat(k == 'dk' ? 'en-CA' : L, Object.assign({ timeZone: ETZ }, o))
  return EFM[n]
}

function dk(t) { return ef('dk', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(t) }

function esc0(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function evs0() {
  var n = new Date(), o = [], d0 = new Date(n.getFullYear(), n.getMonth(), n.getDate())
  function at(dd, h, m) { var d = new Date(d0); d.setDate(d.getDate() + dd); d.setHours(h, m || 0); return d.getTime() }
  function nxt(wd, min) { var k = (wd - d0.getDay() + 7) % 7; while (k < (min || 0)) k += 7; return k }
  var th = nxt(4)
  for (var i = 0; i < 6; i++) o.push({ id: 'os' + i, t: 'Open studio · taller abierto', s: at(th + i * 7, 18), e: at(th + i * 7, 21), loc: 'ñ press, East Boston', d: 'Drop in, bring a project or start one. Presses, ink and paper are here.\nVen a imprimir, todo el material está aquí.' })
  var sa = nxt(6, 8), su = nxt(0, 18), sm = nxt(6, 26)
  o.push({ id: 'rs', t: 'Riso 101 workshop', s: at(sa, 13), e: at(sa, 16), loc: 'ñ press, East Boston', d: 'Learn to print on the risograph, from making a file to pulling two colors. 8 spots.', img: 'photos/Studios/Riso_Prints/©IaritzaMenjivar-8100.JPG' })
  o.push({ id: 'zn', t: 'Zine night', s: at(su, 17), e: at(su, 20), loc: 'ñ press, East Boston', d: 'Cut, paste, fold and staple. We bring the copier.', img: 'photos/Projects/Zine_Night_Workshop/©IaritzaMenjivar-6100.JPG' })
  o.push({ id: 'mk', t: 'Holiday print market', s: at(sm, 0), e: at(sm + 2, 0), ad: 1, loc: 'ñ press, East Boston', d: 'Prints, zines and cards from the studio members.', img: 'photos/Studios/Final_day/©IaritzaMenjivar-8364.JPG' })
  o.push({ id: 'ps', t: 'Poster night', s: at(-9, 18), e: at(-9, 21), loc: 'ñ press, East Boston' })
  return o.sort(function (a, b) { return a.s - b.s })
}

function evl() {
  if (EV || EVD) return
  EVD = 1
  fetch('/ev').then(function (r) { return r.ok ? r.json() : { demo: 1 } }).catch(function () { return { demo: 1 } }).then(function (j) {
    EV = j.demo ? { ev: evs0(), demo: 1 } : j
    if (window.evup) evup()
  })
}

function ewhen(e) {
  var w = ew()
  if (e.ad) {
    var l = e.e - 864e5, f = ef('md', { weekday: 'short', month: 'short', day: 'numeric' })
    return (dk(l) == dk(e.s) ? f.format(e.s) : f.formatRange(e.s, l)) + ' · ' + w.all
  }
  var a = ef('wd', { weekday: 'short', month: 'short', day: 'numeric' }).format(e.s), h = ef('hm', { hour: 'numeric', minute: '2-digit' })
  return a + ' · ' + (dk(e.s) == dk(e.e) ? h.formatRange(e.s, e.e) : ef('all', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).formatRange(e.s, e.e))
}

function zt(t) { return new Date(t).toISOString().replace(/[-:]|\.\d+/g, '') }

function ecal(e) {
  var d = e.ad ? dk(e.s).replace(/-/g, '') + '/' + dk(e.e).replace(/-/g, '') : zt(e.s) + '/' + zt(e.e)
  var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(e.t) + '&dates=' + d + '&details=' + encodeURIComponent(e.d || '') + '&location=' + encodeURIComponent(e.loc || '')
  function q(v) { return String(v || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1') }
  var ic = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//n press//events//EN', 'BEGIN:VEVENT', 'UID:' + e.id + '@npress', 'DTSTAMP:' + zt(Date.now()),
    e.ad ? 'DTSTART;VALUE=DATE:' + d.split('/')[0] : 'DTSTART:' + zt(e.s), e.ad ? 'DTEND;VALUE=DATE:' + d.split('/')[1] : 'DTEND:' + zt(e.e),
    'SUMMARY:' + q(e.t), 'DESCRIPTION:' + q(e.d), 'LOCATION:' + q(e.loc), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  var w = ew(), fn = (e.t || 'event').toLowerCase().replace(/[^a-z0-9ñ]+/g, '-').replace(/^-|-$/g, '') || 'event'
  return '<details class="eva"><summary>' + w.add + '</summary><span><a href="' + g + '" target="_blank" rel="noopener">' + w.g + '</a><a href="data:text/calendar;charset=utf-8,' + encodeURIComponent(ic) + '" download="' + fn + '.ics">' + w.i + '</a></span></details>'
}

function elink(t) {
  return esc0(t).replace(/(https?:\/\/[^\s<]+)/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') + '</a>' })
}

function eone(e, b, sm) {
  var d = new Date(e.s), x = ''
  x += '<article class="ev' + (sm ? ' evs' : '') + '">'
  x += '<div class="evd"><b>' + ef('dd', { day: 'numeric' }).format(d) + '</b><span>' + ef('mo', { month: 'short' }).format(d).replace('.', '') + '</span></div>'
  x += '<div class="evb"><h4>' + (e.u && !sm ? '<a href="' + esc0(e.u) + '" target="_blank" rel="noopener">' + esc0(e.t) + '</a>' : esc0(e.t)) + '</h4>'
  x += '<p class="evt">' + esc0(ewhen(e)) + (b.loc && e.loc ? '<br><span>' + elink(e.loc) + '</span>' : '') + '</p>'
  if (!sm && b.dsc && e.d) x += '<p class="evx">' + elink(e.d).replace(/\n/g, '<br>') + '</p>'
  if (!sm && b.add) x += ecal(e)
  x += '</div>'
  if (!sm && b.pic && e.img) x += '<img class="evi" src="' + esc0(rp(e.img)) + '" alt="" loading="lazy">'
  return x + '</article>'
}

function elist(el, b) {
  var now = Date.now(), all = EV.ev || [], up = all.filter(function (e) { return e.e >= now }), pa = all.filter(function (e) { return e.e < now }).reverse()
  var x = up.slice(0, b.n || 5).map(function (e) { return eone(e, b) }).join('')
  if (!up.length) x = '<p class="eve">' + esc0(tx(b.emp) || ew().none) + '</p>'
  if (b.past && pa.length) x += '<h5>' + ew().past + '</h5>' + pa.slice(0, b.past).map(function (e) { return eone(e, b, 1) }).join('')
  el.innerHTML = x
}

function emon(el, b, ym, sk) {
  var now = Date.now(), tk = dk(now), all = EV.ev || [], by = {}
  if (!ym) {
    var nx = all.filter(function (e) { return e.e >= now })[0]
    ym = tk.slice(0, 7)
    sk = sk || (nx && dk(nx.s).slice(0, 7) == ym ? dk(Math.max(nx.s, now)) : tk)
  }
  all.forEach(function (e) {
    for (var t = Date.parse(dk(e.s) + 'T12:00Z'), l = dk(e.e - 1); ; t += 864e5) {
      var k = new Date(t).toISOString().slice(0, 10)
      ;(by[k] = by[k] || []).push(e)
      if (k >= l) break
    }
  })
  if (sk == 'x') sk = Object.keys(by).sort().filter(function (k) { return k.slice(0, 7) == ym && (ym != tk.slice(0, 7) || k >= tk) })[0] || ''
  var y = +ym.slice(0, 4), m = +ym.slice(5) - 1, f = new Date(Date.UTC(y, m, 1)), n = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), ws = b.ws == 'mo' ? 1 : 0
  var lead = (f.getUTCDay() - ws + 7) % 7, x = '<div class="emh"><a class="emp">‹</a><b>' + new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(f) + '</b><a class="emn">›</a></div><div class="emg">'
  for (var i = 0; i < 7; i++) x += '<span class="emw">' + new Intl.DateTimeFormat(L, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 1, 1 + i + ws))) + '</span>'
  for (i = 0; i < lead; i++) x += '<span></span>'
  for (var d = 1; d <= n; d++) {
    var k = ym + '-' + (d < 10 ? '0' : '') + d, es = by[k] || []
    x += '<a class="emd' + (k == tk ? ' tdy' : '') + (k == sk ? ' on' : '') + (es.length ? ' has' : '') + (k < tk ? ' was' : '') + '" data-k="' + k + '"><i>' + d + '</i>' + es.slice(0, 3).map(function (e) { return '<em>' + esc0(e.t) + '</em>' }).join('') + (es.length > 3 ? '<em>+' + (es.length - 3) + '</em>' : '') + '</a>'
  }
  x += '</div><div class="eml">'
  var se = by[sk] || []
  x += se.length ? se.map(function (e) { return eone(e, b) }).join('') : '<p class="eve">' + esc0(tx(b.emp) || ew().none) + '</p>'
  el.innerHTML = x + '</div>'
  el.querySelector('.emp').onclick = function () { emon(el, b, new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 7), 'x') }
  el.querySelector('.emn').onclick = function () { emon(el, b, new Date(Date.UTC(y, m + 1, 1)).toISOString().slice(0, 7), 'x') }
  el.querySelectorAll('.emd').forEach(function (a) { a.onclick = function () { emon(el, b, ym, a.dataset.k) } })
}

function evr(el, b, mm) {
  el.classList.add(b.vw == 'month' ? 'evm' : 'evls')
  if (b.ac) el.style.setProperty('--ac', b.ac)
  if (EVX) return
  if (!EV) {
    evl()
    if (mm) el.innerHTML = '<span class="ph">events</span>'
    return
  }
  if (b.vw == 'month') emon(el, b)
  else elist(el, b)
  if (EV.demo) el.insertAdjacentHTML('afterbegin', '<p class="edm">' + ew().demo + '</p>')
}

var JNW = {
  es: { nm: 'nombre', em: 'correo electrónico', bad: 'revisa tu correo, parece que falta algo', slow: 'demasiados intentos, prueba en un rato', err: 'no se pudo enviar, prueba otra vez' },
  en: { nm: 'name', em: 'email', bad: 'check your email, something looks off', slow: 'too many tries, wait a bit', err: 'that did not go through, try again' }
}

function jn(el, b, mm) {
  var w = JNW[L] || JNW.en, f = document.createElement('form'), t0 = Date.now()
  f.className = 'jn' + (b.lay == 'st' ? ' jst' : '')
  f.noValidate = true
  f.innerHTML = '<input class="jhp" name="w" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<div class="jf">' + (b.nmf ? '<input name="nm" autocomplete="name" maxlength="80">' : '') +
    '<input name="em" type="email" autocomplete="email" required maxlength="254"><button type="submit"></button></div><p class="jnt"></p><p class="jms" hidden></p>'
  var q = function (k) { return f.querySelector(k) }
  if (b.nmf) q('[name=nm]').placeholder = w.nm
  q('[name=em]').placeholder = tx(b.ph) || w.em
  q('button').textContent = tx(b.bt) || '→'
  q('.jnt').textContent = tx(b.note)
  if (!tx(b.note)) q('.jnt').remove()
  if (b.bbg) q('button').style.background = b.bbg
  if (b.bfg) q('button').style.color = b.bfg
  f.onsubmit = function (e) {
    e.preventDefault()
    if (mm) return
    var em = q('[name=em]').value.trim(), ms = q('.jms')
    function say(x, ok) { ms.hidden = false; ms.textContent = x; ms.className = 'jms' + (ok ? ' jok' : '') }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) return say(w.bad)
    q('button').disabled = true
    fetch('/join', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ em: em, nm: b.nmf ? q('[name=nm]').value : '', lg: L, p: CUR, ct: [tx(b.note), tx(b.bt)].filter(Boolean).join(' / '), w: q('[name=w]').value, t: t0 })
    }).then(function (r) { return r.json().catch(function () { return {} }).then(function (j) { j._s = r.status; return j }) }).then(function (j) {
      q('button').disabled = false
      if (j.ok) {
        f.classList.add('jdn')
        say(tx(b.ok) || '✓', 1)
        return
      }
      say(j._s == 429 ? w.slow : j.err == 'email' ? w.bad : w.err)
    }).catch(function () {
      q('button').disabled = false
      say(w.err)
    })
  }
  el.appendChild(f)
}

var TRO = typeof ResizeObserver != 'undefined' ? new ResizeObserver(function (es) {
  es.forEach(function (e) {
    if (!e.target.isConnected) return TRO.unobserve(e.target)
    tln(e.target)
  })
}) : null

function tcov(b) {
  var cv0 = {}
  ;(b.cells || []).forEach(function (row, r) {
    row.forEach(function (c, k) {
      if (!c || cv0[r + ',' + k]) return
      for (var i = 0; i < (c.rs || 1); i++) for (var j = 0; j < (c.cs || 1); j++) if (i || j) cv0[(r + i) + ',' + (k + j)] = 1
    })
  })
  return cv0
}

function tbl(el, b, mm) {
  var tc = b.tc || [1], tr = b.tr || [1], md = MOB ? b.tm || '' : 'g', stk = md == '', g = document.createElement('div'), cv0 = tcov(b)
  el.classList.add('tbm' + (md || 's'))
  g.className = 'tg'
  g.tb = b
  g.style.gridTemplateColumns = stk ? 'minmax(0, 1fr)' : tc.map(function (w) { return 'minmax(0, ' + w + 'fr)' }).join(' ')
  g.style.gridTemplateRows = stk || b.ra ? '' : tr.map(function (h) { return 'minmax(0, ' + h + 'fr)' }).join(' ')
  if (stk || b.ra) g.style.gridAutoRows = 'auto'
  g.style.gap = (b.tg || 0) + 'px'
  if (md == 'scroll') g.style.minWidth = (b.mw || 640) + 'px'
  ;(b.cells || []).forEach(function (row, r) {
    if (r >= tr.length) return
    row.forEach(function (c, k) {
      if (k >= tc.length || cv0[r + ',' + k]) return
      c = c || {}
      var d = document.createElement('div'), x = d.style, pd = c.pd != null ? c.pd : b.cp != null ? b.cp : 10
      d.className = 'tcl'
      d.tc = c
      d.dataset.r = r
      d.dataset.c = k
      if (!stk) {
        x.gridColumn = (k + 1) + ' / span ' + Math.min(c.cs || 1, tc.length - k)
        x.gridRow = (r + 1) + ' / span ' + Math.min(c.rs || 1, tr.length - r)
      }
      if (c.bg || b.cbg) x.backgroundColor = c.bg || b.cbg
      if (c.fg) x.color = c.fg
      if (c.al) x.textAlign = c.al
      if (c.size) x.fontSize = c.size + 'px'
      x.justifyContent = { middle: 'center', bottom: 'flex-end' }[c.va || b.tva] || ''
      if (c.k == 'img') {
        d.classList.add('tim')
        if (c.src) {
          var m = document.createElement('img')
          m.src = rp(c.src)
          m.alt = tx(c.alt)
          m.loading = 'lazy'
          fit(m, c)
          if (c.ip) x.padding = pd + 'px'
          d.appendChild(m)
        } else if (mm) d.innerHTML = '<span class="ph">image</span>'
      } else {
        x.padding = pd + 'px'
        var t = document.createElement('div')
        t.className = 'tct'
        t.innerHTML = tx(c.html)
        pl(t, mm)
        d.appendChild(t)
      }
      g.appendChild(d)
    })
  })
  var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  sv.setAttribute('class', 'tsv')
  g.appendChild(sv)
  if (md == 'scroll') {
    var w = document.createElement('div')
    w.className = 'tsw'
    w.appendChild(g)
    el.appendChild(w)
  } else el.appendChild(g)
  if (TRO) TRO.observe(g)
}

function tln(g) {
  var b = g.tb, sv = g.querySelector('.tsv'), W = g.offsetWidth, H = g.offsetHeight, sg = {}, hd0 = {}, by = {}, h = ''
  if (!b || !sv || !W) return
  function v(o, k, d) { return o[k] != null && o[k] !== '' ? o[k] : d }
  g.querySelectorAll('.tcl').forEach(function (el) {
    var c = el.tc, ov = c.sw != null && c.sw !== '', x0 = el.offsetLeft, y0 = el.offsetTop, x1 = x0 + el.offsetWidth, y1 = y0 + el.offsetHeight
    var y = { sw: +v(c, 'sw', b.sw || 0), sc: v(c, 'sc', b.sc || '#111111'), ds: v(c, 'ds', b.ds || ''), dl: v(c, 'dl', b.dl), dg: v(c, 'dg', b.dg), cap: v(c, 'cap', b.cap || '') }
    ;[['t', 'h', y0, x0, x1], ['b', 'h', y1, x0, x1], ['l', 'v', x0, y0, y1], ['r', 'v', x1, y0, y1]].forEach(function (q) {
      var k = q[1] + Math.round(q[2]) + ':' + Math.round(q[3]) + '-' + Math.round(q[4]), ed = q[1] == 'h' ? q[2] < 1 || q[2] > H - 1 : q[2] < 1 || q[2] > W - 1
      if ((c.hs || '').indexOf(q[0]) > -1) { hd0[k] = 1; return }
      if (!ov && !(ed ? b.lo : q[1] == 'h' ? b.lh : b.lv)) return
      var p = ov ? 2 : 1
      if (!sg[k] || sg[k].p < p) sg[k] = { o: q[1], at: q[2], a: q[3], z: q[4], y: y, p: p, k: k }
    })
  })
  Object.keys(sg).forEach(function (k) {
    var s0 = sg[k]
    if (s0.p < 2 && hd0[k]) return
    if (!s0.y.sw) return
    var key = s0.o + Math.round(s0.at) + '|' + JSON.stringify(s0.y)
    ;(by[key] = by[key] || []).push(s0)
  })
  Object.keys(by).forEach(function (key) {
    var ls = by[key].sort(function (a, z) { return a.a - z.a }), m = []
    ls.forEach(function (s0) {
      var l = m[m.length - 1]
      if (l && s0.a <= l.z + 1.5) l.z = Math.max(l.z, s0.z)
      else m.push({ o: s0.o, at: s0.at, a: s0.a, z: s0.z, y: s0.y })
    })
    m.forEach(function (s0) {
      var y = s0.y, sw = y.sw, cap = y.ds == 'dotted' ? 'round' : y.cap || (y.ds ? 'butt' : 'square'), da = ''
      var dl = y.dl != null && y.dl !== '' ? +y.dl : sw * 3, dg = y.dg != null && y.dg !== '' ? +y.dg : y.ds == 'dotted' ? sw * 1.5 : sw * 2
      if (y.ds == 'dashed') da = dl + ' ' + dg
      if (y.ds == 'dotted') da = '0 ' + (dg + sw)
      var p = s0.o == 'h' ? [s0.a, s0.at, s0.z, s0.at] : [s0.at, s0.a, s0.at, s0.z]
      h += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + p[2] + '" y2="' + p[3] + '" stroke="' + y.sc + '" stroke-width="' + sw + '" stroke-linecap="' + cap + '"' + (da ? ' stroke-dasharray="' + da + '"' : '') + (b.dof ? ' stroke-dashoffset="' + -b.dof + '"' : '') + '/>'
    })
  })
  sv.setAttribute('width', W)
  sv.setAttribute('height', H)
  sv.innerHTML = h
}

function nc(b) {
  var c = b.cols || 3
  return MOB ? b.mcol || Math.min(c, 2) : c
}

function crd(el, b) {
  var g = document.createElement('div'), p = document.createElement('div')
  g.className = 'cg'
  g.style.gridTemplateColumns = 'repeat(' + nc(b) + ', minmax(0, 1fr))'
  ;(b.items || []).forEach(function (it, i) {
    var d = document.createElement(it.href ? 'a' : 'div')
    if (it.href) d.href = url(it.href)
    d.className = 'cd'
    d.dataset.tag = it.tag || ''
    d.dataset.n = i
    d.dataset.p = parseFloat(String(it.price || '').replace(/[^0-9.]/g, '')) || 0
    d.dataset.k = b.id + ':' + i
    d.innerHTML = '<span class="hrt">♡</span>' +
      (it.badge ? '<span class="bdg">' + tx(it.badge) + '</span>' : '') +
      '<div class="ci">' + (it.img ? '<img src="' + rp(it.img) + '" alt="">' : '') + '</div>' +
      '<div class="cm"><span>' + tx(it.t) + '</span><span>' + (it.was ? '<s>' + it.was + '</s> ' : '') + (it.price || '') + '</span></div>'
    g.appendChild(d)
  })
  p.className = 'pgr'
  el.dataset.per = b.per || 0
  el.appendChild(g)
  el.appendChild(p)
  sh(el, 0, '')
}

function sh(el, n, tag) {
  var per = +el.dataset.per || 1e6, k = 0
  el.querySelectorAll('.cd').forEach(function (c) {
    var ok = !tag || c.dataset.tag == tag
    c.style.display = ok && k >= n * per && k < (n + 1) * per ? '' : 'none'
    if (ok) k++
  })
  var p = el.querySelector('.pgr'), m = Math.ceil(k / per)
  p.innerHTML = ''
  if (m > 1) {
    for (var i = 0; i < m; i++) p.innerHTML += '<span data-i="' + i + '"' + (i == n ? ' class="on"' : '') + '>' + (i + 1) + '</span>'
    if (n < m - 1) p.innerHTML += '<span data-i="' + (n + 1) + '">→</span>'
  }
  el.dataset.cur = n
  el.dataset.tag = tag
}

function pl(el, mm) {
  el.querySelectorAll('a[href^="@"]').forEach(function (a) {
    if (mm) a.dataset.at = a.getAttribute('href')
    a.setAttribute('href', url(a.getAttribute('href')))
  })
}

function fit(el, b) {
  if (b.fit) el.style.objectFit = b.fit
  if (b.fp) el.style.objectPosition = b.fp
}

function gal(el, b, mm) {
  var it = b.items || [], sl = b.mode == 'slides'
  el.classList.add(sl ? 'sl' : 'gg')
  if (!sl) {
    el.style.gridTemplateColumns = 'repeat(' + nc(b) + ', minmax(0, 1fr))'
    el.style.gap = (b.gg == null ? 10 : b.gg) + 'px'
  }
  if (!it.length && mm) el.innerHTML = '<span class="ph">gallery</span>'
  it.forEach(function (x, i) {
    var f = document.createElement('figure'), im = document.createElement('img')
    im.src = rp(x.src) || ''
    im.alt = tx(x.cap)
    im.loading = 'lazy'
    fit(im, b)
    if (b.zoom) {
      im.dataset.z = b.id
      im.dataset.cap = tx(x.cap)
    }
    f.appendChild(im)
    if (x.cap && b.caps) {
      var c = document.createElement('figcaption')
      c.textContent = tx(x.cap)
      f.appendChild(c)
    }
    if (sl && i) f.style.display = 'none'
    el.appendChild(f)
  })
  if (sl && it.length > 1) {
    el.insertAdjacentHTML('beforeend', '<a class="sv pv">‹</a><a class="sv nx">›</a><div class="dts">' + it.map(function (x, i) { return '<i' + (i ? '' : ' class="on"') + '></i>' }).join('') + '</div>')
    el.dataset.n = 0
    el.dataset.auto = b.auto || 0
  }
}

function bk(b, mm) {
  b = mob(b)
  var el = document.createElement('div'), t = b.type
  if ((t == 'image' || t == 'video') && b.src) {
    el = document.createElement(t == 'image' ? 'img' : 'video')
    el.src = rp(b.src)
    fit(el, b)
    if (t == 'image') {
      el.alt = tx(b.alt)
      if (b.zoom) {
        el.dataset.z = b.id
        if (b.cap) el.dataset.cap = tx(b.cap)
      }
    } else {
      el.playsInline = true
      el.loop = !b.once
      if (b.poster) el.poster = rp(b.poster)
      if (b.ctl) el.controls = true
      if (!b.ctl || b.auto) {
        el.muted = true
        el.autoplay = true
      }
    }
  } else if (t == 'image' || t == 'video') {
    el.textContent = mm ? t : ''
    el.className = 'ph'
  } else if (t == 'gallery') {
    gal(el, b, mm)
  } else if (t == 'text') {
    el.innerHTML = tx(b.html)
    pl(el, mm)
    if (b.fm) el.classList.add('m-' + b.fm)
  } else if (t == 'marquee') {
    mq(el, b)
  } else if (t == 'nav' || t == 'tabs') {
    (b.items || []).forEach(function (it) { el.appendChild(ln(it)) })
    if (t == 'tabs' && b.flt) {
      var f = document.createElement('span')
      f.className = 'flt'
      f.innerHTML = tx(b.flt) + '<b>+</b><span class="fm"><span data-s="n">default</span><span data-s="lo">price, low to high</span><span data-s="hi">price, high to low</span><span data-s="az">a to z</span></span>'
      el.appendChild(f)
    }
  } else if (t == 'cards') {
    crd(el, b)
  } else if (t == 'banner') {
    if (b.src) el.style.backgroundImage = 'url("' + rp(b.src) + '")'
    if (b.fit) el.style.backgroundSize = b.fit
    if (b.fp) el.style.backgroundPosition = b.fp
    el.innerHTML = '<div class="bn">' + tx(b.html) + '</div>'
    pl(el, mm)
  } else if (t == 'button') {
    el.textContent = tx(b.t)
  } else if (t == 'lang') {
    LS.forEach(function (l) {
      var a = document.createElement('a')
      a.href = '#'
      a.dataset.l = l
      a.textContent = (b.names && b.names[l]) || l.toUpperCase()
      if (l == L) a.className = 'on'
      el.appendChild(a)
    })
  } else if (t == 'shape') {
    shp(el, b)
  } else if (t == 'band') {
    if (b.bg) el.style.backgroundColor = b.bg
    ;(b.ly || []).slice().reverse().forEach(function (L) { el.appendChild(bly(L)) })
  } else if (t == 'table') {
    tbl(el, b, mm)
  } else if (t == 'join') {
    jn(el, b, mm)
  } else if (t == 'events') {
    evr(el, b, mm)
  } else if (t == 'embed') {
    el.innerHTML = b.code || (mm ? '<span class="ph">embed</span>' : '')
  }
  el.className += ' c c-' + t
  sty(el, b, t)
  if (b.href && !mm && !b.zoom && 'text image banner button video'.indexOf(t) > -1) {
    var a = document.createElement('a')
    a.href = url(b.href)
    a.className = 'lk'
    a.appendChild(el)
    return a
  }
  return el
}

function nf() {
  return { id: 'nf', type: 'text', x: 0, y: 7, w: s.grid.cols, h: 6, al: 'center', size: 28, html: { es: 'no encontramos esta página. <a href="@">volver al inicio</a>', en: 'this page is not here. <a href="@">back home</a>' } }
}

function fb() {
  document.addEventListener('error', function (e) {
    var m = e.target, k = m.getAttribute && m.getAttribute('src') || '', i = k.indexOf('photos/')
    if ((m.tagName == 'IMG' || m.tagName == 'VIDEO') && i > -1 && !m.dataset.fb) {
      m.dataset.fb = 1
      m.src = '/api/img/' + k.slice(i + 7)
    }
  }, true)
}
