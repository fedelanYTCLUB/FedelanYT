import fetch from 'node-fetch'
import db from '../lib/database.js'
let img = 'https://static.wikia.nocookie.net/ficcion-sin-limites/images/a/a3/S.jpg/revision/latest?cb=20221014161424&path-prefix=es'
let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return m.react('✖️')
   if (!(who in global.db.data.users)) return m.reply(`*💙 El usuario no se encuentra en mi base de datos*`)
   let user = global.db.data.users[who]
   let name = conn.getName(who);
   let txt = (`${who == m.sender ? `╭━〔  ${global.packname}  〕⬣\n┋ *Usuario:* ${name}\n┋ *Cebollines En Cartera*: ${user.chocolates}\n┋ *Cebollines En Banco*: ${user.bank}\n┋ *Experiencia:* ${user.exp}\n┋ *Nivel:* ${user.level}\n┋ *Rol:* ${user.role}\n┋ *Fecha:* ${new Date().toLocaleString('id-ID')}\n╰━━━━━━━━━━━━⬣` : `╭━〔  ${global.packname}  〕⬣\n┋ *Usuario:* @${who.split('@')[0]}\n┋ *Cebollines En Cartera*: ${user.chocolates}\n┋ *Cebollines En Banco*: ${user.bank}\n┋ *Experiencia:* ${user.exp}\n┋ *Nivel:* ${user.level}\n┋ *Rol:* ${user.role}\n┋ *Fecha:* ${new Date().toLocaleString('id-ID')}\n╰━━━━━━━━━━━━⬣`}`)
await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, {mentions: [who] }, rcanal)
}

handler.help = ['bank']
handler.tags = ['rpg']
handler.command = ['bank', 'banco'] 
handler.register = true 
export default handler 
