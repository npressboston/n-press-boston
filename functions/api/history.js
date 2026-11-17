import { gh } from './photos.js'

export async function onRequestGet(ctx) {
  var r = await gh(ctx.env, '/commits?path=site.json&per_page=40&sha=' + (ctx.env.GH_BRANCH || 'main'))
  if (!Array.isArray(r)) return Response.json({ err: 'github said ' + r._s }, { status: 502 })
  return Response.json(r.map(function (c) {
    return { sha: c.sha, msg: c.commit.message.split('\n')[0], by: c.commit.author.name, at: c.commit.author.date }
  }))
}
