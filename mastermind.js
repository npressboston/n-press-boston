var TM = null, RO = false, PV = {}, s, dir, sel = null, SS = [], pi = 0, dirt = false
var UN = [], RE = [], LAST = null, dt
var cv = document.getElementById('cv'), pin = document.getElementById('pin')
var pn = document.getElementById('pn')
var st = document.getElementById('st'), tip = document.getElementById('tip'), bx = document.getElementById('bx')
var rt = document.getElementById('rt'), hlp = document.getElementById('hlp')

function pg() { return s.pages[pi] }

function all() { return (s.common || []).concat(pg().blocks) }

function arr(b) { return (s.common || []).indexOf(b) > -1 ? s.common : pg().blocks }

function rv(v) {
  if (v && typeof v == 'object') return v[L] || ''
  return L == LS[0] && v != null ? v : ''
}

function wr(o, k, v) {
  if (typeof o[k] != 'object' && L == LS[0]) {
    if (v === '') delete o[k]
    else o[k] = v
    return
  }
  if (typeof o[k] != 'object') {
    var d = {}
    d[LS[0]] = o[k] || ''
    o[k] = d
  }
  o[k][L] = v
}

function tbr() {
  var ps = document.getElementById('pgs'), lg = document.getElementById('lg')
  ps.innerHTML = ''
  s.pages.forEach(function (p, i) {
    var o = document.createElement('option')
    o.value = i
    o.textContent = (p.slug ? '/' + p.slug : 'home') + ' · ' + (tx(p.title) || '')
    ps.appendChild(o)
  })
  ps.value = pi
  lg.innerHTML = ''
  LS.forEach(function (l) {
    var o = document.createElement('option')
    o.value = l
    o.textContent = l
    lg.appendChild(o)
  })
  lg.value = L
  lg.style.display = LS.length > 1 ? '' : 'none'
}

function setup() {
  mig(s)
  s.common = s.common || []
  s.base = s.base || {}
  s.styles = s.styles || {}
  s.pages.forEach(function (p) { if (p.g) delete p.g.row })
  ;(s.common || []).concat.apply(s.common || [], s.pages.map(function (p) { return p.blocks })).forEach(function (b) {
    if (b.m && b.m.hide) { b.on = 'd'; delete b.m.hide }
  })
  s.grid.mc = s.grid.mc || 4
  s.grid.bp = s.grid.bp || 700
  LS = s.langs = s.langs || ['es']
  if (LS.indexOf(L) < 0) L = LS[0]
  if (pi >= s.pages.length) pi = 0
  CUR = s.pages[pi].slug || ''
  tbr()
  draw()
  panel()
}

var SB = false, cvd = cv, cvp = document.getElementById('cvp')

function act(m) {
  MOB = m
  cv = m && SB ? cvp : cvd
}

function evup() {
  if (!s) return
  draw()
  if (sel && sel.type == 'events') panel()
}

function draw() {
  if (!SB) {
    cv = cvd
    cvp.innerHTML = ''
    cvp.removeAttribute('style')
    cvp.className = ''
    document.getElementById('mb').textContent = MOB ? 'phone' : 'desktop'
    return draw0()
  }
  var m0 = MOB
  act(true)
  draw0()
  act(false)
  draw0()
  act(m0)
}

function draw0() {
  var g = pgd(s, pg()), c = cols(g)
  cv.innerHTML = ''
  pin.innerHTML = ''
  cv.style.width = MOB ? '390px' : ''
  cv.style.margin = MOB ? '0 auto' : ''
  grd(cv, g)
  base(cv, s, pg())
  auto(all(), g)
  var nw = MOB ? all().filter(function (b) { return !b.fix && !(b.m && b.m.w) }) : []
  if (nw.length) {
    var hd = document.createElement('div')
    hd.style.cssText = 'position:absolute;left:-9999px;top:0;width:390px;box-sizing:border-box'
    document.body.appendChild(hd)
    grd(hd, g)
    base(hd, s, pg())
    nw.forEach(function (b) {
      if (b.type == 'text' ? b.fm : 'cards nav events table'.indexOf(b.type) < 0) return
      var d = document.createElement('div'), x
      d.className = 'b'
      lay(d, b)
      d.appendChild(bk(b))
      hd.appendChild(d)
      x = d.querySelector('.c')
      x.style.height = 'auto'
      bas(d)
      b._h = Math.max(1, Math.ceil((x.offsetHeight + (parseFloat(x.style.top) || 0)) / g.row))
    })
    hd.remove()
    auto(all(), g)
    nw.forEach(function (b) { delete b._h })
  }
  pend(all(), pg())
  cv.style.setProperty('--gl', 'linear-gradient(to right, rgba(60,100,255,.07) calc(100% - ' + g.gap + 'px), transparent 0), linear-gradient(to top, rgba(255,60,90,.28) 1px, transparent 1px)')
  cv.style.setProperty('--gs', 'calc((100% + ' + g.gap + 'px) / ' + c + ') 100%, 100% ' + g.row + 'px')
  cv.style.setProperty('--gp', g.pad + 'px')
  pbg(cv, s, pg())
  cv.lang = L
  if (!cv.style.backgroundColor) cv.style.backgroundColor = '#fff'
  var mx = 0, bl = all()
  SS = SS.filter(function (x) { return bl.indexOf(x) > -1 })
  if (sel && bl.indexOf(sel) < 0) sel = null
  if (sel && SS.indexOf(sel) < 0) SS = [sel]
  if (!sel) SS = []
  bl.forEach(function (b) {
    var d = document.createElement('div')
    d.className = 'b' + (SS.indexOf(b) > -1 ? ' on' : '') + (s.common.indexOf(b) > -1 ? ' sh' : '')
    d.bid = b.id
    lay(d, b, 1)
    if (hid(b)) {
      d.style.display = ''
      d.classList.add('hid')
    }
    if (MOB && b.m && b.m.w) d.classList.add('ul')
    d.appendChild(bk(b, 1))
    if (b.type == 'table') thook(b, d)
    d.querySelectorAll('img, video').forEach(function (m) {
      var k = m.dataset.src || m.getAttribute('src')
      if (PV[k]) m.src = PV[k]
    })
    if (b.type == 'banner' && PV[b.src]) d.firstChild.style.backgroundImage = 'url("' + PV[b.src] + '")'
    d.querySelectorAll('.bl[data-src]').forEach(function (x) { if (PV[x.dataset.src]) x.style.backgroundImage = 'url("' + PV[x.dataset.src] + '")' })
    if (b.type == 'video' && PV[b.poster]) d.firstChild.poster = PV[b.poster]
    ;['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(function (h) {
      var r = document.createElement('span')
      r.className = 'rz rz-' + h
      r.dataset.h = h
      d.appendChild(r)
    })
    var ro = document.createElement('span')
    ro.className = 'rr'
    ro.title = 'drag to rotate, shift snaps to 15°, double click resets'
    d.appendChild(ro)
    if (b.type == 'text' && !b.fm) d.classList.add('fh')
    if (b.lk) d.classList.add('lk')
    d.onpointerdown = function (e) {
      if (SB) act(d.mob)
      if (e.target == ro) return spin(e, b, d)
      grab(e, b, d, e.target.dataset.h)
    }
    d.ondblclick = function (e) {
      if (SB) act(d.mob)
      if (e.target == ro) {
        delete b.rot
        dirty(); draw(); panel()
        return
      }
      if ((b.type == 'text' || b.type == 'marquee') && !d.querySelector('[contenteditable=true]')) typ(b, d, e, 1)
      var te = b.type == 'table' && tat(d, e)
      if (te && !d.querySelector('[contenteditable=true]')) {
        var cl = te.tc
        if (cl.k == 'img') return lib(function (p) { cl.src = p; tgo() })
        typ(b, d, e, 1, { el: te.querySelector('.tct'), save: function (h) { wr(cl, 'html', h) }, h0: tx(cl.html) })
      }
    }
    if (b.type == 'shape' && b.di && PV[b.di]) d.firstChild.dataset.src = PV[b.di]
    d.mob = MOB
    ;(b.fix && cv == cvd ? pin : cv).appendChild(d)
    bas(d)
    sdash(d)
    tfit(d, b)
    if (!b.fix && !b.wp) mx = Math.max(mx, ps(b).y + ps(b).h)
  })
  var end = MOB ? mx : Math.max(mx, plr(pg())), cw0 = cv.clientWidth - g.pad * 2, fb0 = 0
  all().forEach(function (b) { if (b.ag && !b.fix) fb0 = Math.max(fb0, ((b.fy || 0) + (b.fh || 10)) * cw0 / 100) })
  if (fb0 > end * g.row) end = Math.ceil(fb0 / g.row)
  cv.style.minHeight = ((end + 24) * g.row + g.pad * 2) + 'px'
  var pe = document.createElement('div'), pz = document.createElement('div')
  pe.className = 'pe' + (plr(pg()) > mx && !MOB ? ' set' : '')
  pe.style.top = g.pad * 2 + end * g.row + 'px'
  pe.innerHTML = '<span>' + (MOB ? 'phone page ends here' : plr(pg()) > mx ? 'page ends at row ' + end + (pg().len == null ? ' (global)' : '') + ' · drag, double click to reset' : 'page ends here · drag down to add space') + '</span>'
  pz.className = 'pz'
  pz.style.top = g.pad * 2 + end * g.row + 'px'
  cv.appendChild(pz)
  cv.appendChild(pe)
  if (!MOB && !RO) {
    pe.onpointerdown = function (e) {
      e.preventDefault()
      e.stopPropagation()
      pe.setPointerCapture(e.pointerId)
      pe.onpointermove = function (e) {
        var r = cv.getBoundingClientRect(), n = Math.round((e.clientY - r.top - g.pad * 2) / g.row)
        var gl = s.grid.len || 0
        if (n <= mx) { if (gl > mx) pg().len = 0; else delete pg().len }
        else if (n == gl) delete pg().len
        else pg().len = n
        var en = Math.max(mx, plr(pg()))
        pe.style.top = g.pad * 2 + en * g.row + 'px'
        pz.style.top = g.pad * 2 + en * g.row + 'px'
        tip.style.display = 'block'
        tip.style.left = e.clientX + 14 + 'px'
        tip.style.top = e.clientY + 14 + 'px'
        tip.textContent = plr(pg()) > mx ? 'page ends at row ' + en + ', ' + (en - mx) + ' empty rows' + (pg().len == null ? ', global' : '') : 'auto, ends with the last block'
      }
      pe.onpointerup = function () {
        pe.onpointermove = pe.onpointerup = null
        tip.style.display = 'none'
        dirty(); draw(); panel()
      }
    }
    pe.ondblclick = function () {
      delete pg().len
      dirty(); draw(); panel()
    }
  }
  var r = cv.getBoundingClientRect()
  pin.style.left = r.left + 'px'
  pin.style.width = r.width + 'px'
  base(pin, s, pg())
  mgx()
}

function mgs() {
  return SS.filter(function (b) { return !b.fix && !b.lk && !hid(b) && elof(b) })
}

function mgr(ls) {
  return ls.map(function (b) {
    var el = elof(b)
    return { b: b, el: el, x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, r: b.rot || 0 }
  })
}

function mgb(o) {
  var x0 = Math.min.apply(0, o.map(function (i) { return i.x })), y0 = Math.min.apply(0, o.map(function (i) { return i.y }))
  var x1 = Math.max.apply(0, o.map(function (i) { return i.x + i.w })), y1 = Math.max.apply(0, o.map(function (i) { return i.y + i.h }))
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

function mgp(b, x, y, w, h) {
  var g = pgd(s, pg()), k = step(), W = cw(), c = k.c
  if (b.ag) {
    b.fx = x / W * 100
    b.fy = Math.max(0, y / W * 100)
    b.fw = Math.max(4, w) / W * 100
    if (!(b.type == 'text' && !b.fm)) b.fh = Math.max(4, h) / W * 100
    return
  }
  var q = MOB ? mpos(b) : b, fb = b.type == 'band' && !b.ic
  if (!fb) {
    q.w = Math.max(1, Math.min(c, Math.round((w + g.gap) / k.w)))
    q.x = Math.max(0, Math.min(c - q.w, Math.round((x - g.pad) / k.w)))
  }
  q.y = Math.max(0, Math.round((y - g.pad) / g.row))
  if (!(b.type == 'text' && !b.fm)) q.h = Math.max(1, Math.round(h / g.row))
}

function mgx() {
  var ls = mgs()
  cv.classList.toggle('multi', ls.length > 1)
  if (ls.length < 2 || RO) return
  var G = mgb(mgr(ls)), bx0 = document.createElement('div'), m0 = MOB
  bx0.className = 'gbx'
  function at(B) {
    bx0.style.left = B.x + 'px'
    bx0.style.top = B.y + 'px'
    bx0.style.width = B.w + 'px'
    bx0.style.height = B.h + 'px'
  }
  at(G)
  ;['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(function (h) {
    var r = document.createElement('span')
    r.className = 'rz rz-' + h
    r.dataset.h = h
    bx0.appendChild(r)
  })
  var ro = document.createElement('span')
  ro.className = 'rr'
  ro.title = 'rotate the selection, shift snaps to 15°'
  bx0.appendChild(ro)
  cv.appendChild(bx0)
  bx0.onpointerdown = function (e) {
    var h = e.target.dataset.h
    if (!h && e.target != ro) return
    if (SB) act(m0)
    e.preventDefault()
    e.stopPropagation()
    var o = mgr(mgs()), B = mgb(o), sx = e.clientX, sy = e.clientY, moved = false
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2, cr = cv.getBoundingClientRect()
    var a0 = Math.atan2(e.clientY - cr.top - cy, e.clientX - cr.left - cx)
    bx0.setPointerCapture(e.pointerId)
    bx0.onpointermove = function (e) {
      moved = true
      if (e.target == ro || !h) {
        var a = (Math.atan2(e.clientY - cr.top - cy, e.clientX - cr.left - cx) - a0) * 180 / Math.PI
        a = e.shiftKey ? Math.round(a / 15) * 15 : Math.round(a)
        var t0 = a * Math.PI / 180
        o.forEach(function (i) {
          var ix = i.x + i.w / 2 - cx, iy = i.y + i.h / 2 - cy, nx = cx + ix * Math.cos(t0) - iy * Math.sin(t0), ny = cy + ix * Math.sin(t0) + iy * Math.cos(t0)
          mgp(i.b, nx - i.w / 2, ny - i.h / 2, i.w, i.h)
          var r = ((i.r + a + 540) % 360) - 180
          if (r) i.b.rot = r
          else delete i.b.rot
          lay(i.el, i.b, 1)
        })
        tip.textContent = 'rotate ' + a + '°'
      } else {
        var dx = e.clientX - sx, dy = e.clientY - sy, N = { x: B.x, y: B.y, w: B.w, h: B.h }
        if (/e/.test(h)) N.w = Math.max(8, B.w + dx)
        if (/w/.test(h)) { N.w = Math.max(8, B.w - dx); N.x = B.x + B.w - N.w }
        if (/s/.test(h)) N.h = Math.max(8, B.h + dy)
        if (/n/.test(h)) { N.h = Math.max(8, B.h - dy); N.y = B.y + B.h - N.h }
        if (e.shiftKey && h.length == 2) {
          var f = Math.max(N.w / B.w, N.h / B.h)
          N.w = B.w * f
          N.h = B.h * f
          if (/w/.test(h)) N.x = B.x + B.w - N.w
          if (/n/.test(h)) N.y = B.y + B.h - N.h
        }
        var kx = N.w / B.w, ky = N.h / B.h
        o.forEach(function (i) {
          mgp(i.b, N.x + (i.x - B.x) * kx, N.y + (i.y - B.y) * ky, i.w * kx, i.h * ky)
          lay(i.el, i.b, 1)
          tfit(i.el, i.b)
        })
        at(N)
        tip.textContent = Math.round(kx * 100) + '% × ' + Math.round(ky * 100) + '%' + (h.length == 2 ? ', shift keeps proportions' : '')
      }
      tip.style.display = 'block'
      tip.style.left = e.clientX + 14 + 'px'
      tip.style.top = e.clientY + 14 + 'px'
    }
    bx0.onpointerup = function () {
      bx0.onpointermove = bx0.onpointerup = null
      tip.style.display = 'none'
      if (moved) { dirty(); draw(); panel() }
    }
  }
}

function mgf() {
  document.querySelectorAll('.gbx').forEach(function (x) { x.remove() })
  if (!SB) return mgx()
  var m0 = MOB
  act(true)
  mgx()
  act(false)
  mgx()
  act(m0)
}

var OV = {}

function tfit(d, b) {
  if (b.type != 'text') return
  var c = d.querySelector('.c')
  if (b.fm == 'fit') return fitx(c)
  if (b.fm == 'lock') {
    var o = c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1
    if (o) OV[b.id] = 1
    else delete OV[b.id]
    d.classList.toggle('ov', o)
    if (!d.querySelector('.ovm')) d.insertAdjacentHTML('beforeend', '<span class="ovm" title="text is cut off">!</span>')
    return
  }
  delete OV[b.id]
  if (b.fix) return
  if (MOB && !(b.m && b.m.w)) return
  var n = Math.max(1, Math.ceil((c.offsetHeight + (parseFloat(c.style.top) || 0)) / GR.row)), q = MOB ? b.m : b
  if (q.h != n) {
    q.h = n
    lay(d, b, 1)
  }
}

function mpos(b) {
  if (!(b.m && b.m.w)) b.m = Object.assign(b.m || {}, AU[b.id] || { x: 0, y: 0, w: s.grid.mc || 4, h: b.h })
  return b.m
}

function relink(b) {
  delete b.m
  if (b.on == 'p') delete b.on
}

function mprox(b) {
  if (b.__pb) return b
  return new Proxy(b, {
    get: function (o, k) {
      if (k == '__pb') return b
      return b.m && MPK.indexOf(k) < 0 && k in b.m ? b.m[k] : o[k]
    },
    set: function (o, k, v) {
      b.m = b.m || {}
      b.m[k] = v
      return true
    },
    deleteProperty: function (o, k) {
      if (b.m) delete b.m[k]
      return true
    },
    has: function (o, k) { return (b.m && k in b.m) || k in o }
  })
}

function pdot(l, b, k) {
  if (!b.m || !(k in b.m) || MPK.indexOf(k) > -1) return
  var d = document.createElement('b')
  d.className = 'pd'
  d.title = 'phone only, click to match desktop again'
  d.onclick = function (e) {
    e.preventDefault()
    e.stopPropagation()
    delete b.m[k]
    dirty(); draw(); panel()
  }
  l.classList.add('ov')
  l.insertBefore(d, l.firstChild)
}

function pick3(t, a, f) {
  var w = document.createElement('div')
  w.id = 'ask3'
  w.innerHTML = '<span></span>'
  w.firstChild.textContent = t
  a.concat([['', 'cancel']]).forEach(function (x) {
    var b = document.createElement('button')
    b.textContent = x[1]
    b.onclick = function () { w.remove(); if (x[0]) f(x[0]) }
    w.appendChild(b)
  })
  document.body.appendChild(w)
}

function mpx(b) {
  if (b.m && b.m.w) return b.m
  var a = AU[b.id] || ps(b), o = {}
  ;['x', 'y', 'w', 'h'].forEach(function (k) {
    Object.defineProperty(o, k, {
      enumerable: true,
      get: function () { return b.m && b.m.w ? b.m[k] : a[k] },
      set: function (v) { mpos(b)[k] = v }
    })
  })
  return o
}

function mcust() {
  return all().some(function (b) { return b.m && b.m.w })
}

function pick(b, add) {
  if (add && b) {
    var i = SS.indexOf(b)
    if (i > -1) SS.splice(i, 1)
    else SS.push(b)
    sel = SS[SS.length - 1] || null
  } else {
    SS = b ? [b] : []
    sel = b
  }
  var ids = SS.map(function (x) { return x.id })
  document.querySelectorAll('.b').forEach(function (x) { x.classList.toggle('on', ids.indexOf(x.bid) > -1) })
  mgf()
  panel()
}

function elof(b) {
  var f = function (x) { return x.bid == b.id }
  return [].filter.call(cv.querySelectorAll('.b'), f)[0] || [].filter.call(pin.querySelectorAll('.b'), f)[0]
}

function step() {
  var g = pgd(s, pg()), c = cols(g), r = cv.getBoundingClientRect()
  return { c: c, w: (r.width - g.pad * 2 - g.gap * (c - 1)) / c + g.gap, h: g.row }
}

function cw() {
  return cv.clientWidth - pgd(s, pg()).pad * 2
}

function agon(b, on) {
  var el = elof(b), g = pgd(s, pg()), W = cw(), k = step()
  if (on) {
    b.fx = el.offsetLeft / W * 100
    b.fy = el.offsetTop / W * 100
    b.fw = el.offsetWidth / W * 100
    b.fh = el.offsetHeight / W * 100
    b.ag = true
  } else {
    var c = k.c
    b.w = Math.max(1, Math.min(c, Math.round((el.offsetWidth + g.gap) / k.w)))
    b.x = Math.max(0, Math.min(c - b.w, Math.round((el.offsetLeft - g.pad) / k.w)))
    b.y = Math.max(0, Math.round((el.offsetTop - g.pad) / g.row))
    b.h = Math.max(1, Math.round(el.offsetHeight / g.row))
    ;['ag', 'fx', 'fy', 'fw', 'fh'].forEach(function (x) { delete b[x] })
  }
}

function grab(e, b, d, rsz) {
  if (RO) return
  if (e.target.isContentEditable) return
  e.preventDefault()
  e.stopPropagation()
  if (document.activeElement) document.activeElement.blur()
  var tc0 = b.type == 'table' && !rsz && tat(d, e)
  if (tc0 && e.shiftKey && TS && TS.id == b.id) { tcell(b, tc0, 1); return }
  if (e.shiftKey) { pick(b, 1); return }
  if (SS.indexOf(b) < 0) pick(b)
  else if (sel != b) { sel = b; panel() }
  if (b.fix || b.lk) return
  var k = step(), c = k.c, W = cw()
  var gp = rsz ? [b] : SS.filter(function (x) { return !x.fix && !x.lk })
  var og = gp.map(function (x) { var p = ps(x); return { x: p.x, y: p.y, w: p.w, h: p.h, fx: x.fx || 0, fy: x.fy || 0, fw: x.fw || 10, fh: x.fh || 10 } })
  var gg = og.filter(function (o, i) { return !gp[i].ag })
  if (!gg.length) gg = [{ x: 0, y: 0, w: 0 }]
  var es = gp.map(elof), sx = e.clientX, sy = e.clientY, moved = false
  var lo = Math.min.apply(0, gg.map(function (o) { return -o.x }))
  var hi = Math.min.apply(0, gg.map(function (o) { return c - o.w - o.x }))
  var up = Math.min.apply(0, gg.map(function (o) { return o.y }))
  d.setPointerCapture(e.pointerId)
  var th = rsz && b.rot ? -b.rot * Math.PI / 180 : 0
  d.onpointermove = function (e) {
    var px = e.clientX - sx, py = e.clientY - sy
    if (th) {
      var rx = px * Math.cos(th) - py * Math.sin(th)
      py = px * Math.sin(th) + py * Math.cos(th)
      px = rx
    }
    var dx = Math.round(px / k.w), dy = Math.round(py / k.h)
    if (!dx && !dy && !moved && (!b.ag || Math.abs(px) + Math.abs(py) < 3)) return
    moved = true
    var ux = px / W * 100, uy = py / W * 100, mn = 4 / W * 100
    if (rsz && b.ag) {
      var o2 = og[0], ft = b.type == 'text' && !b.fm
      if (/e/.test(rsz)) b.fw = Math.max(mn, o2.fw + ux)
      if (/w/.test(rsz)) {
        b.fx = Math.min(o2.fx + o2.fw - mn, o2.fx + ux)
        b.fw = o2.fw + o2.fx - b.fx
      }
      if (!ft && /s/.test(rsz)) b.fh = Math.max(mn, o2.fh + uy)
      if (!ft && /n/.test(rsz)) {
        b.fy = Math.max(0, Math.min(o2.fy + o2.fh - mn, o2.fy + uy))
        b.fh = o2.fh + o2.fy - b.fy
      }
      lay(d, b, 1)
      tfit(d, b)
    } else if (rsz) {
      var q = MOB ? mpos(b) : b, o = og[0], fh = b.type == 'text' && !b.fm
      if (/e/.test(rsz)) q.w = Math.max(1, Math.min(c - o.x, o.w + dx))
      if (/w/.test(rsz)) {
        q.x = Math.max(0, Math.min(o.x + o.w - 1, o.x + dx))
        q.w = o.w + o.x - q.x
      }
      if (!fh && /s/.test(rsz)) q.h = Math.max(1, o.h + dy)
      if (!fh && /n/.test(rsz)) {
        q.y = Math.max(0, Math.min(o.y + o.h - 1, o.y + dy))
        q.h = o.h + o.y - q.y
      }
      lay(d, b, 1)
      tfit(d, b)
    } else {
      dx = Math.max(lo, Math.min(hi, dx))
      dy = Math.max(-up, dy)
      gp.forEach(function (x, i) {
        if (x.ag) {
          x.fx = og[i].fx + ux
          x.fy = Math.max(0, og[i].fy + uy)
        } else {
          var q = MOB ? mpos(x) : x
          q.x = og[i].x + dx
          q.y = og[i].y + dy
        }
        lay(es[i], x, 1)
      })
    }
    var p = ps(b)
    tip.style.display = 'block'
    tip.style.left = e.clientX + 14 + 'px'
    tip.style.top = e.clientY + 14 + 'px'
    tip.textContent = b.ag ? 'x ' + Math.round(b.fx * W / 100) + 'px  y ' + Math.round(b.fy * W / 100) + 'px  w ' + Math.round(b.fw * W / 100) + 'px  h ' + Math.round(d.offsetHeight) + 'px' : 'x ' + p.x + '  y ' + p.y + '  w ' + p.w + '  h ' + p.h
  }
  d.onpointerup = function () {
    d.onpointermove = d.onpointerup = null
    tip.style.display = 'none'
    if (moved) { dirty(); draw(); panel() }
    else if (tc0 && !rsz) tcell(b, tc0)
  }
}

function spin(e, b, d) {
  if (RO) return
  e.preventDefault()
  e.stopPropagation()
  if (sel != b) pick(b)
  var r = d.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, c = d.firstChild, a0 = b.rot || 0
  var st = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI, moved = false
  d.setPointerCapture(e.pointerId)
  d.onpointermove = function (e) {
    var a = a0 + Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI - st
    a = ((a + 540) % 360) - 180
    a = e.shiftKey ? Math.round(a / 15) * 15 : Math.round(a)
    ;[0, 90, -90, 180, -180].forEach(function (m) { if (Math.abs(a - m) <= 3) a = m })
    if (a == -180) a = 180
    moved = true
    if (a) b.rot = a
    else delete b.rot
    lay(d, b, 1)
    tip.style.display = 'block'
    tip.style.left = e.clientX + 14 + 'px'
    tip.style.top = e.clientY + 14 + 'px'
    tip.textContent = 'rotate ' + (b.rot || 0) + '°'
  }
  d.onpointerup = function () {
    d.onpointermove = d.onpointerup = null
    tip.style.display = 'none'
    if (moved) { dirty(); draw(); panel() }
  }
}

function nudge(dx, dy, sz) {
  var c = cols(pgd(s, pg())), u = 100 / cw()
  SS.forEach(function (b) {
    if (b.lk || (b.fix && !sz)) return
    if (b.ag) {
      if (sz) {
        b.fw = Math.max(u * 4, (b.fw || 10) + dx * u)
        b.fh = Math.max(u * 4, (b.fh || 10) + dy * u)
      } else {
        b.fx = (b.fx || 0) + dx * u
        b.fy = Math.max(0, (b.fy || 0) + dy * u)
      }
      return
    }
    var q = MOB && !b.fix ? mpos(b) : b
    if (sz) {
      q.w = Math.max(1, Math.min(c - (q.x || 0), q.w + dx))
      q.h = Math.max(1, q.h + dy)
    } else {
      q.x = Math.max(0, Math.min(c - q.w, q.x + dx))
      q.y = Math.max(0, q.y + dy)
    }
  })
  dirty(); draw(); panel()
}

function cp() {
  if (SS.length) localStorage.setItem('clip', JSON.stringify(SS))
}

function pst() {
  var a = JSON.parse(localStorage.getItem('clip') || '[]'), bl = all()
  if (!a.length) return
  var here = a.some(function (b) { return bl.some(function (x) { return x.id == b.id }) })
  SS = a.map(function (b) {
    b.id = Math.random().toString(36).slice(2, 8)
    if (here) {
      b.y += 1
      if (b.m && b.m.w) b.m.y += 1
    }
    pg().blocks.push(b)
    return b
  })
  sel = SS[SS.length - 1]
  if (here) localStorage.setItem('clip', JSON.stringify(SS))
  dirty(); draw(); panel()
}

function z0(x) { return x.z || (x.type == 'band' ? 0 : 1) }

function zst(x) { return !x.fix && !(x.type == 'band' && x.wp) }

function tofr(b) {
  var z = 1
  all().forEach(function (x) { if (x != b && zst(x)) z = Math.max(z, z0(x)) })
  b.z = z + 1
  dirty(); draw(); panel()
}

function tobk(b) {
  all().forEach(function (x) { if (x != b && zst(x)) x.z = z0(x) + 2 })
  b.z = 1
  dirty(); draw(); panel()
}

var TS = null

function tfix(b) {
  b.tc = b.tc && b.tc.length ? b.tc : [1]
  b.tr = b.tr && b.tr.length ? b.tr : [1]
  b.cells = b.cells || []
  b.tr.forEach(function (x, r) {
    b.cells[r] = b.cells[r] || []
    b.tc.forEach(function (y, c) { b.cells[r][c] = b.cells[r][c] || {} })
    b.cells[r].length = b.tc.length
  })
  b.cells.length = b.tr.length
  if (TS && TS.id == b.id) ['r0', 'r1'].concat(['c0', 'c1']).forEach(function (k) {
    TS[k] = Math.max(0, Math.min(TS[k], (k[0] == 'r' ? b.tr : b.tc).length - 1))
  })
}

function tsr() {
  return { r0: Math.min(TS.r0, TS.r1), r1: Math.max(TS.r0, TS.r1), c0: Math.min(TS.c0, TS.c1), c1: Math.max(TS.c0, TS.c1) }
}

function tcp(b) {
  var q = tsr(), cs = [], cv0 = tcov(b)
  for (var r = q.r0; r <= q.r1; r++) for (var c = q.c0; c <= q.c1; c++) if (!cv0[r + ',' + c]) cs.push(b.cells[r][c])
  return {
    cs: cs, q: q, p: new Proxy({}, {
      get: function (t, k) { return k == '__pb' ? undefined : cs[0][k] },
      set: function (t, k, v) { cs.forEach(function (x) { x[k] = v }); return true },
      deleteProperty: function (t, k) { cs.forEach(function (x) { delete x[k] }); return true }
    })
  }
}

function tins(b, ax, i) {
  var R = ax == 'r', ws = R ? b.tr : b.tc, n = R ? 'rs' : 'cs'
  ws.splice(i, 0, ws[Math.min(i, ws.length - 1)] || 1)
  b.cells.forEach(function (rw, r) {
    rw.forEach(function (x, c) {
      var at = R ? r : c
      if (at < i && at + (x[n] || 1) > i) x[n]++
    })
  })
  if (R) b.cells.splice(i, 0, b.tc.map(function () { return {} }))
  else b.cells.forEach(function (rw) { rw.splice(i, 0, {}) })
}

function tdel(b, ax, i) {
  var R = ax == 'r', ws = R ? b.tr : b.tc, n = R ? 'rs' : 'cs'
  if (ws.length < 2) return
  b.cells.forEach(function (rw, r) {
    rw.forEach(function (x, c) {
      var at = R ? r : c
      if (at < i && at + (x[n] || 1) > i) x[n]--
      if (at == i && (x[n] || 1) > 1) {
        var y = Object.assign({}, x)
        y[n]--
        if (R && b.cells[r + 1]) b.cells[r + 1][c] = y
        if (!R) rw[c + 1] = y
      }
      if (x[n] < 2) delete x[n]
    })
  })
  ws.splice(i, 1)
  if (R) b.cells.splice(i, 1)
  else b.cells.forEach(function (rw) { rw.splice(i, 1) })
  b.cells.forEach(function (rw) { rw.forEach(function (x) { if (x[n] < 2) delete x[n] }) })
}

function tgo() { dirty(); draw(); panel() }

function thook(b, d) {
  var q = TS && TS.id == b.id ? tsr() : null, g = d.querySelector('.tg')
  d.querySelectorAll('.tcl').forEach(function (el) {
    var r = +el.dataset.r, c = +el.dataset.c
    if (q && r <= q.r1 && c <= q.c1 && r + (el.tc.rs || 1) - 1 >= q.r0 && c + (el.tc.cs || 1) - 1 >= q.c0) el.classList.add('tsel')
  })
  if (!g || sel != b || SS.length > 1 || RO || (MOB && !(b.tm == 'fit' || b.tm == 'scroll'))) return
  ;[['c', b.tc], ['r', b.tr]].forEach(function (a) {
    if (a[0] == 'r' && b.ra) return
    var ws = a[1], S = ws.reduce(function (x, y) { return x + y }, 0), gp = b.tg || 0, run = 0
    ws.slice(0, -1).forEach(function (w, i) {
      run += w
      var h = document.createElement('span'), f = run / S, v = a[0] == 'c'
      h.className = 'tgh tgh' + a[0]
      h.style[v ? 'left' : 'top'] = 'calc((100% - ' + gp * (ws.length - 1) + 'px) * ' + f + ' + ' + (i + .5) * gp + 'px)'
      h.onpointerdown = function (e) {
        e.stopPropagation()
        e.preventDefault()
        h.setPointerCapture(e.pointerId)
        var s0 = v ? e.clientX : e.clientY, L = (v ? g.offsetWidth : g.offsetHeight) - gp * (ws.length - 1), a0 = ws[i], b0 = ws[i + 1], mn = S * .04
        h.onpointermove = function (e) {
          var dw = ((v ? e.clientX : e.clientY) - s0) / L * S
          dw = Math.max(mn - a0, Math.min(b0 - mn, dw))
          ws[i] = Math.round((a0 + dw) * 1000) / 1000
          ws[i + 1] = Math.round((b0 - dw) * 1000) / 1000
          g.style[v ? 'gridTemplateColumns' : 'gridTemplateRows'] = ws.map(function (x) { return 'minmax(0, ' + x + 'fr)' }).join(' ')
          var r2 = 0
          ws.slice(0, i + 1).forEach(function (x) { r2 += x })
          h.style[v ? 'left' : 'top'] = 'calc((100% - ' + gp * (ws.length - 1) + 'px) * ' + r2 / S + ' + ' + (i + .5) * gp + 'px)'
          tln(g)
        }
        h.onpointerup = function () {
          h.onpointermove = h.onpointerup = null
          tgo()
        }
      }
      g.appendChild(h)
    })
  })
}

function tat(d, e) {
  return [].filter.call(d.querySelectorAll('.tcl'), function (el) {
    var r = el.getBoundingClientRect()
    return e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY < r.bottom
  })[0]
}

function tcell(b, el, ext) {
  var r = +el.dataset.r, c = +el.dataset.c
  if (ext && TS && TS.id == b.id) {
    TS.r1 = r + (el.tc.rs || 1) - 1 >= TS.r0 ? r + (el.tc.rs || 1) - 1 : r
    TS.c1 = c + (el.tc.cs || 1) - 1 >= TS.c0 ? c + (el.tc.cs || 1) - 1 : c
  } else TS = { id: b.id, r0: r, c0: c, r1: r + (el.tc.rs || 1) - 1, c1: c + (el.tc.cs || 1) - 1 }
  draw()
  panel()
}

function tpan(B, sel) {
  tfix(B)
  hd('table')
  nt(B.tr.length + (B.tr.length == 1 ? ' row' : ' rows') + ' × ' + B.tc.length + (B.tc.length == 1 ? ' column' : ' columns') + '. click a cell to style it, shift click to pick a range, double click to type in it')
  btn('+ row', function () { tins(B, 'r', B.tr.length); tgo() })
  btn('+ column', function () { tins(B, 'c', B.tc.length); tgo() })
  btn('− row', function () { tdel(B, 'r', B.tr.length - 1); tfix(B); tgo() })
  btn('− column', function () { tdel(B, 'c', B.tc.length - 1); tfix(B); tgo() })
  btn('even columns', function () { B.tc = B.tc.map(function () { return 1 }); tgo() })
  if (!B.ra) btn('even rows', function () { B.tr = B.tr.map(function () { return 1 }); tgo() })
  nt('drag the blue lines on the canvas to make columns and rows wider or narrower')
  fld('rows fit their content', sel, 'ra', 'b')
  fld('cell padding px', sel, 'cp', 'o')
  fld('space between cells px', sel, 'tg', 'o')
  fld('cell color', sel, 'cbg', 'c')
  fld('vertical', sel, 'tva', 's', [['', 'top'], ['middle', 'middle'], ['bottom', 'bottom']])
  hd('lines')
  var sw = sel.sw || 0
  fld('thickness px', sel, 'sw', 'o')
  fld('color', sel, 'sc', 'c')
  fld('style', sel, 'ds', 's', [['', 'solid'], ['dashed', 'dashed'], ['dotted', 'dotted']])
  if (sel.ds) {
    if (sel.ds == 'dashed') {
      fld('dash length px', sel, 'dl', 'o')
      tg.lastChild.querySelector('input').placeholder = sw * 3
    }
    fld('gap px', sel, 'dg', 'o')
    tg.lastChild.querySelector('input').placeholder = sel.ds == 'dotted' ? sw * 1.5 : sw * 2
    fld('start offset px', sel, 'dof', 'o')
    if (sel.ds == 'dashed') fld('dash ends', sel, 'cap', 's', [['', 'flat'], ['round', 'round'], ['square', 'square']])
  }
  fld('outside border', sel, 'lo', 'b')
  fld('lines between rows', sel, 'lh', 'b')
  fld('lines between columns', sel, 'lv', 'b')
  hd('on phones')
  fld('layout', sel, 'tm', 's', [['', 'stack the cells'], ['fit', 'shrink to fit'], ['scroll', 'scroll sideways']])
  nt(sel.tm == 'fit' ? 'the same grid, squeezed to the phone width' : sel.tm == 'scroll' ? 'the table keeps its width and people swipe sideways' : 'each cell gets the full width, one after another, row by row')
  if (sel.tm == 'scroll') fld('table width px', sel, 'mw', 'o')
  if (!TS || TS.id != B.id) return
  var P = tcp(B), c0 = P.cs[0], one = P.cs.length == 1, q = P.q
  if (!c0) return
  hd(one ? 'cell' : P.cs.length + ' cells')
  fld('holds', P.p, 'k', 's', [['', 'text'], ['img', 'image']])
  if (c0.k == 'img') {
    btn(c0.src ? 'change photo' : 'pick photo', function () { lib(function (p) { P.cs.forEach(function (x) { x.src = p }); tgo() }) })
    fld('fit', P.p, 'fit', 's', [['', 'crop'], ['contain', 'whole image'], ['fill', 'stretch']])
    fld('focus', P.p, 'fp', 's', [['', 'center'], 'top', 'bottom', 'left', 'right'])
    fld('padding around it', P.p, 'ip', 'b')
    if (one) fld('alt', c0, 'alt', 't')
  } else {
    if (one) {
      fld('text', c0, 'html', 'ta')
      nt('or double click the cell to type')
    }
    fld('text size px', P.p, 'size', 'o')
    fld('text color', P.p, 'fg', 'c')
    fld('align', P.p, 'al', 's', ['', 'left', 'center', 'right'])
    fld('vertical', P.p, 'va', 's', [['', 'same as table'], ['top', 'top'], ['middle', 'middle'], ['bottom', 'bottom']])
  }
  fld('background', P.p, 'bg', 'c')
  fld('padding px', P.p, 'pd', 'o')
  hd(one ? 'cell lines' : 'their lines')
  nt('leave blank to follow the table')
  fld('thickness px', P.p, 'sw', 'o')
  fld('color', P.p, 'sc', 'c')
  fld('style', P.p, 'ds', 's', [['', 'same as table'], ['solid', 'solid'], ['dashed', 'dashed'], ['dotted', 'dotted']])
  ;[['t', 'top line'], ['r', 'right line'], ['b', 'bottom line'], ['l', 'left line']].forEach(function (sd) {
    var l = document.createElement('label'), i = document.createElement('input')
    l.className = 'ck'
    i.type = 'checkbox'
    i.checked = P.cs.every(function (x) { return (x.hs || '').indexOf(sd[0]) < 0 })
    i.onchange = function () {
      P.cs.forEach(function (x) {
        x.hs = (x.hs || '').replace(sd[0], '') + (i.checked ? '' : sd[0])
        if (!x.hs) delete x.hs
      })
      tgo()
    }
    l.appendChild(i)
    l.appendChild(document.createTextNode(sd[1]))
    tg.appendChild(l)
  })
  hd('arrange')
  if (q.r1 > q.r0 || q.c1 > q.c0) btn('merge cells', function () {
    var o = B.cells[q.r0][q.c0]
    for (var r = q.r0; r <= q.r1; r++) for (var c = q.c0; c <= q.c1; c++) if (r != q.r0 || c != q.c0) B.cells[r][c] = {}
    o.cs = q.c1 - q.c0 + 1
    o.rs = q.r1 - q.r0 + 1
    if (o.cs < 2) delete o.cs
    if (o.rs < 2) delete o.rs
    tgo()
  })
  if (P.cs.some(function (x) { return x.cs || x.rs })) btn('unmerge', function () { P.cs.forEach(function (x) { delete x.cs; delete x.rs }); tgo() })
  btn('+ row above', function () { tins(B, 'r', q.r0); TS.r0 += 1; TS.r1 += 1; tgo() })
  btn('+ row below', function () { tins(B, 'r', q.r1 + 1); tgo() })
  btn('+ column left', function () { tins(B, 'c', q.c0); TS.c0 += 1; TS.c1 += 1; tgo() })
  btn('+ column right', function () { tins(B, 'c', q.c1 + 1); tgo() })
  btn(q.r1 > q.r0 ? 'delete these rows' : 'delete row', function () { for (var r = q.r1; r >= q.r0; r--) tdel(B, 'r', r); tfix(B); tgo() })
  btn(q.c1 > q.c0 ? 'delete these columns' : 'delete column', function () { for (var c = q.c1; c >= q.c0; c--) tdel(B, 'c', c); tfix(B); tgo() })
  btn('empty ' + (one ? 'cell' : 'cells'), function () { P.cs.forEach(function (x) { Object.keys(x).forEach(function (k) { if (k != 'cs' && k != 'rs') delete x[k] }) }); tgo() })
  btn('done with cells', function () { TS = null; draw(); panel() })
}

function mqimg(b, p) {
  var h = tx(b.html) || tx(b.text) || ''
  delete b.text
  wr(b, 'html', h + (h ? ' ' : '') + '<img src="' + p + '" alt="">')
  dirty()
  draw()
  panel()
}

function typ(b, d, e, wd, tc) {
  if (RO) return
  var c = d.firstChild, g = document.getSelection(), mq0 = b.type == 'marquee'
  if (tc) c = tc.el
  if (mq0) {
    d.firstChild.classList.add('mqe')
    c = d.querySelector('.mqi span')
  }
  c.contentEditable = true
  c.focus()
  var rg = e && document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null
  if (rg && c.contains(rg.startContainer)) {
    g.removeAllRanges()
    g.addRange(rg)
    if (wd && rg.startContainer.nodeType == 3 && /\S/.test(rg.startContainer.data.charAt(rg.startOffset) || rg.startContainer.data.charAt(rg.startOffset - 1))) {
      g.modify('move', 'forward', 'word')
      g.modify('extend', 'backward', 'word')
    }
  } else {
    g.selectAllChildren(c)
    g.collapseToEnd()
  }
  var r = d.getBoundingClientRect()
  rt.style.display = 'flex'
  rt.style.left = Math.max(4, r.left) + 'px'
  rt.style.top = Math.max(44, r.top - 34) + 'px'
  rt.c = c
  var h0 = b.h
  c.oninput = function () { tfit(d, b) }
  c.onscroll = d.onscroll = function () {
    if (b.fm == 'lock') c.scrollTop = d.scrollTop = 0
  }
  c.onpaste = function (e) {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
  }
  rts()
  c.onblur = function () {
    if (rt.busy) return
    rt.style.display = 'none'
    rl.hidden = true
    gshut()
    c.contentEditable = false
    var k = c.cloneNode(true)
    k.querySelectorAll('a[data-at]').forEach(function (a) {
      a.setAttribute('href', a.dataset.at)
      a.removeAttribute('data-at')
    })
    k.querySelectorAll('img[data-src]').forEach(function (m) {
      m.setAttribute('src', m.dataset.src)
      m.removeAttribute('data-src')
    })
    if (tc) {
      if (k.innerHTML != tc.h0) {
        tc.save(k.innerHTML)
        dirty()
      }
      draw()
      if (sel == b) panel()
      return
    }
    if (mq0) {
      d.firstChild.classList.remove('mqe')
      if (k.innerHTML != tx(b.html)) {
        wr(b, 'html', k.innerHTML)
        dirty()
        if (sel == b) panel()
      }
      draw()
      return
    }
    if (k.innerHTML != tx(b.html) || b.h != h0) {
      wr(b, 'html', k.innerHTML)
      dirty()
      draw()
      if (sel == b) panel()
    }
  }
}

var rl = rt.querySelector('.rl'), rli = rl.querySelector('input'), rci = rt.querySelector('.rcl input'), rhi = rt.querySelector('.rhl input'), RG = null

function rkeep() {
  var g = document.getSelection()
  if (g.rangeCount && rt.c && rt.c.contains(g.getRangeAt(0).commonAncestorContainer)) RG = g.getRangeAt(0).cloneRange()
}

function rback() {
  rt.c.focus()
  if (!RG) return
  var g = document.getSelection()
  g.removeAllRanges()
  g.addRange(RG)
}

function rinfo() {
  var g = document.getSelection(), c = rt.c, o = { b: 0, i: 0, u: 0, s: 0, l: 0, a: 0, n: 0, col: '', hl: '', href: '' }
  if (!c || !g.rangeCount) return o
  var r = g.getRangeAt(0), ns = []
  if (!c.contains(r.commonAncestorContainer)) return o
  if (r.collapsed) ns = [r.startContainer]
  else {
    var w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT)
    while (w.nextNode()) {
      var x = w.currentNode
      if (!r.intersectsNode(x) || !x.data.trim()) continue
      if (x == r.startContainer && r.startOffset >= x.length) continue
      if (x == r.endContainer && r.endOffset == 0) continue
      ns.push(x)
    }
    if (!ns.length) ns = [r.startContainer]
  }
  ns.forEach(function (x) {
    var e = x.nodeType == 3 ? x.parentNode : x, cs = getComputedStyle(e), dc = '', y = e
    while (y && y != c.parentNode) {
      dc += ' ' + getComputedStyle(y).textDecorationLine
      y = y.parentNode
    }
    o.n++
    if (+cs.fontWeight >= 600) o.b++
    if (cs.fontStyle != 'normal') o.i++
    if (/underline/.test(dc)) o.u++
    if (/line-through/.test(dc)) o.s++
    if (e.closest('li') && c.contains(e.closest('li'))) o.l++
    var a = e.closest('a')
    if (a && c.contains(a)) { o.a++; o.href = o.href || a.dataset.at || a.getAttribute('href') }
    if (!o.col) o.col = cs.color
    for (var q = e; q && q != c && !o.hl; q = q.parentNode) {
      var bg = getComputedStyle(q).backgroundColor
      if (bg && bg != 'transparent' && !/rgba\(.*, 0\)$/.test(bg)) o.hl = bg
    }
  })
  return o
}

function rgbh(v) {
  var m = v.match(/\d+/g)
  return m ? '#' + m.slice(0, 3).map(function (x) { return ('0' + (+x).toString(16)).slice(-2) }).join('') : '#000000'
}

function rts() {
  if (rt.style.display == 'none') return
  var o = rinfo()
  rt.querySelectorAll('button[data-k]').forEach(function (b) { b.classList.toggle('on', o[b.dataset.k] > 0) })
  rt.querySelector('.rcl i').style.background = o.col || '#000'
  rt.querySelector('.rhl i').style.background = o.hl || 'transparent'
  rt.querySelector('.rhl').classList.toggle('on', !!o.hl)
  rkeep()
}

document.addEventListener('selectionchange', function () {
  if (rt.c && document.activeElement == rt.c) rts()
})

function rla() {
  var g = document.getSelection(), c = rt.c
  if (!g.rangeCount) return []
  var r = g.getRangeAt(0), a = (r.startContainer.nodeType == 3 ? r.startContainer.parentNode : r.startContainer).closest('a')
  var ls = [].filter.call(c.querySelectorAll('a'), function (x) { return r.intersectsNode(x) })
  if (a && c.contains(a) && ls.indexOf(a) < 0) ls.push(a)
  return ls
}

function rbare(a) {
  a.style.removeProperty('text-decoration')
  if (!a.getAttribute('style')) a.removeAttribute('style')
}

function rtog(x, k) {
  var any = rinfo()[k] > 0
  if (k == 'u') {
    if (any) {
      rla().forEach(function (a) { a.style.textDecoration = 'none' })
      for (var j = 0; j < 2 && rinfo().u > 0; j++) document.execCommand(x)
    } else {
      rla().forEach(rbare)
      var o = rinfo()
      if (o.u < o.n) document.execCommand(x)
    }
    return rts()
  }
  document.execCommand(x)
  if (any) for (var n = 0; n < 2 && rinfo()[k] > 0; n++) document.execCommand(x)
  rts()
}

function rclear() {
  var g = document.getSelection(), r0 = g.rangeCount ? g.getRangeAt(0).cloneRange() : null
  if (!r0 || r0.collapsed) g.selectAllChildren(rt.c)
  document.execCommand('removeFormat')
  rla().forEach(rbare)
  rt.c.querySelectorAll('span:not([style]), font').forEach(function (x) {
    while (x.firstChild) x.parentNode.insertBefore(x.firstChild, x)
    x.remove()
  })
  if (r0 && r0.collapsed) {
    g.removeAllRanges()
    g.collapse(rt.c, rt.c.childNodes.length)
  }
  rts()
}

function rlink() {
  var o = rinfo()
  rkeep()
  rt.busy = true
  rl.hidden = false
  rli.value = o.href || ''
  rl.querySelector('button').hidden = !o.a
  rli.focus()
  rli.select()
}

function rlend(v) {
  rl.hidden = true
  rback()
  rt.busy = false
  if (v != null) {
    if (v) {
      if (rinfo().a) document.execCommand('unlink')
      document.execCommand('createLink', false, v)
    } else document.execCommand('unlink')
  }
  rts()
}

rli.onkeydown = function (e) {
  if (e.key == 'Enter') { e.preventDefault(); rlend(rli.value.trim()) }
  if (e.key == 'Escape') { e.preventDefault(); e.stopPropagation(); rlend() }
}
rli.onblur = function () { if (!rl.hidden) setTimeout(function () { if (!rl.hidden && document.activeElement != rli) rlend() }) }

var gp = document.getElementById('gp'), gsel = gp.querySelector('select'), gq = gp.querySelector('input'), gg = gp.querySelector('.gpg'), GRC = [], GBK = ''
try { GRC = JSON.parse(localStorage.getItem('rg') || '[]') } catch (e) {}

function gcell(c) {
  var x = ('000' + c.toString(16).toUpperCase()).slice(-4)
  return '<a data-c="' + c + '" title="U+' + x + ' · ' + blk(c) + '">' + (c >= 0x300 && c <= 0x36f ? '◌' : '') + String.fromCodePoint(c).replace(/[<&]/g, function (m) { return m == '<' ? '&lt;' : '&amp;' }) + '</a>'
}

function grec() {
  gp.querySelector('.gpr').innerHTML = GRC.length ? GRC.map(gcell).join('') : '<span>nothing yet</span>'
}

function gopen() {
  var cs = getComputedStyle(rt.c), o = { font: cs.fontFamily, wt: String(parseInt(cs.fontWeight)), it: cs.fontStyle != 'normal' }
  rkeep()
  gp.hidden = false
  rt.querySelector('.rgl').classList.add('on')
  gp.querySelector('header span').textContent = prim(o.font) + ' · ' + wnm(+o.wt) + (o.it ? ' italic' : '')
  ;[gg, gp.querySelector('.gpr')].forEach(function (x) {
    x.style.fontFamily = o.font
    x.style.fontWeight = o.wt
    x.style.fontStyle = o.it ? 'italic' : ''
  })
  grec()
  if (!gp.pad) gpad(gp)
  GS0 = []
  gp.pad()
  gg.innerHTML = '<span>reading the font...</span>'
  cset(o).then(function (c) {
    var by = {}
    c.u.forEach(function (x) { (by[blk(x)] = by[blk(x)] || []).push(x) })
    gsel.innerHTML = '<option value="">entire font (' + c.u.length + ')</option>'
    BK.concat([[0, 0, 'other']]).forEach(function (b) {
      if (by[b[2]]) gsel.innerHTML += '<option value="' + b[2] + '">' + b[2] + ' (' + by[b[2]].length + ')</option>'
    })
    gsel.value = GBK
    if (gsel.value != GBK) gsel.value = GBK = ''
    function fill() {
      var v = gq.value.trim().toLowerCase(), hx0 = /^(u\+)?[0-9a-f]{2,5}$/.test(v) ? parseInt(v.replace('u+', ''), 16) : -1
      var ls = GBK ? by[GBK] || [] : c.u
      if (v) {
        var kw = ''
        for (var w in KW) if (v.length > 1 && w.indexOf(v) == 0) kw += KW[w]
        ls = ls.filter(function (x) { return x == hx0 || String.fromCodePoint(x).toLowerCase() == v || blk(x).indexOf(v) > -1 || kw.indexOf(String.fromCodePoint(x)) > -1 })
      }
      if (GM) ls = GM.filter(function (x) { return ls.indexOf(x) > -1 })
      gg.innerHTML = ls.slice(0, 1500).map(gcell).join('')
      gp.querySelector('p').textContent = (GM ? 'best matches for your drawing · ' : '') + ls.length + ' shown' + (c.ex ? '' : ' · estimated, system font') + ' · click to type it'
    }
    gsel.onchange = function () { GBK = gsel.value; fill() }
    gq.oninput = fill
    gp.fill = fill
    gp.cs = c
    gp.o = o
    GM = null
    fill()
  })
}

function gshut() {
  gp.hidden = true
  rt.querySelector('.rgl').classList.remove('on')
}

gp.onmousedown = function (e) {
  if (e.target == gq || e.target == gsel) { rkeep(); rt.busy = true }
  else e.preventDefault()
}
gp.onclick = function (e) {
  if (e.target.closest('header button')) { gshut(); rback(); return }
  var a = e.target.closest('a[data-c]')
  if (!a) return
  var c = +a.dataset.c
  if (document.activeElement != rt.c) rback()
  document.execCommand('insertText', false, String.fromCodePoint(c))
  GRC = [c].concat(GRC.filter(function (x) { return x != c })).slice(0, 16)
  try { localStorage.setItem('rg', JSON.stringify(GRC)) } catch (e2) {}
  grec()
  rts()
}
gp.addEventListener('focusin', function () { rt.busy = true })
gp.addEventListener('focusout', function () {
  setTimeout(function () {
    if (gp.contains(document.activeElement)) return
    rt.busy = false
    if (document.activeElement != rt.c) rback()
  })
})
gp.onkeydown = function (e) {
  if (e.key == 'Escape') { e.preventDefault(); e.stopPropagation(); gshut(); rback() }
}

rt.onmousedown = function (e) { if (e.target != rli) e.preventDefault() }
rt.onclick = function (e) {
  var bt = e.target.closest('button')
  if (!bt) return
  var x = bt.dataset.x
  if (x == 'unlink') return rlend('')
  if (x == 'link') return rl.hidden ? rlink() : rlend()
  if (x == 'glyphs') return gp.hidden ? gopen() : gshut()
  if (x == 'color') {
    rkeep()
    rt.busy = true
    rci.value = rgbh(rinfo().col)
    rci.oninput = function () {
      rback()
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('foreColor', false, rci.value)
      document.execCommand('styleWithCSS', false, false)
      rkeep()
      rt.querySelector('.rcl i').style.background = rci.value
    }
    rci.onclose = function () {
      setTimeout(function () {
        rt.busy = false
        if (document.activeElement != rt.c) rback()
        rts()
      })
    }
    return cpk(rci)
  }
  if (x == 'hilite') {
    rkeep()
    rt.busy = true
    var h0 = rinfo().hl
    rhi.value = h0 ? rgbh(h0) : getComputedStyle(cv).getPropertyValue('--hl').trim() || '#fff45c'
    function hl(v) {
      rback()
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('hiliteColor', false, v)
      document.execCommand('styleWithCSS', false, false)
      if (v == 'transparent') rt.c.querySelectorAll('[style*="background-color"]').forEach(function (z) {
        if (/transparent|rgba\(0, 0, 0, 0\)/.test(z.style.backgroundColor)) z.style.removeProperty('background-color')
        if (!z.getAttribute('style')) z.removeAttribute('style')
        if (z.tagName == 'SPAN' && !z.attributes.length) {
          while (z.firstChild) z.parentNode.insertBefore(z.firstChild, z)
          z.remove()
        }
      })
      rkeep()
      rts()
    }
    rhi.oninput = function () { hl(rhi.value) }
    rhi.onclose = function () {
      setTimeout(function () {
        rt.busy = false
        if (document.activeElement != rt.c) rback()
        rts()
      })
    }
    cpk(rhi)
    if (!h0) hl(rhi.value)
    var nx = document.createElement('a')
    nx.className = 'all'
    nx.textContent = 'no highlight'
    nx.onclick = function () { hl('transparent'); cpx() }
    CP.w.appendChild(nx)
    return
  }
  if (x == 'removeFormat') return rclear()
  if (bt.dataset.k) return rtog(x, bt.dataset.k)
  document.execCommand(x)
  rts()
}

var df = {
  text: { w: 4, h: 1, html: 'text' },
  image: { w: 4, h: 10, src: '' },
  marquee: { w: 12, h: 3, html: 'ñ press', speed: 20 },
  nav: { w: 3, h: 10, items: [{ t: 'link', href: '#' }, { t: 'link', href: '#' }, { t: 'link', href: '#' }] },
  tabs: { w: 9, h: 3, items: [{ t: 'prints', href: '#prints' }, { t: 'zines', href: '#zines' }], flt: 'Filter by' },
  cards: { w: 9, h: 30, cols: 3, per: 9, items: [{ t: 'item', price: '$20', tag: 'prints' }, { t: 'item', price: '$10', tag: 'zines' }, { t: 'item', price: '$15', was: '$20', badge: 'SALE!', tag: 'prints' }] },
  banner: { w: 9, h: 10, src: '', html: 'ñ press', bg: '#f4c6d8' },
  button: { w: 3, h: 3, t: 'button', bg: '#e8382c', fg: '#ffffff' },
  lang: { w: 2, h: 1 },
  gallery: { w: 9, h: 17, mode: 'grid', cols: 3, zoom: true, items: [] },
  video: { w: 6, h: 13, src: '' },
  embed: { w: 6, h: 13, code: '' },
  join: { w: 6, h: 6, bt: { es: 'unirme', en: 'join' }, note: { es: 'te escribimos unas pocas veces al mes. puedes salirte cuando quieras.', en: 'we write a few times a month. leave anytime.' }, ok: { es: '¡gracias! ya estás en la lista.', en: 'thanks! you are on the list.' } },
  table: { w: 8, h: 12, tc: [1, 1, 1], tr: [1, 1, 1], cells: [[{ html: 'one' }, { html: 'two' }, { html: 'three' }], [{}, {}, {}], [{}, {}, {}]], sw: 1, sc: '#111111', lo: true, lh: true, lv: true, cp: 10 },
  events: { w: 8, h: 30, n: 5, loc: true, dsc: true, pic: true, add: true },
  band: { w: 12, h: 10, bg: '#fff45c', ly: [] },
  shape: { w: 3, h: 6, sh: 'rect', fill: '#e8382c', sw: 0, sc: '#111111' }
}

function add(t) {
  if (RO) return
  var y = 0
  all().forEach(function (b) { y = Math.max(y, b.y + b.h) })
  var b = JSON.parse(JSON.stringify(df[t]))
  b.id = Math.random().toString(36).slice(2, 8)
  b.type = t
  if (t == 'text' && s.styles['body copy']) b.sty = 'body copy'
  if (t == 'band') b.w = pgd(s, pg()).cols
  b.x = 0
  b.y = y
  if (MOB) {
    var my = 0
    all().forEach(function (x) { if (!hid(x) && !x.fix) { var q = ps(x); my = Math.max(my, q.y + q.h) } })
    b.on = 'p'
    b.m = { x: 0, y: my, w: s.grid.mc || 4, h: b.h }
  } else if (pg().mi) b.on = 'd'
  pg().blocks.push(b)
  sel = b
  dirty()
  draw()
  panel()
}

function del(go) {
  if (!SS.length) return
  var both = SS.filter(function (b) { return !b.on && !b.fix })
  if (go !== 1 && both.length) return pick3((SS.length > 1 ? 'remove these ' + SS.length + ' blocks' : 'remove this block') + ' from', [[MOB ? 'p' : 'd', MOB ? 'the phone only' : 'desktop only'], ['all', 'phone and desktop']], function (v) {
    if (v == 'all') return del(1)
    both.forEach(function (b) { b.on = v == 'p' ? 'd' : 'p' })
    SS = SS.filter(function (b) { return both.indexOf(b) < 0 })
    if (SS.length) return del(1)
    sel = null
    dirty(); draw(); panel()
  })
  SS.forEach(function (b) {
    var bl = arr(b)
    bl.splice(bl.indexOf(b), 1)
  })
  SS = []
  sel = null
  dirty()
  draw()
  panel()
}

var tg = pn

function hd(t) {
  var h = document.createElement('h4')
  h.textContent = t
  tg.appendChild(h)
}

function nt(t) {
  var d = document.createElement('div')
  d.className = 'nt'
  d.textContent = t
  tg.appendChild(d)
}

var FF = [
  ['ñ press', [
    ['Degular', '"Degular", Helvetica, Arial, sans-serif', [100, 300, 400, 500, 600, 700, 900], 14],
    ['Degular Display', '"Degular Display", Helvetica, Arial, sans-serif', [100, 300, 400], 5],
    ['Degular Mono', '"Degular Mono", Menlo, monospace', [100, 300, 400, 500, 600], 10],
    ['Sofia Pro', '"Sofia Pro", Helvetica, Arial, sans-serif', [100, 200, 300, 400, 500, 600, 700, 900], 16]
  ]],
  ['sans serif', [
    ['Helvetica', 'Helvetica, Arial, sans-serif'],
    ['Helvetica Neue', '"Helvetica Neue", Helvetica, Arial, sans-serif'],
    ['Arial', 'Arial, Helvetica, sans-serif'],
    ['Arial Black', '"Arial Black", Arial, sans-serif'],
    ['Avenir', 'Avenir, "Avenir Next", Helvetica, sans-serif'],
    ['Futura', 'Futura, "Century Gothic", sans-serif'],
    ['Gill Sans', '"Gill Sans", "Gill Sans MT", sans-serif'],
    ['Optima', 'Optima, Candara, sans-serif'],
    ['Trebuchet', '"Trebuchet MS", sans-serif'],
    ['Verdana', 'Verdana, Geneva, sans-serif'],
    ['Tahoma', 'Tahoma, Verdana, sans-serif'],
    ['System', 'system-ui, sans-serif']
  ]],
  ['serif', [
    ['Georgia', 'Georgia, serif'],
    ['Times', '"Times New Roman", Times, serif'],
    ['Baskerville', 'Baskerville, "Baskerville Old Face", serif'],
    ['Didot', 'Didot, "Bodoni MT", serif'],
    ['Garamond', 'Garamond, "EB Garamond", serif'],
    ['Hoefler Text', '"Hoefler Text", Georgia, serif'],
    ['Palatino', 'Palatino, "Palatino Linotype", serif'],
    ['Cochin', 'Cochin, Georgia, serif']
  ]],
  ['mono', [
    ['Courier', '"Courier New", Courier, monospace'],
    ['Menlo', 'Menlo, Consolas, monospace'],
    ['Monaco', 'Monaco, Menlo, monospace'],
    ['Andale Mono', '"Andale Mono", monospace']
  ]],
  ['display', [
    ['Impact', 'Impact, "Arial Black", sans-serif'],
    ['Copperplate', 'Copperplate, "Copperplate Gothic Light", serif'],
    ['Brush Script', '"Brush Script MT", cursive'],
    ['Comic Sans', '"Comic Sans MS", cursive']
  ]]
]

function fam(v) {
  var r = null
  FF.forEach(function (g) { g[1].forEach(function (f) { if (f[1] == v) r = f }) })
  return r
}

function fpk(t, o) {
  var l = document.createElement('label'), b = document.createElement('button'), f = fam(o.font)
  l.textContent = t
  b.className = 'fpb'
  b.type = 'button'
  b.textContent = f ? f[0] : o.font ? o.font.split(',')[0].replace(/"/g, '') : 'default'
  if (o.font) b.style.fontFamily = o.font
  b.onclick = function (e) {
    e.preventDefault()
    var k = document.getElementById('fpk')
    if (k) { k.remove(); if (k.bt == b) return }
    k = document.createElement('div')
    k.id = 'fpk'
    k.bt = b
    var q = document.createElement('input'), ls = document.createElement('div')
    q.placeholder = 'find a font'
    k.appendChild(q)
    k.appendChild(ls)
    function pick(v) {
      if (v) o.font = v
      else delete o.font
      if (o.wt && fam(v) && fam(v)[2] && fam(v)[2].indexOf(+o.wt) < 0) delete o.wt
      k.remove()
      dirty(); draw(); panel()
      if (LB) lrd(1)
    }
    function row(nm, v, mt) {
      var r = document.createElement('a')
      r.className = 'fr' + ((o.font || '') == v ? ' on' : '')
      r.innerHTML = '<span></span><i></i>'
      r.firstChild.textContent = nm
      r.firstChild.style.fontFamily = v || 'inherit'
      r.lastChild.textContent = mt || ''
      r.onclick = function () { pick(v) }
      r.nm = nm.toLowerCase()
      return r
    }
    ls.appendChild(row('default', '', 'site font'))
    FF.forEach(function (g) {
      var h = document.createElement('h5')
      h.textContent = g[0]
      ls.appendChild(h)
      g[1].forEach(function (f) { ls.appendChild(row(f[0], f[1], f[3] ? f[3] + ' styles' : '')) })
    })
    q.oninput = function () {
      var v = q.value.toLowerCase()
      ls.querySelectorAll('.fr').forEach(function (r) { r.hidden = v && r.nm.indexOf(v) < 0 })
      ls.querySelectorAll('h5').forEach(function (h) {
        var n = h.nextElementSibling, on = false
        while (n && n.tagName != 'H5') { if (!n.hidden) on = true; n = n.nextElementSibling }
        h.hidden = !on
      })
    }
    q.onkeydown = function (e) {
      if (e.key == 'Escape') k.remove()
      if (e.key == 'Enter') {
        var r = [].filter.call(ls.querySelectorAll('.fr'), function (x) { return !x.hidden })[0]
        if (r) r.click()
      }
    }
    document.body.appendChild(k)
    var r = b.getBoundingClientRect()
    k.style.top = Math.min(r.bottom + 4, innerHeight - k.offsetHeight - 10) + 'px'
    k.style.right = (innerWidth - r.right) + 'px'
    var on = ls.querySelector('.on')
    if (on) ls.scrollTop = on.offsetTop - ls.offsetTop - 120
    q.focus()
    setTimeout(function () {
      document.addEventListener('pointerdown', function x(e) {
        if (k.contains(e.target) || e.target == b) return
        k.remove()
        document.removeEventListener('pointerdown', x)
      })
    })
  }
  l.appendChild(b)
  tg.appendChild(l)
}

function fld(t, o, k, kd, lo) {
  if (k == 'font') return fpk(t, o)
  var l = document.createElement('label'), tr = kd == 't' || kd == 'ta', i
  if (kd == 's') {
    i = document.createElement('select')
    lo.forEach(function (v) {
      var op = document.createElement('option')
      op.value = typeof v == 'object' ? v[0] : v
      op.textContent = typeof v == 'object' ? v[1] : v || '-'
      i.appendChild(op)
    })
  } else i = document.createElement(kd == 'a' || kd == 'ta' ? 'textarea' : 'input')
  l.textContent = t + (tr && LS.length > 1 ? ' (' + L + ')' : '')
  if (kd == 'n' || kd == 'o') {
    i.type = 'number'
    i.step = 'any'
  }
  if (kd == 'c') i.type = 'color'
  if (kd == 'b') {
    i.type = 'checkbox'
    l.className = 'ck'
    i.checked = !!o[k]
  }
  if (kd == 'a' || kd == 'ta') l.className = 'tall'
  if (k == 'href') i.setAttribute('list', 'pl')
  if (tr) {
    i.value = rv(o[k])
    if (L != LS[0]) i.placeholder = tx(o[k])
  } else if (kd != 'b') i.value = o[k] == null ? (kd == 'c' ? '#ffffff' : '') : o[k]
  if (kd == 'c') i.oninput = function () { o[k] = i.value; dirty(); draw() }
  i.onchange = function () {
    if (tr) wr(o, k, i.value)
    else if (kd == 'b') {
      if (i.checked) o[k] = true
      else if (o.__pb) o[k] = false
      else delete o[k]
    } else if (kd == 'n') o[k] = i.value = Math.max(lo || 0, parseInt(i.value) || 0)
    else if (i.value === '') delete o[k]
    else if (kd == 'o') o[k] = parseFloat(i.value)
    else o[k] = i.value
    dirty()
    draw()
    if (o == pg() && k == 'title') tbr()
    if (kd == 'c' || kd == 'b') panel()
  }
  if (kd == 'b') {
    l.textContent = ''
    l.appendChild(i)
    l.appendChild(document.createTextNode(t))
  } else l.appendChild(i)
  if (kd == 'c') {
    var w = document.createElement('span'), x = document.createElement('a')
    w.className = 'cw'
    x.textContent = o[k] ? '×' : 'none'
    x.onclick = function (e) {
      e.preventDefault()
      if (o[k] == null) return
      delete o[k]
      dirty(); draw(); panel()
    }
    if (o[k] == null) i.classList.add('un')
    w.appendChild(x)
    w.appendChild(i)
    l.appendChild(w)
  }
  if (k == 'src' || k == 'img' || k == 'poster' || k == 'bgi' || k == 'icon' || k == 'di') {
    var pk = document.createElement('a')
    pk.className = 'pk'
    pk.textContent = 'pick'
    pk.onclick = function (e) {
      e.preventDefault()
      lib(function (p) {
        o[k] = p
        dirty(); draw(); panel()
      })
    }
    l.insertBefore(pk, i)
  }
  if (o && o.__pb) pdot(l, o.__pb, k)
  tg.appendChild(l)
}

function btn(t, f, c) {
  var x = document.createElement('button')
  x.textContent = t
  x.className = c || 'pb'
  x.onclick = f
  pn.appendChild(x)
}

function slg(v) {
  v = v.toLowerCase().replace(/[^a-z0-9ñ-]+/g, '-').replace(/^-+|-+$/g, '') || 'page'
  if (['photos', 'assets', 'up', 'mastermind', '404', 'site'].indexOf(v) > -1) v += '-page'
  var n = v, k = 2
  while (s.pages.some(function (p) { return p != pg() && p.slug == n })) n = v + '-' + k++
  return n
}

function relink(a, b, o) {
  o = o || s
  for (var k in o) {
    if (o[k] && typeof o[k] == 'object') relink(a, b, o[k])
    else if (k == 'href' && o[k] == '@' + a) o[k] = '@' + b
  }
}

function newpg(src) {
  var p = src ? JSON.parse(JSON.stringify(src)) : { title: 'page', blocks: [] }
  p.id = Math.random().toString(36).slice(2, 8)
  p.blocks.forEach(function (b) { b.id = Math.random().toString(36).slice(2, 8) })
  s.pages.push(p)
  pi = s.pages.length - 1
  p.slug = slg(src ? (src.slug || 'home') + '-copy' : 'page')
  sel = null
  dirty()
  setup()
}

function odot(l, po, k) {
  var d = document.createElement('b'), on = po[k] != null && po[k] !== ''
  d.className = 'od' + (on ? ' on' : '')
  if (on) {
    d.title = 'different from global, click to reset'
    d.onclick = function (e) {
      e.preventDefault()
      e.stopPropagation()
      delete po[k]
      dirty(); draw(); panel()
    }
  }
  l.classList.add('ov')
  l.insertBefore(d, l.firstChild)
}

function ovf(t, po, k, go, kd) {
  var l = document.createElement('label'), i = document.createElement('input'), on = po[k] != null && po[k] !== '', gv = go[k]
  l.textContent = t
  if (kd == 'c') {
    i.type = 'color'
    i.value = (on ? po[k] : gv || '#ffffff').slice(0, 7)
    if (!on && !gv) i.classList.add('un')
  } else {
    i.type = 'number'
    i.step = 'any'
    i.value = on ? po[k] : gv
  }
  function put(fin) {
    var v = kd == 'c' ? i.value : Math.max(kd || 0, parseFloat(i.value) || 0)
    if (kd != 'c' && i.value === '') v = gv
    if (v == gv) delete po[k]
    else po[k] = v
    dirty()
    draw()
    if (fin) panel()
  }
  i.oninput = function () { if (kd == 'c') put() }
  i.onchange = function () { put(1) }
  l.appendChild(i)
  odot(l, po, k)
  tg.appendChild(l)
}

function pgpanel() {
  var p = pg()
  hd('page')
  fld('title', p, 'title', 't')
  if (pi) {
    var l = document.createElement('label'), i = document.createElement('input')
    l.textContent = 'address /'
    i.value = p.slug
    i.onchange = function () {
      var o = p.slug
      p.slug = i.value = slg(i.value)
      relink(o, p.slug)
      CUR = p.slug
      dirty()
      tbr()
    }
    l.appendChild(i)
    pn.appendChild(l)
  } else nt('home page, lives at /')
  p.g = p.g || {}
  hd('grid')
  ovf('columns', p.g, 'cols', s.grid, 1)
  ovf('column gap', p.g, 'gap', s.grid, 0)
  ovf('padding', p.g, 'pad', s.grid, 0)
  ovf('phone columns', p.g, 'mc', s.grid, 1)
  hd('phone layout')
  var ml = document.createElement('label'), ms = document.createElement('select')
  ml.textContent = 'phone layout'
  ms.innerHTML = '<option value="">follows desktop</option><option value="i">independent</option>'
  ms.value = p.mi ? 'i' : ''
  ms.onchange = function () {
    if (ms.value) {
      p.mi = true
      var m0 = MOB
      MOB = true
      auto(all(), pgd(s, p))
      all().forEach(function (b) { if (!b.fix && !b.ag && b.on != 'd') mpos(b) })
      MOB = m0
    } else delete p.mi
    dirty(); draw(); panel()
  }
  ml.appendChild(ms)
  pn.appendChild(ml)
  nt(p.mi ? 'desktop changes never move anything on phones. new desktop blocks start as desktop only' : 'the phone version is rebuilt from desktop. blocks you move or change on the phone stay unlinked')
  var nu = all().filter(function (b) { return b.m && Object.keys(b.m).some(function (k) { return k != 'hide' }) }).length
  if (nu || p.mi) btn('rebuild the phone version from desktop' + (nu ? ' (' + nu + ' unlinked)' : ''), function () {
    if (!confirm('relink every block on this page to desktop? phone only blocks are kept, their spots are rebuilt')) return
    all().forEach(function (b) { if (b.on == 'p') { var k = b.m; delete b.m; b.m = k ? { x: k.x, y: k.y, w: k.w, h: k.h } : undefined; if (!b.m) delete b.m } else delete b.m })
    delete p.mi
    dirty(); draw(); panel()
  })
  hd('length')
  ovf('page length, rows', p, 'len', s.grid, 0)
  tg.lastChild.querySelector('input').placeholder = 'auto'
  nt('blank follows global. 0 ends the page right after the last block. or drag the page end line on the canvas')
  hd('background')
  nt('backgrounds are bands now. add one from + add, or start with a band that covers this whole page')
  btn('+ page background band', function () {
    add('band')
    sel.wp = true
    sel.bg = s.base.bg || '#ffffff'
    dirty(); draw(); panel()
  })
  hd('colors')
  ovf('text color', p, 'fg', s.base, 'c')
  ovf('highlight', p, 'hl', s.base, 'c')
  ovf('lines', p, 'ln', s.base, 'c')
  nt('a yellow dot means this page differs from global. click it to go back')
  hd('pages')
  btn('+ new page', function () { newpg() })
  btn('duplicate', function () { newpg(p) })
  if (pi) btn('delete page', function () {
    if (!confirm('delete page /' + p.slug + '?')) return
    s.pages.splice(pi, 1)
    pi = 0
    sel = null
    dirty()
    setup()
  })
  var lk = all().filter(function (b) { return b.lk })
  hd('locked')
  btn('unlock all on page' + (lk.length ? ' (' + lk.length + ')' : ''), function () {
    lk.forEach(function (b) { delete b.lk })
    dirty(); draw(); panel()
  })
  pn.lastChild.disabled = !lk.length
  nt(lk.length ? 'blocks marked on every page unlock on every page' : 'nothing is locked on this page')
}

function lst(t, o, k, fs) {
  hd(t)
  var a = o[k] = o[k] || []
  a.forEach(function (it, n) {
    var bx = document.createElement('div'), nv = document.createElement('nav')
    bx.className = 'it'
    nv.innerHTML = '<button>↑</button><button>×</button>'
    nv.children[0].onclick = function () {
      if (!n) return
      a.splice(n - 1, 0, a.splice(n, 1)[0])
      dirty(); draw(); panel()
    }
    nv.children[1].onclick = function () {
      a.splice(n, 1)
      dirty(); draw(); panel()
    }
    bx.appendChild(nv)
    tg = bx
    fs.forEach(function (f) { fld(f[1], it, f[0], f[2]) })
    tg = pn
    pn.appendChild(bx)
  })
  var p = document.createElement('button')
  p.className = 'pl'
  p.textContent = '+ add'
  p.onclick = function () {
    a.push(JSON.parse(JSON.stringify(a[a.length - 1] || {})))
    dirty(); draw(); panel()
  }
  pn.appendChild(p)
}

var WT = ['', ['100', 'thin'], ['200', 'extra light'], ['300', 'light'], ['400', 'regular'], ['500', 'medium'], ['600', 'semibold'], ['700', 'bold'], ['800', 'extra bold'], ['900', 'black']]

function tsty(o, all) {
  if (all) fld('text style', o, 'sty', 's', [''].concat(Object.keys(s.styles)))
  if (all && o.sty) {
    var la = document.createElement('a')
    la.className = 'tlk'
    la.textContent = 'open ' + o.sty + ' in the type lab'
    la.onclick = function () { lab(o.sty) }
    tg.appendChild(la)
  }
  var y = all && (ST[o.sty] || (all && !o.sty ? sb(s) : null))
  if (all && y) nt('these follow ' + (o.sty || 'the site font') + '. a yellow dot means this block is different, click it to go back')
  function ov(k) {
    if (!y) return
    var l = tg.lastChild, i = l.querySelector('input:not([type=checkbox]), select')
    if (i && y[k] != null && o[k] == null && i.type != 'color' && i.tagName == 'INPUT') i.placeholder = y[k]
    if (i && i.type != 'color') {
      var f0 = i.onchange
      i.onchange = function () { f0.call(i); panel() }
    }
    odot(l, o, k)
  }
  fld('font', o, 'font')
  ov('font')
  fld('size', o, 'size', 'o')
  ov('size')
  var f = fam(o.font || (ST[o.sty] || {}).font || sb(s).font)
  fld('weight', o, 'wt', 's', f && f[2] ? WT.filter(function (w) { return !w || f[2].indexOf(+w[0]) > -1 }) : WT)
  ov('wt')
  fld('line height', o, 'lh', 'o')
  ov('lh')
  fld('letter spacing', o, 'ls', 'o')
  ov('ls')
  fld('italic', o, 'it', 'b')
  ov('it')
  fld('underline', o, 'un', 'b')
  ov('un')
  fld('uppercase', o, 'up', 'b')
  ov('up')
  fld('hyphenate', o, 'hy', 'b')
  ov('hy')
  fld('text color', o, 'fg', 'c')
  ov('fg')
}

function stl(b, t) {
  hd('style')
  tsty(b, 1)
  fld('align', b, 'al', 's', ['', 'left', 'center', 'right'])
  if (t == 'text' || t == 'button') fld('vertical', b, 'va', 's', ['', 'top', 'middle', 'bottom'])
  if (t != 'image') fld('background', b, 'bg', 'c')
  fld('padding', b, 'pd', 'o')
  fld('border', b, 'bw', 'o')
  fld('border color', b, 'bc', 'c')
  fld('corners', b, 'rd', 'o')
  fld('opacity %', b, 'op', 'o')
  fld('rotate', b, 'rot', 'o')
}

function nm(b) {
  var v = tx(b.html) || tx(b.text) || tx(b.t) || (b.items && b.items[0] && tx(b.items[0].t)) || (b.src || '').split('/').pop()
  return String(v).replace(/<[^>]+>/g, ' ').trim().slice(0, 26)
}

var PT = 'page', LO = false, LC = false, LF = '', SFO = false
try {
  PT = localStorage.getItem('pt') || 'page'
  LO = localStorage.getItem('lo') == '1'
  LC = localStorage.getItem('lc') == '1'
} catch (e) {}

var TN = [['band', 'band'], ['shape', 'shape'], ['text', 'text'], ['image', 'image'], ['marquee', 'marquee'], ['nav', 'menu'], ['tabs', 'tabs'], ['cards', 'cards'], ['banner', 'banner'], ['button', 'button'], ['lang', 'language switch'], ['gallery', 'gallery'], ['video', 'video'], ['embed', 'embed'], ['events', 'events'], ['join', 'mailing list'], ['table', 'table']]

function hx(v) {
  v = v.toLowerCase()
  if (v.length == 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
  if (v.length == 9 && v.slice(7) == 'ff') v = v.slice(0, 7)
  return v
}

function walkc(o, out) {
  for (var k in o) {
    var v = o[k]
    if (typeof v == 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) out.push([o, k])
    else if (v && typeof v == 'object' && k != 'm') walkc(v, out)
  }
}

function pal(t, bl, p) {
  var rf = [], by = {}, ks = []
  bl.forEach(function (b) {
    walkc(b, rf)
    if (b.sty && s.styles[b.sty]) walkc(s.styles[b.sty], rf)
  })
  if (p) ['bg', 'fg', 'hl', 'ln'].forEach(function (k) { if (p[k]) rf.push([p, k]) })
  rf.forEach(function (r) {
    var v = hx(r[0][r[1]])
    if (!by[v]) { by[v] = []; ks.push(v) }
    if (by[v].every(function (x) { return x[0] != r[0] || x[1] != r[1] })) by[v].push(r)
  })
  ks.sort(function (a, b) { return by[b].length - by[a].length })
  var h = document.createElement('h4')
  h.className = 'dd' + (LC ? ' op' : '')
  h.textContent = t + ' (' + ks.length + ')'
  h.onclick = function () {
    LC = !LC
    try { localStorage.setItem('lc', LC ? '1' : '0') } catch (e) {}
    panel()
  }
  pn.appendChild(h)
  if (!LC) return
  if (!ks.length) return nt('no colors set here yet')
  ks.forEach(function (v) {
    var rs = by[v], cur = v, w = document.createElement('div'), sw = document.createElement('label'), ci = document.createElement('input'), tx0 = document.createElement('input'), op = document.createElement('input')
    w.className = 'scr'
    w.title = 'used ' + rs.length + (rs.length == 1 ? ' time' : ' times')
    sw.className = 'sw'
    ci.type = 'color'
    op.type = 'number'
    op.min = 0
    op.max = 100
    function al() { return cur.length == 9 ? cur.slice(7) : '' }
    function show() {
      sw.style.setProperty('--c', cur)
      ci.value = cur.slice(0, 7)
      tx0.value = cur.slice(1, 7).toUpperCase()
      op.value = Math.round((cur.length == 9 ? parseInt(cur.slice(7), 16) : 255) / 255 * 100)
    }
    function set(nv) {
      cur = hx(nv)
      rs.forEach(function (r) { r[0][r[1]] = cur })
      show()
      dirty()
      draw()
    }
    ci.oninput = function () { set(ci.value + al()) }
    ci.onchange = function () { panel() }
    tx0.onchange = function () {
      var x = tx0.value.replace('#', '').trim()
      if (/^[0-9a-f]{3}$/i.test(x)) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2]
      if (!/^[0-9a-f]{6}$/i.test(x)) return show()
      set('#' + x + al())
      panel()
    }
    op.onchange = function () {
      var a = Math.max(0, Math.min(100, +op.value || 0))
      set(cur.slice(0, 7) + (a == 100 ? '' : ('0' + Math.round(a / 100 * 255).toString(16)).slice(-2)))
      panel()
    }
    sw.appendChild(ci)
    w.appendChild(sw)
    w.appendChild(tx0)
    w.appendChild(op)
    w.appendChild(document.createElement('i')).textContent = '%'
    show()
    pn.appendChild(w)
  })
}

function layers() {
  var all0 = all(), h = document.createElement('h4')
  h.className = 'dd' + (LO ? ' op' : '')
  h.textContent = 'active elements (' + all0.length + ')'
  h.onclick = function () {
    LO = !LO
    try { localStorage.setItem('lo', LO ? '1' : '0') } catch (e) {}
    panel()
  }
  pn.appendChild(h)
  if (!LO) return
  var f = document.createElement('select')
  f.className = 'lf'
  f.innerHTML = '<option value="">all elements (' + all0.length + ')</option>'
  TN.forEach(function (x) {
    var n = all0.filter(function (b) { return b.type == x[0] }).length, o = document.createElement('option')
    o.value = x[0]
    o.textContent = x[1] + ' (' + n + ')'
    if (!n) o.style.color = '#aaa'
    f.appendChild(o)
  })
  f.value = LF
  f.onchange = function () { LF = f.value; panel() }
  pn.appendChild(f)
  var bl = all0.filter(function (b) { return !LF || b.type == LF }).sort(function (a, b) { return (b.z || (b.fix ? 30 : 1)) - (a.z || (a.fix ? 30 : 1)) })
  if (!all0.length) nt('nothing yet, use + add or drop photos on the page')
  else if (!bl.length) nt('none of these on this page')
  bl.forEach(function (b) {
    var r = document.createElement('div')
    r.className = 'ly' + (s.common.indexOf(b) > -1 ? ' sh' : '') + (b.lk ? ' lk' : '')
    r.innerHTML = '<b></b><span></span><a title="' + (b.lk ? 'unlock' : 'lock so it can not be clicked on the canvas') + '">' + (b.lk ? '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>' : '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>') + '</a>'
    r.children[0].textContent = (b.type == 'nav' ? 'menu' : b.type) + (b.ag ? ' ✕' : '')
    r.children[1].textContent = (OV[b.id] ? '! ' : '') + nm(b)
    var bg = b.on == 'd' ? 'desktop' : b.on == 'p' ? 'phone' : MOB && b.m && Object.keys(b.m).length ? 'unlinked' : ''
    if (bg) r.children[1].insertAdjacentHTML('afterbegin', '<i class="lbg ' + bg + '">' + bg + '</i>')
    r.children[2].onclick = function (e) {
      e.stopPropagation()
      if (b.lk) delete b.lk
      else b.lk = true
      dirty(); draw(); panel()
    }
    r.onclick = function (e) { pick(b, e.shiftKey) }
    pn.appendChild(r)
  })
}

function lists() {
  var dl = document.createElement('datalist')
  dl.id = 'pl'
  s.pages.forEach(function (p) {
    var o = document.createElement('option')
    o.value = '@' + (p.slug || '')
    o.textContent = tx(p.title)
    dl.appendChild(o)
  })
  pn.appendChild(dl)
}

function everypg() {
  hd('global')
  nt('changes here reach every page. a page can still change its own copy in the page tab')
  hd('site font')
  var cur = s.styles[s.base.sty] ? s.base.sty : 'body copy'
  if (s.styles[cur]) scard(cur, 1, function () { SFO = !SFO; panel() }, 1)
  pn.lastChild.classList.add('dd0')
  pn.lastChild.classList.toggle('op', SFO)
  if (SFO) Object.keys(s.styles).forEach(function (n) {
    if (n == cur) return
    scard(n, 0, function () {
      if (n == 'body copy') delete s.base.sty
      else s.base.sty = n
      SFO = false
      dirty(); draw(); panel()
    })
    pn.lastChild.classList.add('dd1')
  })
  hd('grid')
  fld('columns', s.grid, 'cols', 'n', 1)
  fld('baseline', s.grid, 'row', 'n', 4)
  nt('one grid row = one line of text. 24 fits 18px type')
  fld('column gap', s.grid, 'gap', 'n')
  fld('padding', s.grid, 'pad', 'n')
  fld('phone columns', s.grid, 'mc', 'n', 1)
  fld('page length, rows', s.grid, 'len', 'o')
  tg.lastChild.querySelector('input').placeholder = 'auto'
  nt('blank ends each page after its last block. a page can change this in the page tab')
  hd('colors')
  fld('text color', s.base, 'fg', 'c')
  fld('highlight', s.base, 'hl', 'c')
  fld('lines', s.base, 'ln', 'c')
  hd('languages')
  var l2 = document.createElement('label'), i2 = document.createElement('input')
  l2.textContent = 'languages'
  i2.value = LS.join(', ')
  i2.onchange = function () {
    var v = i2.value.toLowerCase().split(/[\s,]+/).filter(Boolean)
    if (!v.length) v = ['es']
    s.langs = v
    dirty()
    setup()
  }
  l2.appendChild(i2)
  tg.appendChild(l2)
  nt('first one is the default. es, en')
}

var SU = null

function csvq(v) {
  v = String(v == null ? '' : v)
  if (/^[=+\-@\t\r]/.test(v)) v = "'" + v
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v
}

function listpanel() {
  btn('← back to dev', function () { PT = 'dev'; panel() })
  hd('mailing list')
  if (!TM) return nt('signups are saved online. open the editor on the live site to see them')
  if (!SU) {
    nt('loading...')
    fetch('api/subs').then(function (r) { return r.ok ? r.json() : [] }).then(function (j) {
      SU = j
      if (!sel && PT == 'list') panel()
    })
    return
  }
  var c = {}
  SU.forEach(function (x) { c[x.st] = (c[x.st] || 0) + 1 })
  nt(SU.length + (SU.length == 1 ? ' person' : ' people') + ' signed up' + (c.unsub ? ', ' + c.unsub + ' left the list' : ''))
  if (c.pending) nt(c.pending + ' not confirmed yet. once sending is set up they get a confirm email first')
  btn('download as a spreadsheet (csv)', function () {
    var rows = [['email', 'name', 'language', 'from', 'status', 'signed up', 'confirmed', 'left', 'what they agreed to']].concat(SU.map(function (x) {
      var d = function (t) { return t ? new Date(t).toISOString().slice(0, 16).replace('T', ' ') : '' }
      return [x.em, x.nm, x.lg, x.src, x.st, d(x.at), d(x.cf), d(x.un), x.ct]
    }))
    var a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([rows.map(function (r) { return r.map(csvq).join(',') }).join('\r\n')], { type: 'text/csv' }))
    a.download = 'n-press-list-' + new Date().toISOString().slice(0, 10) + '.csv'
    a.click()
  })
  btn('refresh', function () { SU = null; CF = null; panel() })
  cfgsec()
  hd('newest')
  if (!SU.length) nt('nobody yet')
  SU.slice(0, 40).forEach(function (x) {
    var r = document.createElement('div')
    r.className = 'hs'
    r.innerHTML = '<span></span><small></small>'
    r.firstChild.textContent = x.em + (x.nm ? ' · ' + x.nm : '')
    r.children[1].textContent = x.src + ', ' + new Date(x.at).toLocaleDateString([], { month: 'short', day: 'numeric' }) + (x.st != 'pending' ? ', ' + (x.st == 'unsub' ? 'left' : x.st) : '')
    pn.appendChild(r)
  })
}

function devpanel() {
  hd('dev')
  var l = document.createElement('label'), b = document.createElement('button'), im = document.createElement('img'), k = s.icon || 'assets/favicon.svg'
  l.textContent = 'favicon'
  b.className = 'fav'
  b.title = 'change the icon'
  im.src = PV[k] || rp(k)
  b.appendChild(im)
  b.onclick = function (e) {
    e.preventDefault()
    lib(function (p) {
      s.icon = p
      dirty()
      panel()
    })
  }
  l.appendChild(b)
  if (s.icon) {
    var x = document.createElement('a')
    x.className = 'favx'
    x.textContent = 'reset'
    x.onclick = function (e) {
      e.preventDefault()
      delete s.icon
      dirty()
      panel()
    }
    l.appendChild(x)
  }
  pn.appendChild(l)
  nt('the little icon in the browser tab. click it to pick a new one, square works best')
  fld('site lives at', s, 'root')
  nt('/ on cloudflare. /n_press/ only for the old github pages address')
  fld('phones below px', s.grid, 'bp', 'n', 300)
  nt('narrower screens than this get the phone layout')
  hd('mailing list')
  btn('open the mailing list', function () { PT = 'list'; panel() })
  nt('see who signed up, download the list, and turn off the signup limit for events')
  if (TM) tvers()
}

var CF = null

function cfgsec() {
  hd('signup limit')
  if (!CF) {
    nt('loading...')
    fetch('api/cfg').then(function (r) { return r.ok ? r.json() : {} }).then(function (j) {
      CF = j
      if (!sel && PT == 'list') panel()
    })
    return
  }
  var l = document.createElement('label'), i = document.createElement('input'), o = CF.rloff, on = o && o.v == '1'
  l.className = 'ck'
  i.type = 'checkbox'
  i.checked = on
  i.disabled = RO
  i.onchange = function () {
    i.disabled = true
    fetch('api/cfg', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ k: 'rloff', v: i.checked }) }).then(function (r) {
      st.textContent = r.ok ? (i.checked ? 'signup limit off' : 'signup limit back on') : 'could not change the signup limit'
      CF = null
      panel()
    })
  }
  l.appendChild(i)
  l.appendChild(document.createTextNode('no signup limit (event mode)'))
  pn.appendChild(l)
  nt(on ? 'off since ' + when(o.at) + ' by ' + o.by + '. anyone can sign up as fast as they like. turn it back on after the event' : 'normally one connection can sign up 30 emails an hour, which stops bots. check this when a crowd is signing up on one tablet or wifi. it works right away, no publish needed')
}

function scard(n, on, f, bare) {
  var o = s.styles[n], a = document.createElement('a'), b = document.createElement('b'), i = document.createElement('i')
  a.className = 'sty' + (on ? ' on' : '')
  b.textContent = n
  sty(b, { sty: n }, 'text')
  b.style.fontSize = Math.min(o.size || 18, 26) + 'px'
  b.style.lineHeight = '1.2'
  b.style.transform = ''
  i.textContent = sline(o)
  a.appendChild(b)
  a.appendChild(i)
  if (on && !bare) a.appendChild(document.createElement('em')).textContent = 'site font'
  a.onclick = f
  pn.appendChild(a)
}

function sitepanel() {
  hd('text styles')
  Object.keys(s.styles).forEach(function (n) { scard(n, 0, function () { lab(n) }) })
  btn('+ text style', function () {
    var n = prompt('name for the style, like big or small')
    if (!n || s.styles[n]) return
    s.styles[n] = JSON.parse(JSON.stringify(s.styles['body copy'] || {}))
    dirty()
    panel()
    lab(n)
  })
  nt('click a style to open it in the type lab')
}

function relsty(n, o) {
  for (var k in o) {
    if (o[k] && typeof o[k] == 'object') relsty(n, o[k])
    else if (k == 'sty' && o[k] == n) delete o.sty
  }
}

function panel() {
  var s0 = sel
  pnl()
  sel = s0
  pn.classList.toggle('phn', MOB && !pn.classList.contains('gl'))
  var g = null, n = 0
  ;[].slice.call(pn.children).forEach(function (k) {
    if (k.tagName == 'H4') {
      g = document.createElement('div')
      g.className = 'grp' + (n++ % 2 ? ' alt' : '')
      pn.insertBefore(g, k)
    }
    if (g) g.appendChild(k)
  })
}

function bpanel() {
  hd('fill')
  fld('color', sel, 'bg', 'c')
  nt('the bottom of the band. layers sit on top of it')
  var a = sel.ly = sel.ly || []
  hd('layers (' + a.length + ')')
  if (!a.length) nt('one color for now. add images and gradients, as many as you like')
  else nt('the top of this list is the top layer')
  a.forEach(function (L, n) {
    var bx = document.createElement('div'), nv = document.createElement('nav')
    bx.className = 'it bly'
    nv.innerHTML = '<b>' + (L.k == 'grad' ? 'gradient' : 'image') + '</b><button title="move up">↑</button><button title="move down">↓</button><button title="remove">×</button>'
    nv.children[1].onclick = function () {
      if (!n) return
      a.splice(n - 1, 0, a.splice(n, 1)[0])
      dirty(); draw(); panel()
    }
    nv.children[2].onclick = function () {
      if (n == a.length - 1) return
      a.splice(n + 1, 0, a.splice(n, 1)[0])
      dirty(); draw(); panel()
    }
    nv.children[3].onclick = function () {
      a.splice(n, 1)
      dirty(); draw(); panel()
    }
    bx.appendChild(nv)
    tg = bx
    if (L.k == 'grad') {
      fld('kind', L, 'kd', 's', [['', 'linear'], ['radial', 'radial']])
      if (L.kd == 'radial') {
        fld('center x %', L, 'fx', 'o')
        fld('center y %', L, 'fy', 'o')
      } else fld('angle °', L, 'ang', 'o')
      fld('repeat', L, 'rp', 'b')
      L.st = L.st || []
      L.st.forEach(function (x, i) {
        var r = document.createElement('div')
        r.className = 'stp'
        bx.appendChild(r)
        tg = r
        fld('stop ' + (i + 1), x, 'c', 'c')
        fld('at %', x, 'p', 'o')
        var dl = document.createElement('a')
        dl.textContent = '×'
        dl.title = 'remove stop'
        dl.onclick = function () {
          L.st.splice(i, 1)
          dirty(); draw(); panel()
        }
        r.appendChild(dl)
        tg = bx
      })
      var ad = document.createElement('button')
      ad.className = 'pl'
      ad.textContent = '+ stop'
      ad.onclick = function () {
        L.st.push({ c: '#ffffff', p: 100 })
        dirty(); draw(); panel()
      }
      bx.appendChild(ad)
    } else {
      fld('image', L, 'src')
      fld('fit', L, 'fit', 's', [['', 'fill, crop to fit'], ['contain', 'whole image'], ['stretch', 'stretch'], ['tile', 'tile']])
      if (L.fit == 'tile') {
        fld('tiles across', L, 'tn', 'o')
        tg.lastChild.querySelector('input').placeholder = L.tw ? '' : '4'
        fld('or tile width px', L, 'tw', 'o')
        nt('tiles across wins when both are set')
        fld('repeat', L, 'rx', 's', [['', 'both ways'], ['x', 'across only'], ['y', 'down only']])
        fld('start x %', L, 'fx', 'o')
        fld('start y %', L, 'fy', 'o')
      } else {
        fld('focus x %', L, 'fx', 'o')
        fld('focus y %', L, 'fy', 'o')
      }
    }
    fld('opacity %', L, 'op', 'o')
    fld('stays put when scrolling', L, 'att', 'b')
    tg = pn
    pn.appendChild(bx)
  })
  btn('+ image layer', function () {
    a.unshift({ k: 'img', src: '' })
    dirty(); draw(); panel()
  })
  btn('+ gradient layer', function () {
    a.unshift({ k: 'grad', ang: 180, st: [{ c: '#fff45c', p: 0 }, { c: '#e8382c', p: 100 }] })
    dirty(); draw(); panel()
  })
  btn('delete band', del, ' ')
}

function pnl() {
  pn.innerHTML = ''
  pn.classList.remove('gl')
  lists()
  if (!sel) {
    var tb = document.createElement('nav')
    tb.className = 'tbs'
    ;[['page', 'page'], ['site', 'global'], ['type', 'type'], ['dev', 'dev']].forEach(function (x) {
      var a = document.createElement('a')
      a.textContent = x[1]
      if (PT == x[0] || PT == 'list' && x[0] == 'dev') a.className = 'on'
      a.onclick = function () {
        PT = x[0]
        try { localStorage.setItem('pt', PT) } catch (e) {}
        panel()
      }
      tb.appendChild(a)
    })
    pn.appendChild(tb)
    pn.classList.toggle('gl', PT == 'site')
    if (PT == 'site') return everypg()
    if (PT == 'type') return sitepanel()
    if (PT == 'dev') return devpanel()
    if (PT == 'list') return listpanel()
    if (TM) tpanel()
    layers()
    pal('page colors', all(), pg())
    pgpanel()
    return
  }
  var t = sel.type
  if (SS.length > 1) {
    hd(SS.length + ' blocks selected')
    nt('they move together. the settings below are for the last one you clicked')
    btn('delete all ' + SS.length, del, ' ')
    pal('selection colors', SS)
  }
  hd((t == 'nav' ? 'menu' : t) + (MOB ? ', mobile' : ''))
  fld('lock, can not be clicked on the canvas', sel, 'lk', 'b')
  if (sel.lk) nt('unlock it here or with the lock in active elements')
  fld('show on', sel, 'on', 's', [['', 'phone and desktop'], ['d', 'desktop only'], ['p', 'phone only']])
  if (MOB && !sel.fix && !sel.ag && !sel.on) {
    var lk0 = sel.m && Object.keys(sel.m).some(function (k) { return k != 'hide' })
    nt(lk0 ? 'phone: unlinked. blue dots mark what differs from desktop' : 'phone: linked, it follows desktop. moving it or changing a setting here unlinks just that')
    if (lk0) btn('relink to desktop', function () {
      relink(sel)
      dirty(); draw(); panel()
    })
  }
  if (t == 'band') {
    var bz = document.createElement('label'), bs = document.createElement('select')
    bz.textContent = 'size'
    bs.innerHTML = '<option value="">edge to edge</option><option value="ic">inside the columns</option><option value="wp">the whole page</option>'
    bs.value = sel.wp ? 'wp' : sel.ic ? 'ic' : ''
    bs.onchange = function () {
      delete sel.wp
      delete sel.ic
      if (bs.value) sel[bs.value] = true
      dirty(); draw(); panel()
    }
    bz.appendChild(bs)
    pn.appendChild(bz)
  } else {
    var pz = document.createElement('label'), ps0 = document.createElement('select')
    pz.textContent = 'placement'
    ps0.innerHTML = '<option value="">on the grid</option><option value="ag">anti-grid, anywhere</option><option value="top">pinned to top of screen</option><option value="bottom">pinned to bottom of screen</option>'
    ps0.value = sel.fix || (sel.ag ? 'ag' : '')
    ps0.onchange = function () {
      var v = ps0.value
      if (sel.ag && v != 'ag') agon(sel, false)
      if (v == 'top' || v == 'bottom') sel.fix = v
      else delete sel.fix
      if (v == 'ag' && !sel.ag) { draw(); agon(sel, true) }
      dirty(); draw(); panel()
    }
    pz.appendChild(ps0)
    pn.appendChild(pz)
  }
  if (sel.ag && !sel.fix) {
    nt('free of the columns and the baseline. it scales with the width of the screen')
    var W0 = cw()
    ;[['x px', 'fx'], ['y px', 'fy'], ['width px', 'fw']].concat(sel.type == 'text' && !sel.fm ? [] : [['height px', 'fh']]).forEach(function (f) {
      var l = document.createElement('label'), i = document.createElement('input')
      l.textContent = f[0]
      i.type = 'number'
      i.value = Math.round((sel[f[1]] || 0) * W0 / 100)
      i.onchange = function () {
        sel[f[1]] = Math.max(f[1] == 'fx' ? -1e5 : f[1] == 'fy' ? 0 : 4, +i.value || 0) / W0 * 100
        dirty(); draw(); panel()
      }
      l.appendChild(i)
      pn.appendChild(l)
    })
  } else if (t == 'band') {
    if (sel.wp) nt('sits behind everything on the page, top to bottom. pick it in active elements to edit it')
    else {
      nt(sel.ic ? 'sits on the grid columns, inside the page padding' : 'runs edge to edge across the screen. at y 0 it also runs up to the top edge')
      var qb = MOB ? mpx(sel) : sel
      if (sel.ic) {
        fld('x', qb, 'x', 'n')
        fld('width', qb, 'w', 'n', 1)
      }
      fld('y', qb, 'y', 'n')
      fld('height', qb, 'h', 'n', 1)
    }
  } else if (!sel.fix) {
    var q = MOB ? mpx(sel) : sel
    fld('x', q, 'x', 'n')
    fld('y', q, 'y', 'n')
    fld('width', q, 'w', 'n', 1)
    fld('height', q, 'h', 'n', 1)
  } else {
    fld('width', sel, 'w', 'n', 1)
    fld('height', sel, 'h', 'n', 1)
  }
  if (sel.type == 'band' && sel.wp) nt('a whole page band is always behind everything, so it has no layer')
  else {
    fld('layer', sel, 'z', 'n')
    btn('to front', function () { tofr(sel) })
    btn('to back', function () { tobk(sel) })
  }
  btn('duplicate', function () { cp(); pst() })
  var cl = document.createElement('label'), ck = document.createElement('input')
  cl.className = 'ck'
  ck.type = 'checkbox'
  ck.checked = s.common.indexOf(sel) > -1
  ck.onchange = function () {
    var a = arr(sel)
    a.splice(a.indexOf(sel), 1)
    ;(ck.checked ? s.common : pg().blocks).push(sel)
    dirty()
    draw()
  }
  cl.appendChild(ck)
  cl.appendChild(document.createTextNode('on every page'))
  pn.appendChild(cl)
  if (sel.fix && t != 'band') {
    fld('from edge %', sel, 'fo', 'o')
    fld('side', sel, 'fa', 's', [['', 'center'], 'left', 'right'])
  }
  if (MOB) sel = mprox(sel)
  if (t == 'band') return bpanel()
  if (t == 'shape') {
    var ln = sel.sh == 'line', sw = sel.sw || 0
    hd('properties')
    fld('kind', sel, 'sh', 's', [['rect', 'rectangle'], ['ellipse', 'ellipse'], ['line', 'line']])
    if (ln) {
      fld('direction', sel, 'dir', 's', [['', 'across —'], ['v', 'down |'], ['d', 'diagonal ↘'], ['u', 'diagonal ↗']])
      nt('the line runs through the middle of its box. resize the box to make it longer')
    } else {
      fld('fill', sel, 'fill', 'c')
      if (sel.sh == 'rect') fld('corners', sel, 'rd', 'o')
    }
    fld('opacity %', sel, 'op', 'o')
    fld('rotate', sel, 'rot', 'o')
    hd('stroke')
    fld('thickness px', sel, 'sw', 'o')
    if (!ln) {
      fld('position', sel, 'sa', 's', [['', 'inside'], ['c', 'center'], ['o', 'outside']])
      nt(sel.sa == 'o' ? 'the stroke sits outside the box, so the shape looks bigger than its grid spot' : sel.sa == 'c' ? 'the stroke straddles the edge of the box, half in and half out' : 'the stroke sits inside the box, so the shape keeps its size on the grid')
    }
    fld('style', sel, 'ds', 's', [['', 'solid'], ['dashed', 'dashed'], ['dotted', 'dotted'], ['img', 'image']])
    if (sel.ds != 'img') fld(ln ? 'color' : 'stroke color', sel, 'sc', 'c')
    if (sel.ds) {
      hd(sel.ds == 'img' ? 'image dashes (beta)' : sel.ds == 'dotted' ? 'dots' : 'dashes')
      if (sel.ds == 'img') {
        fld('image', sel, 'di')
        fld('keep images upright', sel, 'iu', 'b')
        nt(sel.iu ? 'each image is scaled to the stroke thickness and stays upright' : 'each image is scaled to the stroke thickness and turns to follow the edge')
      }
      if (sel.ds != 'dotted') {
        fld(sel.ds == 'img' ? 'image length px' : 'dash length px', sel, 'dl', 'o')
        tg.lastChild.querySelector('input').placeholder = sel.ds == 'img' ? 'auto' : sw * 3
      }
      fld('gap px', sel, 'dg', 'o')
      tg.lastChild.querySelector('input').placeholder = sel.ds == 'img' ? sw * .5 : sel.ds == 'dotted' ? sw * 1.5 : sw * 2
      fld('how many', sel, 'dn', 'o')
      tg.lastChild.querySelector('input').placeholder = 'auto'
      nt('how many spreads them evenly along the whole edge and overrides the gap')
      fld('start offset px', sel, 'dof', 'o')
      if (sel.ds == 'dashed') fld('dash ends', sel, 'cap', 's', [['', 'flat'], ['round', 'round'], ['square', 'square']])
    } else if (ln) fld('ends', sel, 'cap', 's', [['', 'flat'], ['round', 'round'], ['square', 'square']])
    btn('delete shape', del, ' ')
    return
  }
  if (MOB) sel = mprox(sel)
  hd('content')
  if (t == 'image' || t == 'banner') fld('image', sel, 'src')
  if (t == 'video') {
    fld('video', sel, 'src')
    fld('poster', sel, 'poster')
    fld('controls', sel, 'ctl', 'b')
    if (sel.ctl) fld('autoplay', sel, 'auto', 'b')
    fld('play once', sel, 'once', 'b')
  }
  if (t == 'image') {
    fld('alt', sel, 'alt', 't')
    fld('click to zoom', sel, 'zoom', 'b')
    if (sel.zoom) fld('caption', sel, 'cap', 't')
  }
  if (t == 'gallery') {
    fld('layout', sel, 'mode', 's', [['grid', 'grid'], ['slides', 'slideshow']])
    if (sel.mode == 'slides') fld('auto seconds', sel, 'auto', 'o')
    else {
      fld('columns', sel, 'cols', 'n', 1)
      fld('on phones', sel, 'mcol', 'o')
      fld('space', sel, 'gg', 'o')
    }
    fld('click to zoom', sel, 'zoom', 'b')
    fld('show captions', sel, 'caps', 'b')
  }
  if ('image video gallery banner'.indexOf(t) > -1) {
    fld('fit', sel, 'fit', 's', [['', t == 'banner' ? 'fill' : 'crop'], ['contain', 'whole image'], ['fill', 'stretch']].slice(0, t == 'banner' ? 2 : 3))
    fld('focus', sel, 'fp', 's', [['', 'center'], 'top', 'bottom', 'left', 'right'])
  }
  if (t == 'gallery') {
    lst('images', sel, 'items', [['src', 'image'], ['cap', 'caption', 't']])
    btn('+ from photos', function () {
      lib(function (p) {
        sel.items.push({ src: p })
        dirty(); draw(); panel()
      })
    })
    btn('+ upload', function () {
      upk(function (ps) {
        ps.forEach(function (p) { sel.items.push({ src: p }) })
        dirty(); draw(); panel()
      })
    })
  }
  if (t == 'banner') fld('text', sel, 'html', 'ta')
  if (t == 'marquee') {
    fld('text', sel, 'html', 'ta')
    nt('double click the marquee to stop it and type, with bold, links, colors and highlight. drop photos onto it to add them')
    btn('+ photo', function () {
      lib(function (p) { mqimg(sel.__pb || sel, p) })
    })
    fld('seconds', sel, 'speed', 'n', 1)
    nt('how long one full loop takes, more is slower')
    fld('direction', sel, 'dir', 's', [['', 'to the left ←'], ['r', 'to the right →'], ['u', 'up ↑'], ['d', 'down ↓']])
    fld('pause on hover', sel, 'hp', 'b')
    fld('space between px', sel, 'gp', 'o')
    fld('photo size %', sel, 'ih', 'o')
    nt('photos are as tall as the text at 100')
  }
  if (t == 'button') fld('label', sel, 't', 't')
  if ('text image banner button video'.indexOf(t) > -1 && !sel.zoom) fld('link', sel, 'href')
  if (t == 'table') tpan(sel.__pb || sel, sel)
  if (t == 'join') {
    nt('people type their email and it saves to the list. see everyone in the list tab')
    fld('layout', sel, 'lay', 's', [['', 'field and button in a row'], ['st', 'stacked']])
    fld('ask for a name', sel, 'nmf', 'b')
    fld('placeholder', sel, 'ph', 't')
    fld('button', sel, 'bt', 't')
    fld('small print', sel, 'note', 't')
    nt('say what they are signing up for. it is saved with each signup as their consent')
    fld('thank you', sel, 'ok', 't')
    fld('button color', sel, 'bbg', 'c')
    fld('button text', sel, 'bfg', 'c')
  }
  if (t == 'events') {
    nt(EV && EV.demo ? 'showing sample events. once the google calendar is connected, its events show here' : 'events come from the ñ press google calendar. add or change them there, the site updates in a few minutes')
    fld('view', sel, 'vw', 's', [['', 'list'], ['month', 'month']])
    if (sel.vw == 'month') fld('week starts', sel, 'ws', 's', [['', 'sunday'], ['mo', 'monday']])
    else {
      fld('how many', sel, 'n', 'n', 1)
      fld('past events', sel, 'past', 'o')
      nt('how many past events to list under the upcoming ones, blank for none')
    }
    fld('place', sel, 'loc', 'b')
    fld('descriptions', sel, 'dsc', 'b')
    fld('pictures', sel, 'pic', 'b')
    fld('add to calendar button', sel, 'add', 'b')
    fld('date color', sel, 'ac', 'c')
    fld('when empty', sel, 'emp', 't')
    btn('refresh events', function () { EV = null; EVD = 0; evl() })
  }
  if (t == 'embed') {
    fld('code', sel, 'code', 'a')
    nt('paste an iframe from youtube, spotify, google maps etc')
  }
  if (t == 'text') {
    fld('box', sel, 'fm', 's', [['', 'free, grows with text'], ['lock', 'locked, cuts off'], ['fit', 'scale text to fit']])
    if (OV[sel.id]) nt('! some text is cut off. make the box bigger or the text shorter')
    fld('html', sel, 'html', 'ta')
    nt('or double click the block to type')
  }
  if (t == 'lang') {
    sel.names = sel.names || {}
    LS.forEach(function (l) { fld('label ' + l, sel.names, l) })
  }
  if (t == 'nav') {
    nt('link to a page with @address, @ alone is home')
    lst('links', sel, 'items', [['t', 'label', 't'], ['href', 'link']])
  }
  if (t == 'tabs') {
    fld('filter label', sel, 'flt', 't')
    nt('a link like #prints filters cards tagged prints')
    lst('tabs', sel, 'items', [['t', 'label', 't'], ['href', 'link']])
  }
  if (t == 'cards') {
    fld('columns', sel, 'cols', 'n', 1)
    fld('on phones', sel, 'mcol', 'o')
    nt('columns on phones, 2 if blank')
    fld('per page', sel, 'per', 'n')
    nt('0 per page shows all')
    lst('items', sel, 'items', [['t', 'title', 't'], ['price', 'price'], ['was', 'old price'], ['badge', 'sticker', 't'], ['img', 'image'], ['href', 'link'], ['tag', 'tag']])
  }
  stl(sel, t)
  btn('delete block', del, ' ')
}

function dirty() {
  if (LB) lrd()
  pdeb()
  var j = JSON.stringify(s)
  if (LAST != null && j != LAST) {
    UN.push(LAST)
    if (UN.length > 200) UN.shift()
    RE = []
  }
  LAST = j
  if (TM) return qs()
  dirt = true
  st.textContent = 'unsaved'
  clearTimeout(dt)
  dt = setTimeout(function () {
    localStorage.setItem('draft', JSON.stringify({ t: Date.now(), s: s }))
  }, 700)
}

function hist(a, b) {
  if (!a.length) return
  b.push(LAST)
  LAST = a.pop()
  var ids = SS.map(function (x) { return x.id })
  s = JSON.parse(LAST)
  setup()
  SS = all().filter(function (x) { return ids.indexOf(x.id) > -1 })
  sel = SS[SS.length - 1] || null
  draw()
  panel()
  if (LB) lrd(1)
  if (TM) return qs()
  dirt = true
  st.textContent = 'unsaved'
}

function chk() {
  var d = JSON.parse(localStorage.getItem('draft') || 'null')
  if (!d) return
  if (JSON.stringify(d.s) != JSON.stringify(s) && confirm('restore unsaved changes from ' + new Date(d.t).toLocaleString() + '?')) {
    s = d.s
    setup()
    dirty()
  } else localStorage.removeItem('draft')
}

function db() {
  return new Promise(function (ok) {
    var q = indexedDB.open('mastermind', 1)
    q.onupgradeneeded = function () { q.result.createObjectStore('h') }
    q.onsuccess = function () { ok(q.result) }
  })
}

async function keep(h) {
  var d = await db()
  d.transaction('h', 'readwrite').objectStore('h').put(h, 'dir')
}

async function back() {
  var d = await db()
  return new Promise(function (ok) {
    var q = d.transaction('h').objectStore('h').get('dir')
    q.onsuccess = function () { ok(q.result) }
  })
}

async function opn(fresh) {
  var h = fresh ? null : await back()
  if (h && await h.requestPermission({ mode: 'readwrite' }) == 'granted') dir = h
  else {
    dir = await showDirectoryPicker({ id: 'npress', mode: 'readwrite' })
    keep(dir)
  }
  try {
    var f = await (await dir.getFileHandle('site.json')).getFile()
    if (!dirt) { s = JSON.parse(await f.text()); sel = null; setup(); LAST = JSON.stringify(s); UN = []; RE = [] }
  } catch (e) {}
  st.textContent = 'folder: ' + dir.name + (dirt ? ' / unsaved' : '')
}

async function save() {
  if (TM) return flush()
  if (!dir) await opn()
  st.textContent = 'saving...'
  var n = await pub()
  var w = await (await dir.getFileHandle('site.json', { create: true })).createWritable()
  await w.write(JSON.stringify(s, null, 2) + '\n')
  await w.close()
  dirt = false
  LAST = JSON.stringify(s)
  localStorage.removeItem('draft')
  st.textContent = 'saved site + ' + n + ' pages to ' + dir.name + ' ' + new Date().toLocaleTimeString() + (PO.length ? ' · text cut off on: ' + PO.join(', ') : '')
}

document.getElementById('un').onclick = function () { hist(UN, RE) }
document.getElementById('re').onclick = function () { hist(RE, UN) }
document.getElementById('hk').onclick = function () { hlp.hidden = !hlp.hidden }
hlp.onclick = function () { hlp.hidden = true }

document.getElementById('o').onclick = function (e) { opn(e.shiftKey) }
document.getElementById('sv').onclick = save
document.getElementById('pgs').onchange = function () {
  pi = +this.value
  sel = null
  CUR = pg().slug || ''
  draw()
  panel()
}

function pside(v) {
  document.body.classList.remove('pl', 'pr')
  if (v) document.body.classList.add('p' + v)
}

document.getElementById('sb').onclick = function () {
  SB = !SB
  document.body.classList.toggle('sb', SB)
  this.classList.toggle('on', SB)
  this.textContent = SB ? 'single view' : 'side by side'
  pside('')
  if (SB) act(MOB)
  else {
    MOB = false
    cv = cvd
  }
  draw()
  panel()
}

document.getElementById('tl').onclick = function () { pside(document.body.classList.contains('pl') ? '' : 'l') }
document.getElementById('tr').onclick = function () { pside(document.body.classList.contains('pr') ? '' : 'r') }

document.getElementById('mb').onclick = function () {
  MOB = !MOB
  this.textContent = MOB ? 'phone' : 'desktop'
  draw()
  panel()
}

document.getElementById('pv').onclick = function () {
  if (TM) return
  if (dirt) localStorage.setItem('draft', JSON.stringify({ t: Date.now(), s: s }))
  window.open('./?mm=1&p=' + (pg().slug || ''), 'npreview')
}

document.getElementById('lg').onchange = function () {
  L = this.value
  tbr()
  draw()
  panel()
}

document.getElementById('ad').onchange = function () {
  var v = this.value.split(':')
  this.value = ''
  if (!v[0]) return
  add(v[0])
  if (v[1]) {
    sel.sh = v[1]
    if (v[1] == 'line') {
      sel.h = 2
      sel.sw = 2
      delete sel.fill
    }
    if (v[1] == 'ellipse') sel.h = 7
    dirty(); draw(); panel()
  }
}

cv.addEventListener('click', function (e) { e.preventDefault() })

document.getElementById('wr').onpointerdown = function (e) {
  if (RO) return
  var wr = this
  if (SB) act(cvp.contains(e.target) || e.clientX < cvd.getBoundingClientRect().left)
  if (e.target != cv && e.target != wr && !(SB && (e.target == cvp || e.target == cvd))) return
  var sx = e.clientX, sy = e.clientY, add = e.shiftKey, on = false
  wr.setPointerCapture(e.pointerId)
  wr.onpointermove = function (e) {
    if (!on && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 5) return
    on = true
    bx.style.display = 'block'
    bx.style.left = Math.min(sx, e.clientX) + 'px'
    bx.style.top = Math.min(sy, e.clientY) + 'px'
    bx.style.width = Math.abs(e.clientX - sx) + 'px'
    bx.style.height = Math.abs(e.clientY - sy) + 'px'
  }
  wr.onpointerup = function () {
    wr.onpointermove = wr.onpointerup = null
    if (!on) { if (!add) pick(null); return }
    var r = bx.getBoundingClientRect()
    bx.style.display = 'none'
    if (!add) SS = []
    all().forEach(function (b) {
      var el = elof(b), q
      if (!el || b.fix || b.lk) return
      q = el.getBoundingClientRect()
      if (q.right > r.left && q.left < r.right && q.bottom > r.top && q.top < r.bottom && SS.indexOf(b) < 0) SS.push(b)
    })
    sel = SS[SS.length - 1] || null
    var ids = SS.map(function (x) { return x.id })
    document.querySelectorAll('.b').forEach(function (x) { x.classList.toggle('on', ids.indexOf(x.bid) > -1) })
    mgf()
    panel()
  }
}

document.onkeydown = function (e) {
  var m = e.metaKey || e.ctrlKey, k = e.key.toLowerCase()
  if (m && k == 's') { e.preventDefault(); save(); return }
  if (m && (e.key == '|' || (e.shiftKey && e.code == 'Backslash')) && !RO) {
    e.preventDefault()
    var ag = (SS.length ? SS : all()).filter(function (b) { return b.ag && !b.lk })
    if (!ag.length) return
    ag.forEach(function (b) { agon(b, false) })
    draw()
    ag.forEach(function (b) { agon(b, true) })
    dirty(); draw(); panel()
    st.textContent = ag.length + (ag.length > 1 ? ' anti-grid blocks' : ' anti-grid block') + ' lined up with the grid'
    return
  }
  if (LB) {
    if (e.key == 'Escape' && !(e.target.closest && e.target.closest('#fpk, #cpk'))) lclose()
    return
  }
  if (RO) return
  var a = document.activeElement
  if (a && (a.tagName == 'INPUT' || a.tagName == 'TEXTAREA' || a.tagName == 'SELECT' || a.isContentEditable)) {
    if (e.key == 'Escape') a.blur()
    return
  }
  if (m && k == 'z') { e.preventDefault(); e.shiftKey ? hist(RE, UN) : hist(UN, RE); return }
  if (m && k == 'y') { e.preventDefault(); hist(RE, UN); return }
  if (m && k == 'v') { e.preventDefault(); pst(); return }
  if (m && k == 'a') {
    e.preventDefault()
    SS = all().filter(function (b) { return !b.fix && !b.lk })
    sel = SS[SS.length - 1] || null
    draw(); panel()
    return
  }
  if (e.key == '?') { hlp.hidden = !hlp.hidden; return }
  if (e.key == 'Escape') { hlp.hidden = true; pick(null); return }
  if (!SS.length) return
  if (m && k == 'c') { cp(); return }
  if (m && k == 'x') { cp(); del(); return }
  if (m && k == 'd') { e.preventDefault(); cp(); pst(); return }
  if (e.key == 'Delete' || e.key == 'Backspace') {
    e.preventDefault()
    SS = SS.filter(function (b) { return !b.lk })
    sel = SS.indexOf(sel) > -1 ? sel : SS[0] || null
    if (SS.length) del()
    return
  }
  if (e.key == 'Enter' && sel && sel.type == 'text') { e.preventDefault(); typ(sel, elof(sel)); return }
  var ar = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
  if (ar) { e.preventDefault(); nudge(ar[0], ar[1], e.shiftKey) }
}

window.onbeforeunload = function (e) { if (dirt) e.preventDefault() }
window.onresize = function () { draw() }
document.fonts.onloadingdone = function () {
  BL = {}
  if (s && !document.activeElement.isContentEditable) draw()
}

function local() {
fetch('site.json?' + Date.now()).then(function (r) { return r.json() }).catch(function () {}).then(function (j) {
  s = j || { grid: { cols: 12, row: 24, gap: 10, pad: 20, v: 2 }, styles: {'body copy': {'font': '"Degular", Helvetica, Arial, sans-serif', 'size': 18, 'wt': '400'}, 'caption': {'font': '"Degular", Helvetica, Arial, sans-serif', 'size': 12, 'wt': '400'}, 'H1': {'font': '"Degular", Helvetica, Arial, sans-serif', 'size': 64, 'wt': '700'}, 'H2': {'font': '"Degular", Helvetica, Arial, sans-serif', 'size': 32, 'wt': '700'}}, pages: [{ id: 'home', slug: '', title: 'ñ press', blocks: [] }] }
  setup()
  LAST = JSON.stringify(s)
  chk()
  if (!window.showDirectoryPicker) st.textContent = 'saving needs chrome or edge'
  else back().then(function (h) {
    if (h) st.textContent = 'click open folder to reconnect ' + h.name
    else if (!j) st.textContent = 'click open folder and pick n_press'
  })
})
}
