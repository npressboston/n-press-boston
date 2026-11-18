var MEM = null, MT = 0, TZ0 = 'America/New_York', DW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

function un(v) {
  return v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1')
}

function lines(t) {
  return t.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)
}

function prop(l) {
  var i = -1, q = false
  for (var j = 0; j < l.length; j++) {
    if (l[j] == '"') q = !q
    if (l[j] == ':' && !q) { i = j; break }
  }
  if (i < 0) return null
  var hd = l.slice(0, i).split(';'), pa = {}
  hd.slice(1).forEach(function (x) {
    var k = x.indexOf('=')
    if (k > 0) pa[x.slice(0, k).toUpperCase()] = x.slice(k + 1).replace(/^"|"$/g, '')
  })
  return { k: hd[0].toUpperCase(), p: pa, v: l.slice(i + 1) }
}

function off(ms, tz) {
  var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
  var o = {}
  f.formatToParts(new Date(ms)).forEach(function (x) { o[x.type] = +x.value })
  return Date.UTC(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second) - ms
}

function wall(w, tz) {
  var g = Date.UTC(w[0], w[1], w[2], w[3], w[4], w[5]), u = g - off(g, tz)
  return g - off(u, tz)
}

function parts(v) {
  var m = /^(\d{4})(\d\d)(\d\d)(?:T(\d\d)(\d\d)(\d\d)?(Z)?)?/.exec(v)
  if (!m) return null
  return { w: [+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)], d: !m[4], z: !!m[7] }
}

function when(pr, tz) {
  var x = parts(pr.v)
  if (!x) return null
  var t = x.z ? Date.UTC.apply(null, x.w) : wall(x.w, x.d ? tz : pr.p.TZID || tz)
  return { t: t, w: x.w, d: x.d, tz: x.z ? 'UTC' : pr.p.TZID || tz }
}

function step(w, f, n) {
  var d = new Date(Date.UTC(w[0], w[1], w[2]))
  if (f == 'DAILY') d.setUTCDate(d.getUTCDate() + n)
  if (f == 'WEEKLY') d.setUTCDate(d.getUTCDate() + 7 * n)
  if (f == 'MONTHLY') d = new Date(Date.UTC(w[0], w[1] + n, 1))
  if (f == 'YEARLY') d = new Date(Date.UTC(w[0] + n, w[1], 1))
  return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), w[3], w[4], w[5]]
}

function days(y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate() }

function inmonth(y, m, r, d0) {
  var n = days(y, m), out = []
  if (r.BYMONTHDAY) r.BYMONTHDAY.split(',').forEach(function (x) {
    x = +x
    var d = x < 0 ? n + x + 1 : x
    if (d >= 1 && d <= n) out.push(d)
  })
  else if (r.BYDAY) r.BYDAY.split(',').forEach(function (x) {
    var mm = /^([+-]?\d+)?([A-Z]{2})$/.exec(x)
    if (!mm) return
    var wd = DW.indexOf(mm[2]), all = []
    for (var d = 1; d <= n; d++) if (new Date(Date.UTC(y, m, d)).getUTCDay() == wd) all.push(d)
    if (!mm[1]) out = out.concat(all)
    else {
      var k = +mm[1], d = k > 0 ? all[k - 1] : all[all.length + k]
      if (d) out.push(d)
    }
  })
  else if (d0 <= n) out.push(d0)
  return out.sort(function (a, b) { return a - b })
}

function rec(ev, from, to) {
  var r = {}
  ev.rr.split(';').forEach(function (x) { var k = x.split('='); r[k[0]] = k[1] })
  var f = r.FREQ, iv = +(r.INTERVAL || 1), cn = r.COUNT ? +r.COUNT : 1e9, un0 = r.UNTIL ? when({ v: r.UNTIL, p: {} }, ev.s.tz) : null
  if (un0 && un0.d) un0.t += 864e5 - 1
  var w0 = ev.s.w, out = [], n = 0, ln = ev.e - ev.s.t
  if (['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].indexOf(f) < 0) return [ev.s.t]
  for (var i = 0; i < 2000 && n < cn; i++) {
    var w = step(w0, f, i * iv), ws = []
    if (f == 'DAILY') ws = [w]
    if (f == 'WEEKLY') {
      var bd = r.BYDAY ? r.BYDAY.split(',').map(function (x) { return DW.indexOf(x.slice(-2)) }) : [new Date(Date.UTC(w0[0], w0[1], w0[2])).getUTCDay()]
      var sw = new Date(Date.UTC(w[0], w[1], w[2])), wk = DW.indexOf(r.WKST || 'MO')
      sw.setUTCDate(sw.getUTCDate() - ((sw.getUTCDay() - wk + 7) % 7))
      for (var k = 0; k < 7; k++) {
        var dd = new Date(sw.getTime() + k * 864e5)
        if (bd.indexOf(dd.getUTCDay()) > -1) ws.push([dd.getUTCFullYear(), dd.getUTCMonth(), dd.getUTCDate(), w0[3], w0[4], w0[5]])
      }
    }
    if (f == 'MONTHLY') ws = inmonth(w[0], w[1], r, w0[2]).map(function (d) { return [w[0], w[1], d, w0[3], w0[4], w0[5]] })
    if (f == 'YEARLY') {
      var ms = r.BYMONTH ? r.BYMONTH.split(',').map(function (x) { return x - 1 }) : [w0[1]]
      ms.forEach(function (m) {
        inmonth(w[0], m, r.BYDAY || r.BYMONTHDAY ? r : {}, w0[2]).forEach(function (d) { ws.push([w[0], m, d, w0[3], w0[4], w0[5]]) })
      })
    }
    for (var j = 0; j < ws.length && n < cn; j++) {
      var t = ev.s.tz == 'UTC' ? Date.UTC.apply(null, ws[j]) : wall(ws[j], ev.s.tz)
      if (t < ev.s.t) continue
      if (un0 && t > un0.t) return out
      n++
      if (t + ln >= from && t <= to) out.push(t)
    }
    if (ws.length && (ev.s.tz == 'UTC' ? Date.UTC.apply(null, ws[0]) : wall(ws[0], ev.s.tz)) > to) break
  }
  return out
}

function txt(v) {
  return String(v || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n').replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, function (m, h, t) {
    t = t.replace(/<[^>]+>/g, '')
    return t == h || !t ? h : t + ' ' + h
  }).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim()
}

export function parse(ics, now) {
  var ls = lines(ics), evs = [], cur = null, dep = 0, tz = TZ0
  ls.forEach(function (l) {
    if (/^X-WR-TIMEZONE:/i.test(l)) tz = l.split(':')[1].trim() || tz
    if (l == 'BEGIN:VEVENT') { cur = { ex: [] }; dep = 0; return }
    if (!cur) return
    if (/^BEGIN:/.test(l)) { dep++; return }
    if (/^END:/.test(l) && dep) { dep--; return }
    if (l == 'END:VEVENT') { evs.push(cur); cur = null; return }
    if (dep) return
    var p = prop(l)
    if (!p) return
    if (p.k == 'DTSTART' || p.k == 'DTEND' || p.k == 'RECURRENCE-ID') cur[p.k] = p
    else if (p.k == 'EXDATE') p.v.split(',').forEach(function (v) { cur.ex.push({ v: v, p: p.p }) })
    else if (p.k == 'RRULE') cur.rr = p.v
    else if (p.k == 'ATTACH') cur.at = (cur.at || []).concat([{ v: p.v, p: p.p }])
    else cur[p.k] = un(p.v)
  })
  var from = now - 400 * 864e5, to = now + 400 * 864e5, out = [], ov = {}
  evs.forEach(function (e) {
    if (!e.DTSTART || (e.STATUS || '').toUpperCase() == 'CANCELLED' && !e['RECURRENCE-ID']) return
    e.s = when(e.DTSTART, tz)
    if (!e.s) return
    var en = e.DTEND && when(e.DTEND, tz)
    e.e = en ? en.t : e.s.t + (e.s.d ? 864e5 : 36e5)
    if (e['RECURRENCE-ID']) {
      var rid = when(e['RECURRENCE-ID'], tz)
      if (rid) ov[e.UID + '@' + rid.t] = e
    }
  })
  evs.forEach(function (e) {
    if (!e.s || e['RECURRENCE-ID'] || (e.STATUS || '').toUpperCase() == 'CANCELLED') return
    var ex = e.ex.map(function (x) { var w = when(x, tz); return w && w.t })
    var ts = e.rr ? rec(e, from, to) : e.e >= from && e.s.t <= to ? [e.s.t] : []
    ts.forEach(function (t) {
      if (ex.indexOf(t) > -1) return
      var o = ov[e.UID + '@' + t], x = o || e
      if (o && (o.STATUS || '').toUpperCase() == 'CANCELLED') return
      var st = o ? o.s.t : t, ed = o ? o.e : t + (e.e - e.s.t)
      out.push(mk(x, st, ed, x.s.d, e.UID + (e.rr ? '-' + t : '')))
    })
  })
  return out.sort(function (a, b) { return a.s - b.s })
}

function mk(e, s, en, ad, id) {
  var d = txt(e.DESCRIPTION), img = '', u = e.URL || ''
  d = d.replace(/(^|\s)(https?:\/\/\S+\.(?:jpe?g|png|gif|webp|avif)(?:\?\S*)?)(?=\s|$)/i, function (m, a, h) {
    if (!img) img = h
    return img == h ? a : m
  }).trim()
  ;(e.at || []).forEach(function (a) {
    if (!img && /^image\//.test(a.p.FMTTYPE || '') && /^https?:/.test(a.v)) img = a.v
  })
  var o = { id: id, t: e.SUMMARY || '', s: s, e: en }
  if (ad) o.ad = 1
  if (e.LOCATION) o.loc = e.LOCATION
  if (d) o.d = d
  if (u) o.u = u
  if (img) o.img = img
  return o
}

export async function onRequestGet(ctx) {
  var env = ctx.env, h = { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' }
  if (!env.GCAL_ICS) return new Response(JSON.stringify({ demo: 1 }), { headers: h })
  if (MEM && Date.now() - MT < 600e3) return new Response(MEM, { headers: h })
  try {
    var r = await fetch(env.GCAL_ICS, { cf: { cacheTtl: 300 } })
    if (!r.ok) throw new Error(r.status)
    MEM = JSON.stringify({ ev: parse(await r.text(), Date.now()), at: Date.now() })
    MT = Date.now()
  } catch (e) {
    if (!MEM) return new Response(JSON.stringify({ ev: [], err: 1 }), { headers: h })
  }
  return new Response(MEM, { headers: h })
}
