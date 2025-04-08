let handler = async (m, { conn, command, usedPrefix }) => {
let staff = `💙 *EQUIPO DE AYUDANTES*
💙 *Bot:* ${global.botname}
✨️ *Versión:* ${global.vs}

👑 *Propietario:*

• (ㅎㅊDEPOOLㅊㅎ)
💮 *Rol:* Propietario
💙 *Número:* wa.me/51988514570
🌱 *GitHub:* https://github.com/Brauliovh3

💮  *Colaboradores:*

• RAFAEL
💮 *Rol:* Junior
💙 *Número:* Wa.me/51939508653
`
await conn.sendFile(m.chat, icons, 'miku.jpg', staff.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `🌱 Developers 👑`,
body: `💙 Staff Oficial`,
mediaType: 1,
sourceUrl: redes,
thumbnailUrl: icono
}}
}, { mentions: m.sender })
m.react(emoji)

}
handler.help = ['staff']
handler.command = ['colaboradores', 'staff']
handler.register = true
handler.tags = ['main']

export default handler
