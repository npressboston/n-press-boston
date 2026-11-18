import { mksub } from '../join.js'

export async function onRequestGet(ctx) {
  await mksub(ctx.env.DB)
  var r = await ctx.env.DB.prepare('SELECT k, v, by, at FROM cfg').all(), o = {}
  ;(r.results || []).forEach(function (x) { o[x.k] = x })
  return Response.json(o)
}

export async function onRequestPost(ctx) {
  var b = await ctx.request.json().catch(function () { return {} }), u = ctx.data.u
  if (['rloff'].indexOf(b.k) < 0) return Response.json({ err: 'unknown setting' }, { status: 400 })
  await mksub(ctx.env.DB)
  await ctx.env.DB.prepare('INSERT INTO cfg (k, v, by, at) VALUES (?, ?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, by = excluded.by, at = excluded.at').bind(b.k, b.v ? '1' : '0', u.name, Date.now()).run()
  return Response.json({ ok: 1 })
}
