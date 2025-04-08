let media = './src/Grupo.jpg'
let handler = async (m, { conn, command }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
   // await conn.sendMessage(m.chat, { react: { text: '⚡️', key: m.key } })
 await m.react('⚡️')
let str = `*💙 GRUPO OFICIAL*

   *🎵⊹⋆𝓗𝓪𝓽𝓼𝓾𝓷𝓮 𝓜𝓲𝓴𝓾⋆⊹🎵*
  ┃🧸❏ ${gp4}

   *💙🌱HATSUNE MIKU OFICIAL GROUP🌱💙*
┃🧸❏ https://chat.whatsapp.com/HEuy1hZCPmX1WaJ6zffQuV
   
   *_Canal Oficial_*
┃💙❏ https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o
`
await conn.sendButton(m.chat, str, `͟͞(っ◔◡◔)っ 𝕄𝕚𝕜𝕦-ℂ𝕙𝕒𝕟 💙🎵\n` + wm, media, [
['Menu Lista 💙', '/lista']], null, [
['(っ◔◡◔)っ 𝕄𝕚𝕜𝕦-ℂ𝕙𝕒𝕟 💙🎵', `${md}`]], fkontak)}
                      
handler.command = ['grupos','linksk','gruposofc','gruposoficiales']
handler.register = true
handler.exp = 33

export default handler