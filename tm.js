var DV = 0, svT, busy = false, again = false, ed2 = false, mine = false, stop = false
var lk = document.getElementById('lk')

function when(t) {
  return new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function hm(t) {
  return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

async function team() {
  try {
    var r = await fetch('api/me')
    if (!r.ok || !/json/.test(r.headers.get('content-type') || '')) return false
    TM = await r.json()
    return !!TM.email
  } catch (e) {
    return false
  }
}

async function post(u, b) {
  var r = await fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) })
  return r.json()
}

async function grabd() {
  var d = await (await fetch('api/draft')).json()
  if (d.s) {
    s = d.s
    DV = d.v
  } else {
    s = await (await fetch('site.json?' + Date.now())).json()
    DV = 0
  }
  ;(s.pend || []).forEach(function (p) { PV[p] = 'api/img/' + p.slice(7) })
  sel = null
  SS = []
  setup()
  LAST = JSON.stringify(s)
  UN = []
  RE = []
  return d
}

async function tload() {
  document.body.classList.add('tm')
  fb()
  var sv = document.getElementById('sv'), pv = document.getElementById('pv')
  sv.textContent = 'publish'
  sv.onclick = tpub
  if (!TM.pub) {
    sv.disabled = true
    sv.title = 'you can edit, but someone else has to publish'
  }
  document.getElementById('vw').textContent = 'live site'
  pv.onclick = async function () {
    await flush()
    window.open('preview/' + (pg().slug ? pg().slug + '/' : ''), 'npreview')
  }
  var d = await grabd()
  st.textContent = d.s ? 'draft by ' + d.by + ', ' + when(d.at) : 'no draft yet, this is the live site'
  apply(await post('api/lock', { take: 1 }), 1)
  setInterval(beat, 20000)
}

function ro(on) {
  RO = on
  document.body.classList.toggle('ro', on)
  pn.inert = on
  if (on && sel) pick(null)
}

async function apply(x, first) {
  if (stop) return
  var was = mine
  mine = x.mine
  ro(!mine)
  if (mine && !was && !first) {
    await grabd()
    st.textContent = 'you are editing now'
  }
  var h = ''
  if (!mine && x.holder) {
    h = '<b></b> is editing since ' + hm(x.holder.since) + '. you can look around but not change anything. '
    h += x.ask && x.ask.email == TM.email ? '<i>asked, waiting for an answer</i>' : '<button data-a="ask">ask to take over</button>'
  } else if (!mine) {
    h = 'nobody is editing. <button data-a="take">start editing</button>'
  } else if (x.ask) {
    h = '<b></b> wants to edit. <button data-a="give">hand over</button> <button data-a="keep">keep editing</button>'
  }
  lk.hidden = !h
  document.body.classList.toggle('lkon', !!h)
  lk.innerHTML = h
  var b = lk.querySelector('b')
  if (b) b.textContent = (mine ? x.ask : x.holder).name
}

async function beat() {
  if (stop) return
  try {
    apply(await post('api/lock', mine ? { beat: 1, act: ed2 } : { take: 1 }))
    ed2 = false
  } catch (e) {
    st.textContent = 'offline, trying again'
  }
}

function qs() {
  if (RO || stop) return
  dirt = true
  ed2 = true
  st.textContent = 'unsaved'
  clearTimeout(svT)
  svT = setTimeout(push, 1000)
}

async function push() {
  if (stop) return
  if (busy) { again = true; return }
  busy = true
  svT = null
  var body = JSON.stringify({ v: DV, s: s }), r
  st.textContent = 'saving draft...'
  try {
    r = await fetch('api/draft', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: body })
  } catch (e) {
    r = null
  }
  busy = false
  if (!r) {
    st.textContent = 'not saved, no connection. retrying'
    svT = setTimeout(push, 5000)
    return
  }
  var j = await r.json()
  if (r.ok) {
    DV = j.v
    if (!again) {
      dirt = false
      st.textContent = 'draft saved ' + hm(j.at) + ', not published yet'
    }
  } else if (r.status == 409) {
    stop = true
    ro(true)
    st.textContent = 'not saved'
    lk.hidden = false
    document.body.classList.add('lkon')
    lk.innerHTML = (j.by == TM.name ? 'you saved a newer draft in another tab' : 'someone saved a newer draft (' + (j.by || '?') + ', ' + hm(j.at) + ')') + ' so your last change was not saved. <button data-a="reload">reload</button>'
    return
  } else if (r.status == 423) {
    st.textContent = 'you lost the edit lock, your last change was not saved'
    dirt = false
    apply(j)
  } else {
    st.textContent = 'not saved (' + r.status + '), retrying'
    svT = setTimeout(push, 5000)
  }
  if (again) {
    again = false
    push()
  }
}

async function flush() {
  if (svT) clearTimeout(svT)
  if (dirt) await push()
}

var HS = null

async function tpub() {
  if (RO || !TM.pub) return
  await flush()
  if (dirt) return
  var note = prompt('what changed? this goes in the history and to the team', '')
  if (note == null) return
  var id = Math.random().toString(36).slice(2, 10), pend = s.pend || [], old = s.pub, oo = s.out
  st.textContent = 'publishing...'
  s.pub = id
  delete s.pend
  var b = build()
  s.out = b.now
  b.f['site.json'] = JSON.stringify(s, null, 2) + '\n'
  var r2 = await fetch('api/publish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ v: DV, files: b.f, pend: pend, del: b.del.map(function (x) { return x + '/index.html' }), note: note }) })
  var j2 = await r2.json()
  if (!r2.ok) {
    s.pub = old
    s.out = oo
    if (pend.length) s.pend = pend
    st.textContent = 'not published: ' + (j2.err || r2.status)
    if (r2.status == 423) apply(j2)
    return
  }
  DV = j2.v
  LAST = JSON.stringify(s)
  dirt = false
  HS = null
  draw()
  panel()
  st.textContent = 'published, going live...'
  live(id, Date.now())
}

async function live(id, t0) {
  var j = await fetch('site.json?' + Date.now()).then(function (r) { return r.json() }).catch(function () { return {} })
  if (j.pub == id) return st.textContent = 'live ' + hm(Date.now()) + (PO.length ? ' · text cut off on: ' + PO.join(', ') : '')
  if (Date.now() - t0 > 300e3) return st.textContent = 'published, but cloudflare has not put it live yet. check the cloudflare dashboard'
  setTimeout(function () { live(id, t0) }, 5000)
}

async function tback() {
  if (RO || !confirm('throw away every unpublished change and go back to what is live now?')) return
  if (svT) clearTimeout(svT)
  var r = await fetch('api/draft', { method: 'DELETE' })
  if (!r.ok) return apply(await r.json())
  dirt = false
  await grabd()
  st.textContent = 'draft thrown away, this is the live site'
}

async function hist2() {
  var r = await fetch('api/history')
  HS = r.ok ? await r.json() : []
  if (!sel) panel()
}

async function rest(sha) {
  if (RO || !confirm('make this old version the draft? the live site stays the same until you publish')) return
  await flush()
  var r = await fetch('api/restore', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sha: sha }) })
  if (!r.ok) return st.textContent = 'could not restore'
  await grabd()
  st.textContent = 'old version restored as the draft. check it, then publish'
}

function tpanel() {
  hd('draft')
  btn('preview draft', function () { document.getElementById('pv').click() })
  if (!RO) btn('throw away draft', tback, ' ')
  hd('published versions')
  if (!HS) {
    nt('loading...')
    hist2()
    return
  }
  if (!HS.length) nt('nothing published from here yet')
  HS.slice(0, 15).forEach(function (h) {
    var r = document.createElement('div'), a = document.createElement('a'), b = document.createElement('a')
    r.className = 'hs'
    r.innerHTML = '<span></span><small></small>'
    r.firstChild.textContent = h.msg
    r.children[1].textContent = h.by + ', ' + when(h.at)
    a.textContent = 'preview'
    a.href = 'preview/?v=' + h.sha
    a.target = 'npreview'
    b.textContent = 'restore'
    b.onclick = function () { rest(h.sha) }
    r.appendChild(a)
    if (!RO) r.appendChild(b)
    pn.appendChild(r)
  })
}

lk.onclick = async function (e) {
  var a = e.target.dataset.a
  if (!a) return
  if (a == 'reload') return location.reload()
  if (a == 'ask') return apply(await post('api/ask'))
  if (a == 'give') await flush()
  apply(await post('api/lock', a == 'give' ? { give: 1 } : a == 'keep' ? { keep: 1 } : { take: 1 }))
}

window.addEventListener('pagehide', function () {
  if (!TM || !mine) return
  if (dirt) fetch('api/draft', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ v: DV, s: s }), keepalive: true })
  navigator.sendBeacon('api/lock?free=1')
})

team().then(function (ok) { ok ? tload() : local() })
