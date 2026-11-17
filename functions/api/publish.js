import { state, log, mail, crew, link } from './lock.js'
import { gh, repo, tree } from './photos.js'

export async function onRequestPost(ctx) {
  var env = ctx.env, db = env.DB, u = ctx.data.u, st = await state(db, u)
  if (!st.mine) return Response.json(st, { status: 423 })
  if (!u.pub) return Response.json({ err: 'you can edit but not publish' }, { status: 403 })
  var b = await ctx.request.json(), row = await db.prepare('SELECT v FROM draft WHERE id = 1').first()
  if ((row ? row.v : 0) != b.v) return Response.json({ err: 'the draft changed, try again', v: row && row.v }, { status: 409 })
  var have = await repo(env, true), br = env.GH_BRANCH || 'main', msg = (b.note || 'site update').trim() + '\n\npublished by ' + u.name
  var tr = Object.keys(b.files).map(function (p) { return { path: p, mode: '100644', type: 'blob', content: b.files[p] } })
  var side = (b.pend || []).length ? await tree(env, 'up') : {}
  for (var p of b.pend || []) {
    if (!side[p]) return Response.json({ err: 'the photo ' + p + ' is missing, upload it again' }, { status: 409 })
    tr.push({ path: p, mode: '100644', type: 'blob', sha: side[p] })
  }
  ;(b.del || []).forEach(function (p) { if (have.indexOf(p) > -1) tr.push({ path: p, mode: '100644', type: 'blob', sha: null }) })
  var done = null
  for (var i = 0; i < 3 && !done; i++) {
    var ref = await gh(env, '/git/ref/heads/' + br), head = ref.object && ref.object.sha
    if (!head) return Response.json({ err: 'github said ' + ref._s + ' ' + (ref.message || '') }, { status: 502 })
    var hc = await gh(env, '/git/commits/' + head)
    var nt = await gh(env, '/git/trees', 'POST', { base_tree: hc.tree.sha, tree: tr })
    if (!nt.sha) return Response.json({ err: 'github said ' + nt._s + ' ' + (nt.message || '') }, { status: 502 })
    var c = await gh(env, '/git/commits', 'POST', { message: msg, tree: nt.sha, parents: [head], author: { name: u.name, email: u.email } })
    var up = await gh(env, '/git/refs/heads/' + br, 'PATCH', { sha: c.sha, force: false })
    if (up._s == 200) done = c.sha
  }
  if (!done) return Response.json({ err: 'github kept moving, try again' }, { status: 502 })
  var body = JSON.stringify(JSON.parse(b.files['site.json'])), now = Date.now(), m
  if (row) m = await db.prepare('UPDATE draft SET v = v + 1, body = ?, email = ?, name = ?, at = ? WHERE id = 1 AND v = ?').bind(body, u.email, u.name, now, b.v).run()
  else await db.prepare('INSERT INTO draft (id, v, body, email, name, at) VALUES (1, 1, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(body, u.email, u.name, now).run()
  await log(db, u, 'published: ' + (b.note || ''))
  ctx.waitUntil(mail(env, crew(env).filter(function (e) { return e != u.email }), u.name + ' published the ñ press site',
    u.name + ' published: ' + (b.note || 'site update') + '\n\nit is live in about a minute: ' + link(env, '')))
  return Response.json({ sha: done, v: b.v + 1, at: now })
}
