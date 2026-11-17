import { state, mail, link } from './lock.js'

export async function onRequestPost(ctx) {
  var db = ctx.env.DB, u = ctx.data.u
  var r = await db.prepare('SELECT email, ask FROM lck WHERE id = 1').first()
  var m = await db.prepare('UPDATE lck SET ask = ?, askn = ?, askat = ? WHERE id = 1 AND email IS NOT NULL AND email != ?').bind(u.email, u.name, Date.now(), u.email).run()
  if (m.meta.changes && r.ask != u.email) ctx.waitUntil(mail(ctx.env, [r.email], u.name + ' would like to edit the site',
    u.name + ' asked to take over the editor. if you are done, open it and press hand over:\n' + link(ctx.env, 'mastermind') + '\n\nif you just close the editor, it frees up on its own after a few minutes.'))
  return Response.json(await state(db, u))
}
