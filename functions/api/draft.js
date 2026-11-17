import { state, log } from './lock.js'

export async function onRequestGet(ctx) {
  var r = await ctx.env.DB.prepare('SELECT v, body, name, at FROM draft WHERE id = 1').first()
  if (!r) return Response.json({ v: 0, s: null })
  return Response.json({ v: r.v, s: JSON.parse(r.body), by: r.name, at: r.at })
}

async function put(ctx) {
  var db = ctx.env.DB, u = ctx.data.u, now = Date.now()
  var st = await state(db, u)
  if (!st.mine) return Response.json(st, { status: 423 })
  var b = await ctx.request.json(), body = JSON.stringify(b.s), m
  if (!b.v) m = await db.prepare('INSERT INTO draft (id, v, body, email, name, at) VALUES (1, 1, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(body, u.email, u.name, now).run()
  else m = await db.prepare('UPDATE draft SET v = v + 1, body = ?, email = ?, name = ?, at = ? WHERE id = 1 AND v = ?').bind(body, u.email, u.name, now, b.v).run()
  if (!m.meta.changes) {
    var r = await db.prepare('SELECT v, name, at FROM draft WHERE id = 1').first()
    return Response.json({ v: r.v, by: r.name, at: r.at }, { status: 409 })
  }
  await db.prepare('UPDATE lck SET act = ?, beat = ? WHERE id = 1 AND email = ?').bind(now, now, u.email).run()
  return Response.json({ v: (b.v || 0) + 1, at: now })
}

export var onRequestPut = put
export var onRequestPost = put

export async function onRequestDelete(ctx) {
  var db = ctx.env.DB, u = ctx.data.u, st = await state(db, u)
  if (!st.mine) return Response.json(st, { status: 423 })
  await db.prepare('DELETE FROM draft WHERE id = 1').run()
  await log(db, u, 'threw away the draft')
  return Response.json({ v: 0 })
}
