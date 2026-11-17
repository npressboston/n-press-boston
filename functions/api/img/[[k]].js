var TY = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', avif: 'image/avif', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', m4v: 'video/mp4' }

export async function onRequestGet(ctx) {
  var env = ctx.env, k = [].concat(ctx.params.k).join('/')
  if (!/^up\/[a-z0-9._-]+$/.test(k)) return new Response('not found', { status: 404 })
  var r = await fetch((env.GH_API || 'https://api.github.com') + '/repos/' + env.GH_REPO + '/contents/photos/' + k + '?ref=up', {
    headers: { authorization: 'Bearer ' + env.GH_TOKEN, 'user-agent': 'n-press-site', accept: 'application/vnd.github.raw' }
  })
  if (!r.ok) return new Response('not found', { status: 404 })
  return new Response(r.body, { headers: { 'content-type': TY[k.split('.').pop()] || 'application/octet-stream', 'cache-control': 'private, max-age=3600' } })
}
