import { mksub } from '../join.js'

export async function onRequestGet(ctx) {
  await mksub(ctx.env.DB)
  var r = await ctx.env.DB.prepare('SELECT em, nm, lg, src, st, ct, at, cf, un FROM subs ORDER BY at DESC').all()
  return Response.json(r.results || [])
}
