import { state, log } from './lock.js'
import { gh } from './photos.js'

export async function onRequestPost(ctx) {
  var env = ctx.env, db = env.DB, u = ctx.data.u, st = await state(db, u)
  if (!st.mine) return Response.json(st, { status: 423 })
  var b = await ctx.request.json()
  if (!/^[0-9a-f]{7,40}$/.test(b.sha || '')) return Response.json({ err: 'bad version' }, { status: 400 })
  var t = await gh(env, '/contents/site.json?ref=' + b.sha, 'GET', null, 1)
  var cur = await gh(env, '/contents/site.json?ref=' + (env.GH_BRANCH || 'main'), 'GET', null, 1)
  if (!t) return Response.json({ err: 'not found' }, { status: 404 })
  var s = JSON.parse(t)
  s.out = cur ? JSON.parse(cur).out || [] : s.out
  delete s.pend
  var row = await db.prepare('SELECT v FROM draft WHERE id = 1').first(), now = Date.now(), body = JSON.stringify(s)
  if (row) await db.prepare('UPDATE draft SET v = v + 1, body = ?, email = ?, name = ?, at = ? WHERE id = 1').bind(body, u.email, u.name, now).run()
  else await db.prepare('INSERT INTO draft (id, v, body, email, name, at) VALUES (1, 1, ?, ?, ?, ?)').bind(body, u.email, u.name, now).run()
  await log(db, u, 'restored ' + b.sha.slice(0, 7))
  return Response.json({ v: (row ? row.v : 0) + 1 })
}
