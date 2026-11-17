function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function html(p, slug, rt) {
  var bl = (s.common || []).concat(p.blocks), box = document.createElement('div'), g = pgd(s, p), bd = document.createElement('div'), bs
  RT = rt
  CUR = slug
  box.id = 'pg'
  grd(box, g)
  plen(box, p, g)
  auto(bl, g)
  pend(bl, p)
  pbg(bd, s, p)
  bs = bd.getAttribute('style')
  var hold = document.createElement('div')
  hold.style.cssText = 'position: absolute; left: -99999px; top: 0; width: ' + cv.offsetWidth + 'px'
  document.body.appendChild(hold)
  base(hold, s, p)
  hold.appendChild(box)
  bl.forEach(function (b) {
    var d = document.createElement('div')
    d.className = 'b'
    lay(d, b)
    d.appendChild(bk(b))
    box.appendChild(d)
  })
  bas(box)
  sdash(box)
  box.querySelectorAll('.c-text.m-fit').forEach(fitx)
  box.querySelectorAll('.c-text.m-lock').forEach(function (c) {
    if ((c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1) && PO.indexOf(tx(p.title)) < 0) PO.push(tx(p.title) || slug || 'home')
  })
  hold.remove()
  return '<!doctype html>\n<html lang="' + LS[0] + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(tx(p.title) || 'ñ press') + '</title>\n' +
    '<link rel="icon" href="' + rt + esc(s.icon || 'assets/favicon.svg') + '">\n' +
    '<link rel="stylesheet" href="' + rt + 'pg.css">\n' +
    '</head>\n<body data-rt="' + rt + '" data-p="' + esc(slug) + '"' + (bs ? ' style="' + esc(bs) + '"' : '') + '>\n' +
    box.outerHTML + '\n' +
    '<script src="' + rt + 'drw.js"></script>\n<script src="' + rt + 'nx.js"></script>\n</body>\n</html>\n'
}

async function put(path, txt) {
  var ps = path.split('/'), d = dir, n = ps.pop()
  for (var x of ps) d = await d.getDirectoryHandle(x, { create: true })
  var w = await (await d.getFileHandle(n, { create: true })).createWritable()
  await w.write(txt)
  await w.close()
}

async function gone(slug) {
  var d
  try {
    d = await dir.getDirectoryHandle(slug)
  } catch (e) {
    return
  }
  for await (var n of d.keys()) if (n != 'index.html') return
  await dir.removeEntry(slug, { recursive: true })
}

var PO = []

function build() {
  var kl = L, km = MOB, kc = CUR, f = {}, now = [], del = []
  PO = []
  L = LS[0]
  MOB = false
  s.pages.forEach(function (p) {
    var sl = p.slug || ''
    f[sl ? sl + '/index.html' : 'index.html'] = html(p, sl, sl ? '../' : '')
    if (sl) now.push(sl)
  })
  f['404.html'] = html({ title: '404', blocks: [nf()] }, '404', s.root || '/')
  ;(s.out || []).forEach(function (o) { if (now.indexOf(o) < 0) del.push(o) })
  L = kl
  MOB = km
  CUR = kc
  RT = ''
  return { f: f, now: now, del: del }
}

async function pub() {
  var b = build()
  for (var k in b.f) await put(k, b.f[k])
  for (var o of b.del) await gone(o)
  s.out = b.now
  draw()
  return s.pages.length
}
