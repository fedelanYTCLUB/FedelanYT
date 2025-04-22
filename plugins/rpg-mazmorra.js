import { promises as fs } from 'fs'
import path from 'path'


const dungeonSystem = {
  usersData: {},
  dungeons: {
    1: {
      name: "Cueva del Goblín",
      levels: 5,
      boss: "Rey Goblin",
      bossHP: 500,
      minAttack: 10,
      maxAttack: 30,
      reward: { gold: 100, exp: 50, items: ["Espada oxidada", "Poción de vida"] }
    },
    2: {
      name: "Castillo Maldito",
      levels: 10,
      boss: "Lich Oscuro",
      bossHP: 1200,
      minAttack: 25,
      maxAttack: 60,
      reward: { gold: 300, exp: 150, items: ["Báculo maldito", "Armadura espectral"] }
    },
  }
}


async function initUser(userId) {
  if (!dungeonSystem.usersData[userId]) {
    dungeonSystem.usersData[userId] = {
      hp: 100,
      maxHP: 100,
      attack: 15,
      defense: 10,
      level: 1,
      exp: 0,
      gold: 0,
      inventory: [],
      currentDungeon: null,
      currentFloor: 0,
      battlingBoss: false,
      bossHP: 0
    }
    await saveData()
  }
  return dungeonSystem.usersData[userId]
}


async function saveData() {
  const dataPath = path.join(process.cwd(), './src/database/', 'dungeon_data.json')
  await fs.writeFile(dataPath, JSON.stringify(dungeonSystem.usersData, null, 2))
}


async function loadData() {
  try {
    const dataPath = path.join(process.cwd(), './src/database/', 'dungeon_data.json')
    const data = await fs.readFile(dataPath, 'utf-8')
    dungeonSystem.usersData = JSON.parse(data)
  } catch (e) {
    console.log('Creando nueva base de datos...')
    dungeonSystem.usersData = {}
  }
}


const handler = async (m, { conn, usedPrefix, command, args }) => {
  await loadData()
  const userId = m.sender
  const user = await initUser(userId)
  
  const help = `
*⚔️ SISTEMA DE MAZMORRAS RPG ⚔️*

Usa los botones para interactuar o escribe:
→ ${usedPrefix}dungeon list - Lista de mazmorras
→ ${usedPrefix}dungeon status - Tu estado actual
→ ${usedPrefix}dungeon inventory - Tu inventario

¡Embárcate en una aventura épica!
`


  if (args.length === 0) {
    const buttons = [
      { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Lista Mazmorras' }, type: 1 },
      { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Estado' }, type: 1 },
      { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Inventario' }, type: 1 }
    ]
    
    if (user.currentDungeon) {
      if (user.battlingBoss) {
        buttons.push(
          { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Luchar' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Huir' }, type: 1 }
        )
      } else {
        buttons.push(
          { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Explorar' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon leave`, buttonText: { displayText: '🚪 Salir' }, type: 1 }
        )
      }
    } else {
      buttons.push(
        { buttonId: `${usedPrefix}dungeon enter 1`, buttonText: { displayText: '🕳️ Entrar Cueva' }, type: 1 },
        { buttonId: `${usedPrefix}dungeon enter 2`, buttonText: { displayText: '🏰 Entrar Castillo' }, type: 1 }
      )
    }
    
    const buttonMessage = {
      text: help,
      footer: 'Elige una acción',
      buttons: buttons,
      headerType: 1
    }
    
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m })
  }

  switch (args[0]?.toLowerCase()) {
    case 'list':
      let list = '*🏰 MAZMORRAS DISPONIBLES 🏰*\n\n'
      Object.entries(dungeonSystem.dungeons).forEach(([id, dungeon]) => {
        list += `*${id}.* ${dungeon.name}\n`
        list += `⌛ Niveles: ${dungeon.levels}\n`
        list += `👹 Jefe: ${dungeon.boss}\n`
        list += `🎁 Recompensa: ${dungeon.reward.gold} oro, ${dungeon.reward.exp} exp\n`
        list += `📦 Items: ${dungeon.reward.items.join(', ')}\n\n`
      })
      
      const dungeonButtons = Object.keys(dungeonSystem.dungeons).map(id => ({
        buttonId: `${usedPrefix}dungeon enter ${id}`,
        buttonText: { displayText: `Entrar a ${dungeonSystem.dungeons[id].name}` },
        type: 1
      }))
      
      dungeonButtons.push({
        buttonId: `${usedPrefix}dungeon`,
        buttonText: { displayText: '⬅️ Menú Principal' },
        type: 1
      })
      
      const listMessage = {
        text: list,
        footer: 'Elige una mazmorra para entrar',
        buttons: dungeonButtons,
        headerType: 1
      }
      
      return conn.sendMessage(m.chat, listMessage, { quoted: m })
      
    case 'enter':
      if (user.currentDungeon) {
        return conn.sendMessage(m.chat, { 
          text: `Ya estás en la mazmorra ${dungeonSystem.dungeons[user.currentDungeon].name}!`,
          buttons: [
            { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Continuar Explorando' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon leave`, buttonText: { displayText: '🚪 Salir de Mazmorra' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      const dungeonId = args[1]
      if (!dungeonId || !dungeonSystem.dungeons[dungeonId]) {
        return conn.sendMessage(m.chat, { 
          text: 'Especifica un ID de mazmorra válido!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '📜 Ver Mazmorras' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      user.currentDungeon = dungeonId
      user.currentFloor = 1
      user.battlingBoss = false
      await saveData()
      
      return conn.sendMessage(m.chat, {
        text: `Has entrado a *${dungeonSystem.dungeons[dungeonId].name}*!\n\n¿Qué deseas hacer?`,
        buttons: [
          { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Explorar' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Estado' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon leave`, buttonText: { displayText: '🚪 Salir' }, type: 1 }
        ]
      }, { quoted: m })
      
    case 'status':
      const dungeonInfo = user.currentDungeon ? `\n🏰 Mazmorra: ${dungeonSystem.dungeons[user.currentDungeon].name}\n🧱 Piso: ${user.currentFloor}/${dungeonSystem.dungeons[user.currentDungeon].levels}` : ''
      
      const statusText = `
*🧍 ESTADO DEL AVENTURERO 🧍*
❤️ HP: ${user.hp}/${user.maxHP}
⚔️ Ataque: ${user.attack}
🛡️ Defensa: ${user.defense}
🌟 Nivel: ${user.level}
✨ EXP: ${user.exp}
💰 Oro: ${user.gold}
${dungeonInfo}
`.trim()
      
      const statusButtons = [
        { buttonId: `${usedPrefix}dungeon`, buttonText: { displayText: '⬅️ Menú Principal' }, type: 1 }
      ]
      
      if (user.currentDungeon) {
        if (user.battlingBoss) {
          statusButtons.push(
            { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Luchar' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Huir' }, type: 1 }
          )
        } else {
          statusButtons.push(
            { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Explorar' }, type: 1 }
          )
        }
      }
      
      return conn.sendMessage(m.chat, {
        text: statusText,
        buttons: statusButtons
      }, { quoted: m })
      
    case 'explore':
      if (!user.currentDungeon) {
        return conn.sendMessage(m.chat, { 
          text: 'No estás en ninguna mazmorra!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Ver Mazmorras' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      if (user.battlingBoss) {
        return conn.sendMessage(m.chat, { 
          text: 'Estás luchando contra el jefe!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Luchar' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Huir' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      const dungeon = dungeonSystem.dungeons[user.currentDungeon]
      
      if (user.currentFloor >= dungeon.levels) {
        user.battlingBoss = true
        user.bossHP = dungeon.bossHP
        await saveData()
        
        return conn.sendMessage(m.chat, {
          text: `¡Has llegado al final de la mazmorra!\n👹 *${dungeon.boss}* aparece ante ti!\n\nHP del Jefe: ${user.bossHP}\nTus stats: HP ${user.hp}/${user.maxHP}`,
          buttons: [
            { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Atacar' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Huir' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
   
      const events = [
        { type: 'enemy', text: 'Un enemigo te ataca!', damage: Math.floor(Math.random() * 20) + 10 },
        { type: 'treasure', text: 'Encuentras un cofre del tesoro!', gold: Math.floor(Math.random() * 50) + 20 },
        { type: 'nothing', text: 'Exploras el área pero no encuentras nada interesante.' },
        { type: 'heal', text: 'Encuentras una fuente curativa!', heal: Math.floor(Math.random() * 30) + 10 }
      ]
      
      const event = events[Math.floor(Math.random() * events.length)]
      let reply = `Explorando piso ${user.currentFloor}...\n\n${event.text}\n`
      
      switch (event.type) {
        case 'enemy':
          user.hp = Math.max(1, user.hp - event.damage)
          reply += `Recibes ${event.damage} de daño!`
          break
        case 'treasure':
          user.gold += event.gold
          reply += `+${event.gold} oro!`
          break
        case 'heal':
          user.hp = Math.min(user.maxHP, user.hp + event.heal)
          reply += `+${event.heal} HP!`
          break
      }
      
      user.currentFloor++
      await saveData()
      
      return conn.sendMessage(m.chat, {
        text: reply,
        buttons: [
          { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Continuar Explorando' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Ver Estado' }, type: 1 }
        ]
      }, { quoted: m })
      
    case 'fight':
      if (!user.battlingBoss) {
        return conn.sendMessage(m.chat, { 
          text: 'No estás luchando contra ningún jefe!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Explorar' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      const currentDungeon = dungeonSystem.dungeons[user.currentDungeon]
      

      const playerDamage = Math.floor(Math.random() * (user.attack - 5)) + 10
      user.bossHP = Math.max(0, user.bossHP - playerDamage)
      
      let battleText = `⚔️ Atacas a ${currentDungeon.boss} y le causas ${playerDamage} de daño!\n\n`
      
      if (user.bossHP <= 0) {
      
        battleText += `¡Has derrotado a ${currentDungeon.boss}!\n\n`
        battleText += `🎉 RECOMPENSAS:\n`
        battleText += `💰 +${currentDungeon.reward.gold} oro\n`
        battleText += `✨ +${currentDungeon.reward.exp} exp\n`
        battleText += `📦 Items: ${currentDungeon.reward.items.join(', ')}\n\n`
        
        user.gold += currentDungeon.reward.gold
        user.exp += currentDungeon.reward.exp
        user.inventory.push(...currentDungeon.reward.items)
        user.currentDungeon = null
        user.currentFloor = 0
        user.battlingBoss = false
        
      
        const expNeeded = user.level * 100
        if (user.exp >= expNeeded) {
          user.level++
          user.maxHP += 20
          user.hp = user.maxHP
          user.attack += 5
          user.defense += 3
          user.exp = 0
          battleText += `🌟 ¡Subiste al nivel ${user.level}! Stats mejorados!\n`
        }
        
        await saveData()
        
        return conn.sendMessage(m.chat, {
          text: battleText,
          buttons: [
            { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Otra Mazmorra' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Ver Estado' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
  
      const bossDamage = Math.max(1, Math.floor(Math.random() * (currentDungeon.maxAttack - currentDungeon.minAttack)) + currentDungeon.minAttack - user.defense/2)
      user.hp = Math.max(1, user.hp - bossDamage)
      
      battleText += `👹 ${currentDungeon.boss} te ataca y te causa ${bossDamage} de daño!\n\n`
      battleText += `Tus HP: ${user.hp}/${user.maxHP}\n`
      battleText += `HP de ${currentDungeon.boss}: ${user.bossHP}`
      
      await saveData()
      
      return conn.sendMessage(m.chat, {
        text: battleText,
        buttons: [
          { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Atacar de Nuevo' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Huir' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon use Poción de vida`, buttonText: { displayText: '❤️ Usar Poción' }, type: 1 }
        ]
      }, { quoted: m })
      
    case 'run':
      if (!user.battlingBoss) {
        return conn.sendMessage(m.chat, { 
          text: 'No estás en una batalla!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon explore`, buttonText: { displayText: '🔍 Explorar' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      const success = Math.random() > 0.5
      let runText = 'Intentas huir...\n\n'
      
      if (success) {
        runText += '¡Lograste escapar de la mazmorra!\n(Pierdes todas las recompensas)'
        user.currentDungeon = null
        user.currentFloor = 0
        user.battlingBoss = false
      } else {
        const dungeon = dungeonSystem.dungeons[user.currentDungeon]
        const damage = Math.floor(Math.random() * (dungeon.maxAttack - dungeon.minAttack)) + dungeon.minAttack
        user.hp = Math.max(1, user.hp - damage)
        
        runText += `¡El jefe te ataca mientras huyes!\nRecibes ${damage} de daño.\n\n`
        runText += `Tus HP: ${user.hp}/${user.maxHP}`
      }
      
      await saveData()
      
      const runButtons = success ? [
        { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Otra Mazmorra' }, type: 1 }
      ] : [
        { buttonId: `${usedPrefix}dungeon fight`, buttonText: { displayText: '⚔️ Continuar Batalla' }, type: 1 },
        { buttonId: `${usedPrefix}dungeon run`, buttonText: { displayText: '🏃‍♂️ Intentar Huir' }, type: 1 }
      ]
      
      return conn.sendMessage(m.chat, {
        text: runText,
        buttons: runButtons
      }, { quoted: m })
      
    case 'inventory':
      if (user.inventory.length === 0) {
        return conn.sendMessage(m.chat, { 
          text: 'Tu inventario está vacío!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Explorar Mazmorras' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      let invText = '🎒 *INVENTARIO* 🎒\n\n'
      const itemCount = {}
      
      user.inventory.forEach(item => {
        itemCount[item] = (itemCount[item] || 0) + 1
      })
      
      Object.entries(itemCount).forEach(([item, count]) => {
        invText += `▢ ${item} x${count}\n`
      })
      
    
      const itemButtons = Object.keys(itemCount)
        .filter(item => item.toLowerCase().includes('poción'))
        .map(item => ({
          buttonId: `${usedPrefix}dungeon use ${item}`,
          buttonText: { displayText: `Usar ${item}` },
          type: 1
        }))
      
      itemButtons.push({
        buttonId: `${usedPrefix}dungeon`,
        buttonText: { displayText: '⬅️ Menú Principal' },
        type: 1
      })
      
      return conn.sendMessage(m.chat, {
        text: invText,
        buttons: itemButtons
      }, { quoted: m })
      
    case 'use':
      const itemName = args.slice(1).join(' ')
      if (!itemName) {
        return conn.sendMessage(m.chat, { 
          text: 'Especifica qué item quieres usar!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Ver Inventario' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      const itemIndex = user.inventory.findIndex(item => item.toLowerCase() === itemName.toLowerCase())
      if (itemIndex === -1) {
        return conn.sendMessage(m.chat, { 
          text: 'No tienes ese item en tu inventario!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Ver Inventario' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
    
      if (itemName.toLowerCase().includes('poción de vida')) {
        const healAmount = 50
        user.hp = Math.min(user.maxHP, user.hp + healAmount)
        user.inventory.splice(itemIndex, 1)
        await saveData()
        
        return conn.sendMessage(m.chat, {
          text: `Usaste ${itemName} y recuperaste ${healAmount} HP! (${user.hp}/${user.maxHP})`,
          buttons: [
            { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Inventario' }, type: 1 },
            { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Estado' }, type: 1 }
          ]
        }, { quoted: m })
      } else {
        user.inventory.splice(itemIndex, 1)
        await saveData()
        
        return conn.sendMessage(m.chat, {
          text: `Usaste ${itemName}, pero no tuvo ningún efecto especial.`,
          buttons: [
            { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Inventario' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
    case 'leave':
      if (!user.currentDungeon) {
        return conn.sendMessage(m.chat, { 
          text: 'No estás en ninguna mazmorra!',
          buttons: [
            { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Ver Mazmorras' }, type: 1 }
          ]
        }, { quoted: m })
      }
      
      user.currentDungeon = null
      user.currentFloor = 0
      user.battlingBoss = false
      await saveData()
      
      return conn.sendMessage(m.chat, {
        text: 'Has abandonado la mazmorra. Puedes entrar a otra cuando quieras.',
        buttons: [
          { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Ver Mazmorras' }, type: 1 }
        ]
      }, { quoted: m })
      
    default:
      return conn.sendMessage(m.chat, { 
        text: help,
        buttons: [
          { buttonId: `${usedPrefix}dungeon list`, buttonText: { displayText: '🏰 Mazmorras' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon status`, buttonText: { displayText: '🧍 Estado' }, type: 1 },
          { buttonId: `${usedPrefix}dungeon inventory`, buttonText: { displayText: '🎒 Inventario' }, type: 1 }
        ]
      }, { quoted: m })
  }
}

handler.help = ['dungeon']
handler.tags = ['rpg']
handler.command = ['dungeon', 'mazmorra']
handler.register = true
export default handler
