import { who, team } from '../api/_middleware.js'

export async function onRequestGet(ctx) {
  var em = await who(ctx.request, ctx.env), u = em && team(ctx.env, em)
  if (!u) return new Response('not on the team', { status: 403 })
  var sl = [].concat(ctx.params.p || []).filter(Boolean).join('/').replace(/[^a-z0-9ñ_-]/gi, '')
  var h = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>preview</title>\n' +
    '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="/pg.css">\n</head>\n' +
    '<body data-rt="/" data-p="' + sl + '" data-dr="1">\n<div id="pg"></div>\n<script src="/drw.js"></script>\n<script src="/nx.js"></script>\n</body>\n</html>\n'
  return new Response(h, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })
}
