import { state } from './lock.js'
import { gh, repo, tree } from './photos.js'

async function side(env) {
  var r = await gh(env, '/git/ref/heads/up')
  if (r.object) return r.object.sha
  var m = await gh(env, '/git/ref/heads/' + (env.GH_BRANCH || 'main'))
  await gh(env, '/git/refs', 'POST', { ref: 'refs/heads/up', sha: m.object.sha })
  return m.object.sha
}

export async function onRequestPost(ctx) {
  var env = ctx.env, u = ctx.data.u, st = await state(env.DB, u)
  if (!st.mine) return Response.json(st, { status: 423 })
  var b = await ctx.request.json(), nm = (b.n || 'img').replace(/[^a-z0-9._-]/gi, '-').toLowerCase()
  var i = nm.lastIndexOf('.'), bs = i > 0 ? nm.slice(0, i) : nm, x = i > 0 ? nm.slice(i) : '', n = nm, k = 2
  var have = (await repo(env, true)).concat(Object.keys(await tree(env, 'up')))
  while (have.indexOf('photos/up/' + n) > -1) n = bs + '-' + k++ + x
  var bl = await gh(env, '/git/blobs', 'POST', { content: b.b64, encoding: 'base64' })
  if (!bl.sha) return Response.json({ err: 'github said ' + bl._s + ' ' + (bl.message || '') }, { status: 502 })
  for (var t = 0; t < 3; t++) {
    var head = await side(env), hc = await gh(env, '/git/commits/' + head)
    var nt = await gh(env, '/git/trees', 'POST', { base_tree: hc.tree.sha, tree: [{ path: 'photos/up/' + n, mode: '100644', type: 'blob', sha: bl.sha }] })
    var c = await gh(env, '/git/commits', 'POST', { message: 'photo ' + n, tree: nt.sha, parents: [head], author: { name: u.name, email: u.email } })
    var r = await gh(env, '/git/refs/heads/up', 'PATCH', { sha: c.sha, force: false })
    if (r._s == 200) return Response.json({ path: 'photos/up/' + n, url: '/api/img/up/' + n })
  }
  return Response.json({ err: 'github kept moving, try again' }, { status: 502 })
}
