var KS = null, KT = 0, MADE = false

function b64(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return atob(s)
}

function bin(s) {
  var t = b64(s), u = new Uint8Array(t.length)
  for (var i = 0; i < t.length; i++) u[i] = t.charCodeAt(i)
  return u
}

async function keys(env) {
  if (KS && Date.now() - KT < 3600e3) return KS
  var r = await fetch('https://' + env.ACCESS_TEAM + '.cloudflareaccess.com/cdn-cgi/access/certs')
  KS = (await r.json()).keys
  KT = Date.now()
  return KS
}

export async function who(req, env) {
  if (env.DEV_USER) return env.DEV_USER
  var j = req.headers.get('cf-access-jwt-assertion')
  if (!j || !env.ACCESS_TEAM || !env.ACCESS_AUD) return null
  var pt = j.split('.'), hd = JSON.parse(b64(pt[0])), pl = JSON.parse(b64(pt[1]))
  var k = (await keys(env)).filter(function (x) { return x.kid == hd.kid })[0]
  if (!k) return null
  var key = await crypto.subtle.importKey('jwk', k, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
  var ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, bin(pt[2]), new TextEncoder().encode(pt[0] + '.' + pt[1]))
  if (!ok || pl.exp * 1000 < Date.now() || [].concat(pl.aud).indexOf(env.ACCESS_AUD) < 0) return null
  return pl.email
}

export function team(env, em) {
  em = em.toLowerCase()
  if (!env.TEAM) return { email: em, name: em.split('@')[0], pub: true }
  var p = env.TEAM.split(/[\n,]+/).map(function (x) { return x.trim().split(/\s+/) }).filter(function (x) { return x[0] && x[0].toLowerCase() == em })[0]
  if (!p) return null
  return { email: em, name: p.slice(1).filter(function (x) { return x != 'pub' && x != 'quiet' }).join(' ') || em.split('@')[0], pub: p.indexOf('pub') > 0 }
}

export async function make(db) {
  if (MADE) return
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS draft (id INTEGER PRIMARY KEY, v INTEGER NOT NULL, body TEXT NOT NULL, email TEXT, name TEXT, at INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS lck (id INTEGER PRIMARY KEY, email TEXT, name TEXT, since INTEGER, beat INTEGER, act INTEGER, ask TEXT, askn TEXT, askat INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS log (t INTEGER, email TEXT, name TEXT, what TEXT)'),
    db.prepare('INSERT OR IGNORE INTO lck (id) VALUES (1)')
  ])
  MADE = true
}

export async function onRequest(ctx) {
  var em = await who(ctx.request, ctx.env)
  var u = em && team(ctx.env, em)
  if (!u) return new Response(JSON.stringify({ err: 'not on the team' }), { status: 403, headers: { 'content-type': 'application/json' } })
  await make(ctx.env.DB)
  ctx.data.u = u
  var r = await ctx.next()
  r = new Response(r.body, r)
  r.headers.set('cache-control', 'no-store')
  return r
}
