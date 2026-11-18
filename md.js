var lw = document.getElementById('lib'), lgr = lw.querySelector('.lg'), lcb = null
var IM = /\.(jpe?g|png|gif|webp|svg|avif)$/i, VD = /\.(mp4|webm|mov|m4v)$/i

var LF0 = 'photos', LXF = [], LALL = []
try { LF0 = localStorage.getItem('lf') || 'photos' } catch (e) {}

async function walk(d, p, out, ds) {
  for await (var [n, h] of d.entries()) {
    if (n.charAt(0) == '.') continue
    if (h.kind == 'directory') {
      ds.push(p + n)
      await walk(h, p + n + '/', out, ds)
    } else if (IM.test(n) || VD.test(n)) out.push(p + n)
  }
  return out
}

function lfolds() {
  var f = { photos: 1 }
  LALL.forEach(function (p) {
    var s0 = p.split('/')
    for (var i = 2; i < s0.length; i++) f[s0.slice(0, i).join('/')] = 1
  })
  LXF.forEach(function (x) {
    var s0 = x.split('/')
    for (var i = 1; i <= s0.length; i++) f[s0.slice(0, i).join('/')] = 1
  })
  return Object.keys(f).sort(function (x, y) { return x.toLowerCase() < y.toLowerCase() ? -1 : 1 })
}

function lnm(f) {
  return f == 'photos' ? 'all folders' : f.split('/').pop().replace(/_/g, ' ')
}

function lgo(f) {
  LF0 = f
  try { localStorage.setItem('lf', f) } catch (e) {}
  lrend()
  lgr.scrollTop = 0
}

function lrend() {
  var fs = lfolds(), lt = lw.querySelector('.lt'), bc = lw.querySelector('.lbc')
  if (fs.indexOf(LF0) < 0) LF0 = 'photos'
  lt.innerHTML = ''
  fs.forEach(function (f) {
    var a = document.createElement('a'), d = f.split('/').length - 1, n = LALL.filter(function (p) { return p.slice(0, p.lastIndexOf('/')) == f }).length
    a.className = f == LF0 ? 'on' : ''
    a.style.paddingLeft = 10 + d * 12 + 'px'
    a.innerHTML = '<span></span><i></i>'
    a.firstChild.textContent = lnm(f)
    a.lastChild.textContent = n || ''
    a.onclick = function () { lgo(f) }
    lt.appendChild(a)
  })
  bc.innerHTML = ''
  LF0.split('/').forEach(function (x, i, all) {
    var f = all.slice(0, i + 1).join('/'), a = document.createElement('a')
    a.textContent = lnm(f)
    a.onclick = function () { lgo(f) }
    if (i) bc.appendChild(document.createTextNode(' / '))
    bc.appendChild(a)
  })
  lgr.innerHTML = ''
  fs.filter(function (f) { return f.slice(0, f.lastIndexOf('/')) == LF0 }).forEach(function (f) {
    var a = document.createElement('a'), n = LALL.filter(function (p) { return p.indexOf(f + '/') == 0 }).length
    a.className = 'fd'
    a.innerHTML = '<b></b><i></i>'
    a.firstChild.textContent = lnm(f)
    a.lastChild.textContent = n + (n == 1 ? ' photo' : ' photos')
    a.onclick = function () { lgo(f) }
    lgr.appendChild(a)
  })
  var here = LALL.filter(function (p) { return p.slice(0, p.lastIndexOf('/')) == LF0 })
  here.forEach(function (p) {
    var a = document.createElement('a'), m = document.createElement(VD.test(p) ? 'video' : 'img')
    a.title = p.split('/').pop()
    m.src = PV[p] || p
    if (m.tagName == 'IMG') {
      m.loading = 'lazy'
      m.decoding = 'async'
    } else {
      m.muted = true
      m.preload = 'metadata'
    }
    a.appendChild(m)
    a.onclick = function () {
      lw.hidden = true
      if (lcb) lcb(p)
      else lput(p)
    }
    lgr.appendChild(a)
  })
  if (!lgr.children.length) lgr.innerHTML = '<p class="le">nothing here yet. upload photos into this folder</p>'
  lw.querySelector('.lhint').textContent = lcb ? 'click a photo to use it' : 'click a photo to put it on the page'
}

function lput(p) {
  add(VD.test(p) ? 'video' : 'image')
  sel.src = p
  dirty(); draw(); panel()
}

async function lib(cb) {
  lcb = cb
  if (!dir && !TM) await opn()
  lw.hidden = false
  lgr.textContent = 'loading...'
  if (TM) {
    LALL = (await (await fetch('api/photos')).json()).map(function (x) {
      if (x.u) PV[x.p] = x.u
      return x.p
    }).sort()
  } else {
    var ds = []
    LALL = (await walk(await dir.getDirectoryHandle('photos', { create: true }), 'photos/', [], ds)).sort()
    ds.forEach(function (d) { if (LXF.indexOf(d) < 0) LXF.push(d) })
  }
  Object.keys(PV).forEach(function (p) { if (p.indexOf('photos/') == 0 && LALL.indexOf(p) < 0) LALL.push(p) })
  lrend()
}

function lfold(n) {
  return n.split('/').map(function (x) { return x.replace(/[’‘]/g, "'").replace(/[^A-Za-z0-9 _'-]/g, '').trim().replace(/\s+/g, '_') }).filter(Boolean).join('/')
}

function clean(n) {
  var i = n.lastIndexOf('.'), b = i > 0 ? n.slice(0, i) : n, x = i > 0 ? n.slice(i).toLowerCase() : ''
  b = b.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'img'
  return [b, x]
}

async function free(d, b, x) {
  var n = b + x, k = 2
  while (true) {
    try {
      await d.getFileHandle(n)
      n = b + '-' + k++ + x
    } catch (e) {
      return n
    }
  }
}

async function shrink(f) {
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return f
  var im = await createImageBitmap(f), mx = 2400, sc = Math.min(1, mx / Math.max(im.width, im.height))
  if (sc == 1 && f.size < 1500000) return f
  var c = document.createElement('canvas')
  c.width = Math.round(im.width * sc)
  c.height = Math.round(im.height * sc)
  c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
  var ty = f.type == 'image/png' ? 'image/png' : 'image/jpeg'
  return new Promise(function (ok) { c.toBlob(ok, ty, .85) })
}

async function tup(files, f) {
  var out = []
  for (var fl of files) {
    if (!IM.test(fl.name) && !VD.test(fl.name)) continue
    st.textContent = 'uploading ' + fl.name
    var nm = clean(fl.name), bl = await shrink(fl)
    if (bl.type == 'image/jpeg' && nm[1] != '.jpg' && nm[1] != '.jpeg') nm[1] = '.jpg'
    var b64 = await new Promise(function (ok) {
      var fr = new FileReader()
      fr.onload = function () { ok(fr.result.slice(fr.result.indexOf(',') + 1)) }
      fr.readAsDataURL(bl)
    })
    var r = await fetch('api/up', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ n: nm[0] + nm[1], b64: b64, f: (f || 'photos/up').slice(7) }) })
    if (!r.ok) { st.textContent = 'upload failed for ' + fl.name; continue }
    var j = await r.json()
    PV[j.path] = j.url
    s.pend = s.pend || []
    s.pend.push(j.path)
    out.push(j.path)
  }
  st.textContent = out.length + ' uploaded, they go live when you publish'
  return out
}

async function up(files, f) {
  f = f || 'photos/up'
  if (TM) return tup(files, f)
  if (!dir) await opn()
  var d = dir
  for (var sg of f.split('/')) d = await d.getDirectoryHandle(sg, { create: true })
  var out = []
  for (var fl of files) {
    if (!IM.test(fl.name) && !VD.test(fl.name)) continue
    st.textContent = 'uploading ' + fl.name
    var nm = clean(fl.name), bl = await shrink(fl)
    if (bl.type == 'image/jpeg' && nm[1] != '.jpg' && nm[1] != '.jpeg') nm[1] = '.jpg'
    var n = await free(d, nm[0], nm[1])
    var w = await (await d.getFileHandle(n, { create: true })).createWritable()
    await w.write(bl)
    await w.close()
    PV[f + '/' + n] = URL.createObjectURL(bl)
    out.push(f + '/' + n)
  }
  st.textContent = out.length + ' uploaded to ' + f
  return out
}

function upk(cb) {
  var i = document.createElement('input')
  i.type = 'file'
  i.multiple = true
  i.accept = 'image/*,video/*'
  i.onchange = async function () { cb(await up(i.files)) }
  i.click()
}

lw.querySelector('.lh a').onclick = function () { lw.hidden = true }
lw.onclick = function (e) { if (e.target == lw) lw.hidden = true }
lw.querySelector('input').onchange = async function () {
  var ps = await up(this.files, LF0 == 'photos' ? 'photos/up' : LF0)
  this.value = ''
  ps.forEach(function (p) { if (LALL.indexOf(p) < 0) LALL.push(p) })
  if (LF0 == 'photos' && ps.length) LF0 = 'photos/up'
  LALL.sort()
  lrend()
}
lw.querySelector('.lnf').onclick = async function () {
  var n = prompt('new folder inside ' + lnm(LF0))
  if (!n || !(n = lfold(n))) return
  var f = LF0 + '/' + n
  if (LXF.indexOf(f) < 0) LXF.push(f)
  if (!TM && dir) {
    var d = dir
    for (var sg of f.split('/')) d = await d.getDirectoryHandle(sg, { create: true })
  }
  lgo(f)
}
document.getElementById('phb').onclick = function () { lib(null) }

document.getElementById('wr').ondragover = function (e) { e.preventDefault() }
document.getElementById('wr').ondrop = async function (e) {
  e.preventDefault()
  if (RO) return
  if (!e.dataTransfer.files.length) return
  var mqd = e.target.closest && e.target.closest('.b.t-marquee'), mqb = mqd && all().filter(function (x) { return x.id == mqd.bid })[0]
  if (mqb) {
    var mp = await up(e.dataTransfer.files)
    mp.filter(function (p) { return !VD.test(p) }).forEach(function (p) { mqimg(mqb, p) })
    return
  }
  var g = pgd(s, pg()), c = cols(g), r = cv.getBoundingClientRect()
  var cw = (r.width - g.pad * 2 - g.gap * (c - 1)) / c + g.gap, rh = g.row
  var x = Math.max(0, Math.floor((e.clientX - r.left - g.pad) / cw)), y = Math.max(0, Math.floor((e.clientY - r.top - g.pad) / rh))
  var ps = await up(e.dataTransfer.files)
  ps.forEach(function (p, i) {
    var v = VD.test(p), b = { id: Math.random().toString(36).slice(2, 8), type: v ? 'video' : 'image', src: p, w: Math.min(4, c), h: 10 }
    b.x = Math.min(x, c - b.w)
    b.y = y + i * 11
    if (MOB) b.m = { x: b.x, y: b.y, w: b.w, h: b.h }
    pg().blocks.push(b)
    sel = b
  })
  if (ps.length) { dirty(); draw(); panel() }
}

document.addEventListener('keydown', function (e) {
  if (e.key == 'Escape' && !lw.hidden) lw.hidden = true
})
