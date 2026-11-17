import { gh } from './photos.js'

export async function onRequestGet(ctx) {
  var sha = new URL(ctx.request.url).searchParams.get('sha') || ''
  if (!/^[0-9a-f]{7,40}$/.test(sha)) return Response.json({ err: 'bad version' }, { status: 400 })
  var t = await gh(ctx.env, '/contents/site.json?ref=' + sha, 'GET', null, 1)
  if (!t) return Response.json({ err: 'not found' }, { status: 404 })
  return Response.json({ s: JSON.parse(t) })
}
