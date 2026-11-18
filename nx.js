var hr = JSON.parse(localStorage.getItem('hrt') || '[]')

var s, box = document.getElementById('pg')

RT = document.body.dataset.rt || ''

var MM = location.search.indexOf('mm=') > -1, DR = document.body.dataset.dr, VS = new URLSearchParams(location.search).get('v')

function dft() {
  var d = JSON.parse(localStorage.getItem('draft') || 'null')
  document.getElementById('pvw').textContent = d ? 'preview of unsaved changes' : 'nothing unsaved, this is the saved site'
  if (d) return Promise.resolve(d.s)
  return fetch(RT + 'site.json?' + Date.now()).then(function (r) { return r.json() })
}

function load() {
  if (MM) {
    var tg = document.createElement('div')
    tg.id = 'pvw'
    document.body.appendChild(tg)
    return dft()
  }
  if (!DR) return fetch(RT + 'site.json').then(function (r) { return r.json() })
  LP = '/preview/'
  fb()
  LQ = VS ? '?v=' + VS : ''
  return fetch(VS ? '/api/version?sha=' + VS : '/api/draft').then(function (r) { return r.json() }).then(function (d) {
    var tg = document.createElement('div')
    tg.id = 'pvw'
    tg.textContent = VS ? 'old version ' + VS.slice(0, 7) + ', not live' : d.s ? 'preview of the draft by ' + d.by + ', not live yet' : 'no draft, this is the live site'
    document.body.appendChild(tg)
    if (d.s) return d.s
    return fetch('/site.json?' + Date.now()).then(function (r) { return r.json() })
  }).then(function (j) {
    ;(j.pend || []).forEach(function (p) { PM[p] = '/api/img/' + p.slice(7) })
    return j
  })
}

load().then(function (j) {
  s = j
  mig(s)
  LS = s.langs || ['es']
  L = localStorage.getItem('lng')
  if (LS.indexOf(L) < 0) L = LS[0]
  CUR = MM ? new URLSearchParams(location.search).get('p') || '' : document.body.dataset.p != null ? document.body.dataset.p : new URLSearchParams(location.search).get('p') || ''
  var mm = matchMedia('(max-width: ' + (s.grid.bp || 700) + 'px)')
  MOB = mm.matches
  mm.onchange = function () { MOB = mm.matches; go() }
  go()
})

var PG, PP

function evup() { if (s) go() }

function draw(bl) {
  box.innerHTML = ''
  grd(box, PG)
  auto(bl, PG)
  pend(bl, PP)
  bl.forEach(function (b) {
    var d = document.createElement('div')
    d.className = 'b'
    d.bid = b.id
    lay(d, b)
    d.appendChild(bk(b))
    box.appendChild(d)
  })
  bas(box)
  sdash(box)
}

function go() {
  var p = s.pages.filter(function (x) { return (x.slug || '') == CUR })[0] || (CUR == '404' ? { title: '404', blocks: [nf()] } : s.pages[0])
  var bl = (s.common || []).concat(p.blocks)
  PG = pgd(s, p)
  PP = p
  base(document.body, s, p)
  bl.forEach(function (b) { delete b._h })
  draw(bl)
  plen(box, p, PG)
  if (MOB) {
    var re = false
    box.querySelectorAll('.b.fr, .t-cards, .t-nav, .t-events, .t-table').forEach(function (d) {
      var b = bl.filter(function (x) { return x.id == d.bid })[0]
      if (!b || (b.m && b.m.w) || b.fix) return
      var c = d.querySelector('.c')
      c.style.height = 'auto'
      var n = Math.max(1, Math.ceil((c.offsetHeight + (parseFloat(c.style.top) || 0)) / PG.row))
      c.style.height = ''
      if (n != b.h) { b._h = n; re = true }
    })
    if (re) draw(bl)
  }
  fits()
  pbg(document.body, s, p)
  document.documentElement.lang = L
  document.title = tx(p.title) || 'ñ press'
  box.querySelectorAll('.cd').forEach(function (c) {
    if (hr.indexOf(c.dataset.k) > -1) heart(c, 1)
  })
  tk.forEach(clearInterval)
  tk = []
  box.querySelectorAll('.sl[data-auto]').forEach(function (el) {
    if (+el.dataset.auto) tk.push(setInterval(function () { slide(el, 1) }, el.dataset.auto * 1000))
  })
}

var tk = [], lb, lg = [], li = 0

function slide(el, d) {
  var fs = el.querySelectorAll('figure'), n = (+el.dataset.n + d + fs.length) % fs.length
  fs.forEach(function (f, i) { f.style.display = i == n ? '' : 'none' })
  el.querySelectorAll('.dts i').forEach(function (x, i) { x.classList.toggle('on', i == n) })
  el.dataset.n = n
}

function zoom(im) {
  lg = [].slice.call(document.querySelectorAll('[data-z="' + im.dataset.z + '"]'))
  li = lg.indexOf(im)
  lb = document.createElement('div')
  lb.id = 'lb'
  lb.innerHTML = '<img alt=""><p></p>' + (lg.length > 1 ? '<a class="sv pv">‹</a><a class="sv nx">›</a>' : '')
  document.body.appendChild(lb)
  show(0)
}

function show(d) {
  li = (li + d + lg.length) % lg.length
  lb.querySelector('img').src = lg[li].src
  lb.querySelector('p').textContent = lg[li].dataset.cap || ''
}

function shut() {
  lb.remove()
  lb = null
}

document.addEventListener('keydown', function (e) {
  if (!lb) return
  if (e.key == 'Escape') shut()
  if (e.key == 'ArrowRight') show(1)
  if (e.key == 'ArrowLeft') show(-1)
})

function fits() {
  box.querySelectorAll('.c-text.m-fit').forEach(fitx)
}

var rz
window.addEventListener('resize', function () {
  clearTimeout(rz)
  rz = setTimeout(function () { fits(); sdash(box) }, 150)
})
document.fonts.ready.then(function () { if (s) { BL = {}; bas(box); fits() } })

function heart(c, on) {
  var h = c.querySelector('.hrt')
  h.classList.toggle('on', on)
  h.textContent = on ? '♥' : '♡'
}

function srt(how) {
  document.querySelectorAll('.c-cards').forEach(function (el) {
    var g = el.querySelector('.cg'), cs = [].slice.call(g.children)
    cs.sort(function (a, b) {
      if (how == 'lo') return a.dataset.p - b.dataset.p
      if (how == 'hi') return b.dataset.p - a.dataset.p
      if (how == 'az') return a.textContent.localeCompare(b.textContent)
      return a.dataset.n - b.dataset.n
    })
    cs.forEach(function (c) { g.appendChild(c) })
    sh(el, 0, el.dataset.tag)
  })
}

document.addEventListener('click', function (e) {
  var t = e.target, x
  if (lb) {
    if (t.closest('.sv')) show(t.closest('.nx') ? 1 : -1)
    else shut()
    return
  }
  if ((x = t.closest('.c-gallery .sv'))) {
    slide(x.parentNode, x.classList.contains('nx') ? 1 : -1)
  } else if ((x = t.closest('[data-z]'))) {
    e.preventDefault()
    zoom(x)
  } else if ((x = t.closest('.c-lang a'))) {
    e.preventDefault()
    L = x.dataset.l
    localStorage.setItem('lng', L)
    go()
  } else if ((x = t.closest('.hrt'))) {
    e.preventDefault()
    var c = x.closest('.cd'), k = c.dataset.k, i = hr.indexOf(k)
    if (i > -1) hr.splice(i, 1)
    else hr.push(k)
    heart(c, i < 0)
    localStorage.setItem('hrt', JSON.stringify(hr))
  } else if ((x = t.closest('.pgr span'))) {
    var el = x.closest('.c-cards')
    sh(el, +x.dataset.i, el.dataset.tag)
  } else if ((x = t.closest('.fm span'))) {
    srt(x.dataset.s)
    x.closest('.flt').classList.remove('op')
  } else if ((x = t.closest('.flt'))) {
    x.classList.toggle('op')
  } else if ((x = t.closest('.c-tabs a')) && x.getAttribute('href').charAt(0) == '#') {
    e.preventDefault()
    var tg = x.classList.contains('on') ? '' : x.getAttribute('href').slice(1)
    x.parentNode.querySelectorAll('a').forEach(function (a) { a.classList.toggle('on', a == x && !!tg) })
    document.querySelectorAll('.c-cards').forEach(function (el) { sh(el, 0, tg) })
  }
  if (!t.closest('.flt')) document.querySelectorAll('.flt.op').forEach(function (f) { f.classList.remove('op') })
})

if (MM) {
  addEventListener('storage', function (e) {
    if (e.key != 'draft') return
    dft().then(function (j) {
      s = j
      mig(s)
      LS = s.langs || ['es']
      go()
    })
  })
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a')
    if (!a || a.origin != location.origin || a.getAttribute('href').charAt(0) == '#' || a.target) return
    var p = a.pathname.slice(RT.length || 1).replace(/\/+$/, '').replace(/index\.html$/, '')
    e.preventDefault()
    CUR = p
    history.replaceState(null, '', '?mm=1&p=' + p)
    go()
    scrollTo(0, 0)
  })
}
