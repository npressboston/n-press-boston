var MADE = false, EM = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i

export async function mksub(db) {
  if (MADE) return
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS subs (em TEXT PRIMARY KEY, nm TEXT, lg TEXT, src TEXT, st TEXT NOT NULL, ct TEXT, at INTEGER, cf INTEGER, un INTEGER, tk TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS rl (h TEXT, at INTEGER)')
  ])
  MADE = true
}

async function hash(v) {
  var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v))
  return [...new Uint8Array(b)].map(function (x) { return x.toString(16).padStart(2, '0') }).join('')
}

function no(m, s) {
  return Response.json({ err: m }, { status: s || 400 })
}

export async function onRequestPost(ctx) {
  var rq = ctx.request, db = ctx.env.DB, u = new URL(rq.url), o = rq.headers.get('origin')
  if (o && new URL(o).host != u.host) return no('wrong site', 403)
  var b = await rq.json().catch(function () { return null })
  if (!b) return no('bad request')
  if (b.w || Date.now() - (+b.t || 0) < 2000) return Response.json({ ok: 1 })
  var em = String(b.em || '').trim().toLowerCase()
  if (em.length > 254 || !EM.test(em)) return no('email')
  await mksub(db)
  var now = Date.now(), ip = rq.headers.get('cf-connecting-ip') || '', h = await hash(ip + new Date().toISOString().slice(0, 10))
  var n = await db.prepare('SELECT COUNT(*) AS n FROM rl WHERE h = ? AND at > ?').bind(h, now - 36e5).first()
  if (n && n.n >= 30) return no('slow down', 429)
  var tk = await hash(crypto.randomUUID() + em)
  await db.batch([
    db.prepare('INSERT INTO rl (h, at) VALUES (?, ?)').bind(h, now),
    db.prepare('DELETE FROM rl WHERE at < ?').bind(now - 864e5),
    db.prepare("INSERT INTO subs (em, nm, lg, src, st, ct, at, tk) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?) ON CONFLICT(em) DO UPDATE SET st = CASE WHEN subs.st IN ('unsub', 'bounced', 'complained') THEN 'pending' ELSE subs.st END, nm = COALESCE(NULLIF(subs.nm, ''), excluded.nm), ct = CASE WHEN subs.st IN ('unsub', 'bounced', 'complained') THEN excluded.ct ELSE subs.ct END")
      .bind(em, String(b.nm || '').trim().slice(0, 80), String(b.lg || '').slice(0, 5), 'web: /' + String(b.p || '').slice(0, 60), String(b.ct || '').slice(0, 300), now, tk.slice(0, 32))
  ])
  return Response.json({ ok: 1 })
}
