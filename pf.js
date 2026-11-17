var PF = { log: [], net: {}, last: '' }, pfb = document.getElementById('pf'), pfp = document.getElementById('pfp'), ptm

function plog(t, m) {
  PF.log.unshift({ t: t, m: m, at: Date.now() })
  PF.log = PF.log.slice(0, 30)
  pdeb(1)
}

new MutationObserver(function () {
  var v = st.textContent
  if (/not saved|failed|not published|lost the edit lock|could not|offline|no connection/.test(v) && v != PF.last) {
    PF.last = v
    plog('save', v)
  }
  if (/^saved |^draft saved|^live |^published/.test(v)) {
    PF.last = ''
    PF.log.forEach(function (x) { if (x.t == 'save' && !x.ok) x.ok = Date.now() })
    pdeb()
  }
}).observe(st, { childList: true, characterData: true, subtree: true })

window.addEventListener('error', function (e) { plog('editor', 'the editor hit a problem: ' + e.message) })
window.addEventListener('unhandledrejection', function (e) {
  var r = e.reason || {}
  if (r.name == 'AbortError') return
  plog('save', 'something did not finish: ' + (r.message || r))
})

function srcs(b) {
  var o = []
  ;['src', 'poster', 'di'].forEach(function (k) { if (b[k]) o.push(b[k]) })
  ;(b.items || []).forEach(function (it) { if (it.src) o.push(it.src); if (it.img) o.push(it.img) })
  ;(b.ly || []).forEach(function (L) { if (L.src) o.push(L.src) })
  return o.filter(function (x) { return !/^(https?:|data:|blob:)/.test(x) })
}

function hrefs(b) {
  var o = []
  if (b.href) o.push(b.href)
  ;(b.items || []).forEach(function (it) { if (it.href) o.push(it.href) })
  ;[b.html, b.text].forEach(function (h) {
    ;(h && typeof h == 'object' ? Object.keys(h).map(function (k) { return h[k] }) : [h]).forEach(function (x) {
      String(x || '').replace(/href="([^"]*)"/g, function (m, u) { o.push(u) })
    })
  })
  return o
}

function langs(o, out, path) {
  if (LS.length < 2) return
  for (var k in o) {
    var v = o[k]
    if (!v || typeof v != 'object' || k == 'm') continue
    var ks = Object.keys(v)
    if (ks.length && ks.every(function (x) { return LS.indexOf(x) > -1 })) {
      LS.forEach(function (l) {
        if (!String(v[l] || '').replace(/<[^>]+>/g, '').trim() && String(v[LS[0]] || v[ks[0]] || '').trim()) out.push([k, l])
      })
    } else langs(v, out)
  }
}

function lockover(p, i) {
  var bl = (s.common || []).concat(p.blocks).filter(function (b) { return b.type == 'text' && b.fm == 'lock' }), out = []
  if (!bl.length) return out
  var g = pgd(s, p), hold = document.createElement('div'), box = document.createElement('div'), mb = MOB, gr = GR, pe0 = PEND
  MOB = false
  hold.style.cssText = 'position:absolute;left:-99999px;top:0;width:' + cv.offsetWidth + 'px'
  document.body.appendChild(hold)
  base(hold, s, p)
  hold.appendChild(box)
  grd(box, g)
  auto((s.common || []).concat(p.blocks), g)
  pend((s.common || []).concat(p.blocks), p)
  bl.forEach(function (b) {
    var d = document.createElement('div'), c
    d.className = 'b'
    lay(d, b)
    d.appendChild(bk(b))
    box.appendChild(d)
    bas(d)
    c = d.firstChild
    if (c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1) out.push(b)
  })
  hold.remove()
  MOB = mb
  GR = gr
  PEND = pe0
  return out
}

function nm0(b) {
  return (b.type == 'nav' ? 'menu' : b.type) + (nm(b) ? ' “' + nm(b) + '”' : '')
}

function pscan(net) {
  var out = [], seen = {}, sl = s.pages.map(function (p) { return p.slug || '' })
  function add(lv, m, pi, b) { out.push({ lv: lv, m: m, pi: pi, id: b && b.id }) }
  PF.log.forEach(function (x) {
    if (!x.ok) add('err', x.m + ' (' + new Date(x.at).toLocaleTimeString() + ')')
  })
  s.pages.forEach(function (p, i) {
    var g = pgd(s, p), c = g.cols, pt = tx(p.title) || '/' + (p.slug || '')
    lockover(p, i).forEach(function (b) { add('err', 'text is cut off in a locked box: ' + nm0(b), i, b) })
    var bl = (i ? [] : s.common || []).concat(p.blocks)
    bl.forEach(function (b) {
      var pi = i
      hrefs(b).forEach(function (h) {
        if (h.charAt(0) == '@' && sl.indexOf(h.slice(1)) < 0) add('err', 'links to a page that does not exist (' + h + '): ' + nm0(b), pi, b)
        else if (!h || h == '#') add('warn', 'link goes nowhere yet (#): ' + nm0(b), pi, b)
      })
      if ((b.type == 'image' || b.type == 'video') && !b.src) add('warn', 'empty ' + b.type + ' block, nothing will show', pi, b)
      if (b.type == 'image' && b.src && !tx(b.alt)) add('warn', 'image has no alt text for screen readers: ' + nm0(b), pi, b)
      if (b.type == 'gallery' && !(b.items || []).length) add('warn', 'empty gallery, nothing will show', pi, b)
      if (b.type == 'text' && !String(tx(b.html) || '').replace(/<[^>]+>/g, '').trim()) add('warn', 'empty text box', pi, b)
      ;(b.ly || []).forEach(function (L) { if (L.k != 'grad' && !L.src) add('warn', 'band has an image layer with no image', pi, b) })
      if (!b.fix && b.type != 'band' && b.x + b.w > c) add('warn', nm0(b) + ' runs past the ' + c + ' columns on ' + pt, pi, b)
      var ls = []
      langs({ x: b }, ls)
      ls.forEach(function (x) {
        var k = x[0] + x[1] + b.id
        if (seen[k]) return
        seen[k] = 1
        add('warn', 'no ' + x[1] + ' version of ' + (x[0] == 'html' ? 'the text' : x[0]) + ': ' + nm0(b), pi, b)
      })
      srcs(b).forEach(function (u) {
        if (PV[u]) return
        var r = PF.net[u]
        if (r === 0) add('err', 'missing file ' + u + ': ' + nm0(b), pi, b)
        else if (r > 3e6) add('warn', 'large file, slow to load (' + (r / 1e6).toFixed(1) + ' MB): ' + u.split('/').pop(), pi, b)
      })
    })
    if (!tx(p.title)) add('warn', 'page /' + (p.slug || '') + ' has no title', i)
    else if (LS.length > 1 && typeof p.title == 'object') LS.forEach(function (l) {
      if (!String(p.title[l] || '').trim()) add('warn', 'page ' + pt + ' has no ' + l + ' title', i)
    })
  })
  if (dirt) add('info', 'you have unsaved changes')
  PF.log.forEach(function (x) {
    if (x.ok) add('info', 'fixed: ' + x.m + ' (' + new Date(x.at).toLocaleTimeString() + ')')
  })
  if (net) {
    var all = []
    s.pages.reduce(function (a, p) { return a.concat(p.blocks) }, (s.common || []).slice()).forEach(function (b) { all = all.concat(srcs(b)) })
    if (s.icon) all.push(s.icon)
    all = all.filter(function (u, j) { return all.indexOf(u) == j && !PV[u] && PF.net[u] == null })
    if (all.length) Promise.all(all.map(function (u) {
      return fetch(rp(u), { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        PF.net[u] = r.ok ? +(r.headers.get('content-length') || 1) : 0
      }).catch(function () { PF.net[u] = 0 })
    })).then(function () { pdeb(1) })
  }
  return out
}

function pbadge(ls) {
  var e = ls.filter(function (x) { return x.lv == 'err' }).length, w = ls.filter(function (x) { return x.lv == 'warn' }).length
  pfb.className = e ? 'err' : w ? 'warn' : 'ok'
  pfb.querySelector('span').textContent = e + w || ''
  pfb.title = e || w ? 'preflight: ' + e + ' errors, ' + w + ' warnings' : 'preflight: no problems'
}

function prender(ls) {
  var e = ls.filter(function (x) { return x.lv == 'err' }), w = ls.filter(function (x) { return x.lv == 'warn' }), i = ls.filter(function (x) { return x.lv == 'info' })
  pfp.querySelector('header span').textContent = e.length || w.length ? e.length + ' errors · ' + w.length + ' warnings' : 'no problems'
  var bx = pfp.querySelector('.pfl')
  bx.innerHTML = ''
  ;[['errors', e, 'err'], ['warnings', w, 'warn'], ['notes', i, 'info']].forEach(function (g) {
    if (!g[1].length) return
    var h = document.createElement('h5')
    h.textContent = g[0] + ' (' + g[1].length + ')'
    bx.appendChild(h)
    g[1].forEach(function (x) {
      var r = document.createElement('a')
      r.className = 'pfi ' + g[2]
      r.innerHTML = '<i></i><span></span>' + (x.pi != null ? '<em></em>' : '')
      r.children[1].textContent = x.m
      if (x.pi != null) r.children[2].textContent = tx(s.pages[x.pi].title) || '/' + s.pages[x.pi].slug
      if (x.pi != null) r.onclick = function () {
        pi = x.pi
        CUR = pg().slug || ''
        sel = x.id ? all().filter(function (b) { return b.id == x.id })[0] || null : null
        SS = sel ? [sel] : []
        tbr()
        draw()
        panel()
        var el = sel && elof(sel)
        if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      bx.appendChild(r)
    })
  })
  if (!ls.length) bx.innerHTML = '<p class="pok">everything checks out</p>'
}

function pdeb(now) {
  clearTimeout(ptm)
  ptm = setTimeout(function () {
    if (!s) return
    var ls = pscan()
    pbadge(ls)
    if (!pfp.hidden) prender(ls)
  }, now ? 0 : 1200)
}

pfb.onclick = function () {
  pfp.hidden = !pfp.hidden
  pfb.classList.toggle('open', !pfp.hidden)
  if (!pfp.hidden) {
    var ls = pscan(1)
    pbadge(ls)
    prender(ls)
  }
}
pfp.querySelector('.pfr').onclick = function () {
  PF.net = {}
  var ls = pscan(1)
  pbadge(ls)
  prender(ls)
}
pfp.querySelector('.pfc').onclick = function () {
  PF.log = []
  pdeb(1)
}
pfp.querySelector('.pfx').onclick = function () {
  pfp.hidden = true
  pfb.classList.remove('open')
}
setTimeout(function () { if (s) { pscan(1); pdeb() } }, 1500)
