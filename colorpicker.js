var CP = null, RC = []
try { RC = JSON.parse(localStorage.getItem('rc') || '[]') } catch (e) {}

function h2v(x) {
  var r = parseInt(x.slice(1, 3), 16) / 255, g = parseInt(x.slice(3, 5), 16) / 255, b = parseInt(x.slice(5, 7), 16) / 255
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0
  if (d) {
    if (mx == r) h = ((g - b) / d) % 6
    else if (mx == g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, mx ? d / mx : 0, mx]
}

function v2h(h, s, v) {
  var f = function (n) {
    var k = (n + h / 60) % 6
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
  }
  return '#' + [f(5), f(3), f(1)].map(function (x) { return ('0' + x.toString(16)).slice(-2) }).join('')
}

function sitec() {
  var rf = [], n = {}
  walkc(s, rf)
  rf.forEach(function (r) {
    var v = hx(r[0][r[1]]).slice(0, 7)
    n[v] = (n[v] || 0) + 1
  })
  return Object.keys(n).sort(function (a, b) { return n[b] - n[a] })
}

function cpx() {
  if (!CP) return
  var i = CP.i, x = (i.value || '').toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(x) && x != (CP.o || '').toLowerCase()) {
    RC = [x].concat(RC.filter(function (y) { return y != x })).slice(0, 10)
    try { localStorage.setItem('rc', JSON.stringify(RC)) } catch (e) {}
  }
  CP.w.remove()
  document.removeEventListener('pointerdown', CP.out, true)
  CP = null
  if (i.onclose) i.onclose()
}

function cpk(i) {
  cpx()
  var w = document.createElement('div'), c
  w.id = 'cpk'
  w.innerHTML = '<div class="csv"><b></b></div><div class="chu"><b></b></div>' +
    '<div class="cr">' + (window.EyeDropper ? '<button class="ed" title="pick a color from the screen"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M11 1.5l3.5 3.5-2 2-1-1L5 12.5 2.5 13.5 3.5 11l6.5-6.5-1-1z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></button>' : '') +
    '<span class="pv" title="before / after"><i></i><i></i></span><label>#<input class="hx" spellcheck="false" maxlength="7"></label></div>' +
    '<h5>recent</h5><div class="sws rc"></div>' +
    '<a class="all"></a><div class="sws al" hidden></div>'
  document.body.appendChild(w)
  c = CP = { i: i, w: w, o: i.value, hsv: h2v(i.value || '#ffffff'), r: i.getBoundingClientRect() }
  var sv = w.querySelector('.csv'), hu = w.querySelector('.chu'), hx0 = w.querySelector('.hx'), pv = w.querySelectorAll('.pv i')

  function cur() { return v2h(c.hsv[0], c.hsv[1], c.hsv[2]) }

  function paint() {
    var x = cur()
    sv.style.background = 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(' + c.hsv[0] + ', 100%, 50%))'
    sv.firstChild.style.left = c.hsv[1] * 100 + '%'
    sv.firstChild.style.top = (1 - c.hsv[2]) * 100 + '%'
    sv.firstChild.style.background = x
    hu.firstChild.style.left = c.hsv[0] / 360 * 100 + '%'
    hu.firstChild.style.background = 'hsl(' + c.hsv[0] + ', 100%, 50%)'
    pv[0].style.background = c.o
    pv[1].style.background = x
    if (!c.ty) hx0.value = x.slice(1).toUpperCase()
  }

  function send(fin) {
    var x = cur()
    i.value = x
    i.dispatchEvent(new Event('input', { bubbles: true }))
    if (fin) i.dispatchEvent(new Event('change', { bubbles: true }))
    paint()
  }

  function put(x, fin) {
    c.hsv = h2v(x)
    send(fin)
  }

  function drag(el, f) {
    el.onpointerdown = function (e) {
      el.setPointerCapture(e.pointerId)
      f(e)
      send()
      el.onpointermove = function (e) { f(e); send() }
      el.onpointerup = function () {
        el.onpointermove = el.onpointerup = null
        send(1)
      }
    }
  }

  drag(sv, function (e) {
    var r = sv.getBoundingClientRect()
    c.hsv[1] = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    c.hsv[2] = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height))
  })
  drag(hu, function (e) {
    var r = hu.getBoundingClientRect()
    c.hsv[0] = Math.max(0, Math.min(359.9, (e.clientX - r.left) / r.width * 360))
  })

  function typed() {
    c.ty = 0
    var x = hx0.value.replace('#', '').trim()
    if (/^[0-9a-f]{3}$/i.test(x)) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2]
    if (/^[0-9a-f]{6}$/i.test(x)) put('#' + x.toLowerCase(), 1)
    else paint()
  }
  hx0.onkeydown = function (e) {
    if (e.key == 'Enter') { e.preventDefault(); typed(); hx0.select() }
    if (e.key == 'Escape') { e.stopPropagation(); cpx() }
  }
  hx0.onchange = typed
  hx0.oninput = function () { c.ty = 1 }
  hx0.onpaste = function () { setTimeout(typed) }

  var ed = w.querySelector('.ed')
  if (ed) ed.onclick = function () {
    new EyeDropper().open().then(function (r) { put(r.sRGBHex.length == 7 ? r.sRGBHex : '#000000', 1) }).catch(function () {})
  }

  function sws(el, ls, empty) {
    el.innerHTML = ''
    if (!ls.length) el.innerHTML = '<span>' + empty + '</span>'
    ls.forEach(function (x) {
      var b = document.createElement('button')
      b.style.background = x
      b.title = x.toUpperCase()
      b.onclick = function () { put(x, 1) }
      el.appendChild(b)
    })
  }

  var sc = sitec(), al = w.querySelector('.all'), ag = w.querySelector('.al')
  al.textContent = 'all site colors (' + sc.length + ')'
  al.onclick = function () {
    ag.hidden = !ag.hidden
    al.classList.toggle('op', !ag.hidden)
    pos()
  }
  sws(w.querySelector('.rc'), RC, 'nothing yet')
  sws(ag, sc, 'no colors on the site yet')

  function pos() {
    var r = c.r, h = w.offsetHeight
    w.style.left = Math.max(8, Math.min(r.left, innerWidth - w.offsetWidth - 8)) + 'px'
    w.style.top = (r.bottom + 6 + h > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px'
  }
  pos()
  paint()
  hx0.focus()
  hx0.select()

  c.out = function (e) {
    if (w.contains(e.target) || e.target == i) return
    cpx()
  }
  document.addEventListener('pointerdown', c.out, true)
}

document.addEventListener('click', function (e) {
  var i = e.target
  if (i.tagName != 'INPUT' || i.type != 'color') return
  e.preventDefault()
  if (CP && CP.i == i) return cpx()
  cpk(i)
}, true)

window.addEventListener('keydown', function (e) {
  if (CP && e.key == 'Escape') {
    e.stopPropagation()
    cpx()
  }
}, true)
