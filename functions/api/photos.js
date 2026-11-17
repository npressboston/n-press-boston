var CA = null, CT = 0, MED = /\.(jpe?g|png|gif|webp|svg|avif|mp4|webm|mov|m4v)$/i

export async function gh(env, path, method, body, raw) {
  var r = await fetch((env.GH_API || 'https://api.github.com') + '/repos/' + env.GH_REPO + path, {
    method: method || 'GET',
    headers: { authorization: 'Bearer ' + env.GH_TOKEN, 'user-agent': 'n-press-site', accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json', 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (raw) return r.ok ? r.text() : null
  var j = await r.json().catch(function () { return {} })
  j._s = r.status
  return j
}

export async function tree(env, ref) {
  var t = await gh(env, '/git/trees/' + ref + '?recursive=1')
  var m = {}
  ;(t.tree || []).forEach(function (x) { if (x.type == 'blob') m[x.path] = x.sha })
  return m
}

export async function repo(env, fresh) {
  if (!env.GH_TOKEN || !env.GH_REPO) return []
  if (fresh || !CA || Date.now() - CT > 60e3) {
    var t = await gh(env, '/git/trees/' + (env.GH_BRANCH || 'main') + '?recursive=1')
    CA = (t.tree || []).filter(function (x) { return x.type == 'blob' }).map(function (x) { return x.path })
    CT = Date.now()
  }
  return CA
}

export async function onRequestGet(ctx) {
  var env = ctx.env, seen = {}, out = []
  ;(await repo(env)).forEach(function (p) {
    if (p.indexOf('photos/') == 0 && MED.test(p)) { seen[p] = 1; out.push({ p: p }) }
  })
  var u = await tree(env, 'up')
  Object.keys(u).forEach(function (p) {
    if (p.indexOf('photos/up/') == 0 && !seen[p]) out.push({ p: p, u: '/api/img/' + p.slice(7) })
  })
  return Response.json(out)
}
