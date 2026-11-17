var lw = document.getElementById('lib'), lgr = lw.querySelector('.lg'), lcb = null
var IM = /\.(jpe?g|png|gif|webp|svg|avif)$/i, VD = /\.(mp4|webm|mov|m4v)$/i

async function walk(d, p, out) {
  for await (var [n, h] of d.entries()) {
    if (n.charAt(0) == '.') continue
    if (h.kind == 'directory') await walk(h, p + n + '/', out)
    else if (IM.test(n) || VD.test(n)) out.push(p + n)
  }
  return out
}

async function lib(cb) {
  lcb = cb
  if (!dir && !TM) await opn()
  lw.hidden = false
  lgr.textContent = 'loading...'
  var fs, last = null
  if (TM) {
    fs = (await (await fetch('api/photos')).json()).map(function (x) {
      if (x.u) PV[x.p] = x.u
      return x.p
    }).sort()
  } else fs = (await walk(await dir.getDirectoryHandle('photos', { create: true }), 'photos/', [])).sort()
  lgr.innerHTML = ''
  if (!fs.length) lgr.textContent = 'no photos yet, upload some'
  fs.forEach(function (p) {
    var f = p.slice(0, p.lastIndexOf('/'))
    if (f != last) {
      var h = document.createElement('h5')
      h.textContent = f.replace(/^photos\/?/, '').replace(/_/g, ' ') || 'photos'
      lgr.appendChild(h)
      last = f
    }
    var a = document.createElement('a'), m = document.createElement(VD.test(p) ? 'video' : 'img')
    a.title = p.split('/').pop()
    m.src = PV[p] || p
    if (m.tagName == 'IMG') m.loading = 'lazy'
    else m.muted = true
    a.appendChild(m)
    a.onclick = function () {
      lw.hidden = true
      if (lcb) lcb(p)
    }
    lgr.appendChild(a)
  })
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

async function tup(files) {
  var out = []
  for (var f of files) {
    if (!IM.test(f.name) && !VD.test(f.name)) continue
    st.textContent = 'uploading ' + f.name
    var nm = clean(f.name), bl = await shrink(f)
    if (bl.type == 'image/jpeg' && nm[1] != '.jpg' && nm[1] != '.jpeg') nm[1] = '.jpg'
    var b64 = await new Promise(function (ok) {
      var fr = new FileReader()
      fr.onload = function () { ok(fr.result.slice(fr.result.indexOf(',') + 1)) }
      fr.readAsDataURL(bl)
    })
    var r = await fetch('api/up', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ n: nm[0] + nm[1], b64: b64 }) })
    if (!r.ok) { st.textContent = 'upload failed for ' + f.name; continue }
    var j = await r.json()
    PV[j.path] = j.url
    s.pend = s.pend || []
    s.pend.push(j.path)
    out.push(j.path)
  }
  st.textContent = out.length + ' uploaded, they go live when you publish'
  return out
}

async function up(files) {
  if (TM) return tup(files)
  if (!dir) await opn()
  var d = await (await dir.getDirectoryHandle('photos', { create: true })).getDirectoryHandle('up', { create: true })
  var out = []
  for (var f of files) {
    if (!IM.test(f.name) && !VD.test(f.name)) continue
    st.textContent = 'uploading ' + f.name
    var nm = clean(f.name), bl = await shrink(f)
    if (bl.type == 'image/jpeg' && nm[1] != '.jpg' && nm[1] != '.jpeg') nm[1] = '.jpg'
    var n = await free(d, nm[0], nm[1])
    var w = await (await d.getFileHandle(n, { create: true })).createWritable()
    await w.write(bl)
    await w.close()
    PV['photos/up/' + n] = URL.createObjectURL(bl)
    out.push('photos/up/' + n)
  }
  st.textContent = out.length + ' uploaded to photos/up'
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
  await up(this.files)
  this.value = ''
  lib(lcb)
}

document.getElementById('wr').ondragover = function (e) { e.preventDefault() }
document.getElementById('wr').ondrop = async function (e) {
  e.preventDefault()
  if (RO) return
  if (!e.dataTransfer.files.length) return
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
