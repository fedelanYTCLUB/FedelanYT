let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = globalThis.db.data.users[m.sender]
  let tiempo = 5 * 60
  
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `💙 Debes esperar ${tiempo2} para trabajar de nuevo en este Grupo.`, m)
    return
  }
  
  let rsl = Math.floor(Math.random() * 5000)
  cooldowns[m.sender] = Date.now()
  
  
  const monedaText = globalThis.monedas || "XP"
  
  await conn.reply(m.chat, `💙 ${pickRandom(trabajo)} ${toNum(rsl)} ( ${rsl} ) ${monedaText}💫.`, m)
  
  
  user.exp += rsl
}

handler.help = ['w', 'work']
handler.tags = ['rpg']
handler.command = ['w','work']
handler.register = true
export default handler
