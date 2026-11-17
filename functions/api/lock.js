var IDLE = 600e3, GONE = 180e3

export async function state(db, u) {
  var r = await db.prepare('SELECT * FROM lck WHERE id = 1').first(), now = Date.now()
  var on = r.email && now - r.beat < GONE && now - r.act < IDLE
  return {
    me: u.email,
    mine: !!on && r.email == u.email,
    holder: on ? { email: r.email, name: r.name, since: r.since, act: r.act } : null,
    ask: on && r.ask ? { email: r.ask, name: r.askn, at: r.askat } : null
  }
}

export function crew(env) {
  return (env.TEAM || '').split(/[\n,]+/).map(function (x) { return x.trim().split(/\s+/) }).filter(function (x) { return x[0] && x[0].indexOf('@') > 0 && x.indexOf('quiet') < 0 }).map(function (x) { return x[0].toLowerCase() })
}

export async function mail(env, to, sub, txt) {
  if (!env.MAIL_KEY || !env.MAIL_FROM || !to.length) return
  await fetch(env.MAIL_API || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.MAIL_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: to, subject: sub, text: txt })
  }).catch(function () {})
}

export function link(env, p) {
  return (env.SITE_URL || '').replace(/\/$/, '') + '/' + p
}

export async function log(db, u, w) {
  await db.prepare('INSERT INTO log (t, email, name, what) VALUES (?, ?, ?, ?)').bind(Date.now(), u.email, u.name, w).run()
}

export async function onRequestGet(ctx) {
  return Response.json(await state(ctx.env.DB, ctx.data.u))
}

export async function onRequestPost(ctx) {
  var db = ctx.env.DB, u = ctx.data.u, now = Date.now(), q = new URL(ctx.request.url).searchParams
  var b = q.get('free') ? { free: 1 } : await ctx.request.json().catch(function () { return {} })
  if (b.free) {
    await db.prepare('UPDATE lck SET email = NULL, name = NULL, ask = NULL, askn = NULL WHERE id = 1 AND email = ?').bind(u.email).run()
  } else if (b.give) {
    var r = await db.prepare('SELECT ask, askn FROM lck WHERE id = 1 AND email = ?').bind(u.email).first()
    if (r && r.ask) {
      await db.prepare('UPDATE lck SET email = ask, name = askn, since = ?, beat = ?, act = ?, ask = NULL, askn = NULL WHERE id = 1').bind(now, now, now).run()
      await log(db, u, 'handed over to ' + r.askn)
    }
  } else if (b.keep) {
    await db.prepare('UPDATE lck SET ask = NULL, askn = NULL WHERE id = 1 AND email = ?').bind(u.email).run()
  } else {
    var m = await db.prepare('UPDATE lck SET beat = ?, act = CASE WHEN ? THEN ? ELSE act END WHERE id = 1 AND email = ? AND beat > ? AND act > ?').bind(now, b.act ? 1 : 0, now, u.email, now - GONE, now - IDLE).run()
    if (!m.meta.changes) {
      var c = await db.prepare('UPDATE lck SET email = ?, name = ?, since = ?, beat = ?, act = ?, ask = NULL, askn = NULL WHERE id = 1 AND (email IS NULL OR beat < ? OR act < ?)').bind(u.email, u.name, now, now, now, now - GONE, now - IDLE).run()
      if (c.meta.changes) {
        var rec = await db.prepare("SELECT t FROM log WHERE email = ? AND what = 'started editing' AND t > ?").bind(u.email, now - 72e5).first()
        await log(db, u, 'started editing')
        if (!rec) ctx.waitUntil(mail(ctx.env, crew(ctx.env).filter(function (e) { return e != u.email }), u.name + ' started editing the ñ press site',
          u.name + ' opened the editor and is making changes. nothing goes live until someone publishes.\n\nwatch the draft: ' + link(ctx.env, 'preview/') + '\neditor: ' + link(ctx.env, 'mastermind')))
      }
    }
  }
  return Response.json(await state(db, u))
}
