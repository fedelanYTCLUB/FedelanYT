let handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user) return conn.reply(m.chat, `*💙 No se encontraron datos para eliminar*`, m, rcanal)

  let username = user.name || m.name || m.sender.split('@')[0]

  delete global.db.data.users[m.sender]
  
  global.db.write()

  return conn.reply(m.chat, `*💙${username}, todos tus datos han sido eliminados completamente de mi base de datos*\n*• XP, nivel, monedas, registros y otros datos personales han sido borrados*`, m, rcanal)
}
handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true
export default handler
