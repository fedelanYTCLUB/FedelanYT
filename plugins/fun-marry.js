import fs from 'fs';
import path from 'path';


const marriagesFile = path.resolve('./src/database/casados.json');


let proposals = {};

/**
 * 
 * @returns {Object} Marriages data
 */
function loadMarriages() {
  if (fs.existsSync(marriagesFile)) {
    const data = fs.readFileSync(marriagesFile, 'utf8');
    return JSON.parse(data);
  } else {
    return {};
  }
}

/**
 * 
 * @param {Object} marriages The marriages data to save
 */
function saveMarriages(marriages) {
  fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2));
}


let marriages = loadMarriages();

/**
 * 
 * @returns {boolean} 
 */
function isMeguminBotMD() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    if (packageJson.name !== 'HATSUNE MIKU') return false;
    if (packageJson.repository.url !== 'git+https://github.com/David-Chian/Megumin-Bot-MD.git') return false;
    return true;
  } catch (error) {
    console.error('Error al leer package.json:', error);
    return false;
  }
}


let handler = async (m, { conn, command, usedPrefix, args }) => {
  
  if (!isMeguminBotMD()) {
    await m.reply('💙 Este comando solo es funcional en: Hatsunemiku.\nhttps://github.com/David-Chian/Megumin-Bot-MD');
    return;
  }

  
  const isMarry = /^(marry)$/i.test(command);
  const isDivorce = /^(divorce)$/i.test(command);

  /**
   * 
   * @param {Error} error The error to handle
   */
  async function handleError(error) {
    await m.reply('❗️ Ocurrió un error.');
    console.log(error);
  }

  switch (true) {
    case isMarry:
      
      let userData = global.db.data.users[m.sender];
      
      
      if (userData.age < 18) {
        await m.reply('💙 Debes ser mayor de 18 años para casarte.');
        return;
      }

      
      let senderJid = m.sender;
      
      
      if (marriages[senderJid]) {
        await conn.reply(
          m.chat,
          `💙 Ya estás casado/a con *@${marriages[senderJid].split('@')[0]}*\n> Puedes divorciarte con el comando: *#divorce*`,
          m,
          { mentions: [marriages[senderJid]] }
        );
        return;
      }

      
      if (!m.mentionedJid || m.mentionedJid.length === 0) {
        await conn.reply(
          m.chat,
          `💙 Debes mencionar a alguien para aceptar o proponer matrimonio.\n> Ejemplo » *${usedPrefix + command} @${conn.user.jid.split('@')[0]}*`,
          m,
          { mentions: [conn.user.jid] }
        );
        return;
      }

      
      let mentionedJid = m.mentionedJid[0];
      
      
      if (marriages[mentionedJid]) {
        await conn.reply(
          m.chat,
          `✧ @${mentionedJid.split('@')[0]} ya está casado/a con: *@${marriages[mentionedJid].split('@')[0]}*\n> Puedes proponer matrimonio a otra persona.`,
          m,
          { mentions: [mentionedJid, marriages[mentionedJid]] }
        );
        return;
      }

      
      if (senderJid === mentionedJid) {
        await m.reply('💙 ¡No puedes proponerte matrimonio a ti mismo!');
        return;
      }

      
      if (proposals[mentionedJid] && proposals[mentionedJid] === senderJid) {
        // Delete the proposal
        delete proposals[mentionedJid];
        
        // Get user names
        let senderName = conn.getName(senderJid);
        let mentionedName = conn.getName(mentionedJid);
        
        
        marriages[senderJid] = mentionedJid;
        marriages[mentionedJid] = senderJid;
        saveMarriages(marriages);
        
        
        global.db.data.users[senderJid].marry = mentionedName;
        global.db.data.users[mentionedJid].marry = senderName;
        
        
        await conn.reply(
          m.chat,
          `💙.･:｡≻───── ⋆♡⋆ ───── ⋆♡⋆ ─────.•:｡✩\n¡Se han Casado! ฅ^•ﻌ•^ฅ*:･ﾟ✧\n\n*•.¸♡ Esposo/a @${senderJid.split('@')[0]} ♡¸.•*\n*•.¸♡ Esposo/a @${mentionedJid.split('@')[0]} ♡¸.•*\n\n\`Disfruten de su luna de miel\`\n\n✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩`,
          m,
          { mentions: [senderJid, mentionedJid] }
        );
      } else {
        
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
        proposals[senderJid] = mentionedJid;
        
        await conn.reply(
          m.chat,
          `♡ @${who.split`@`[0]} te ha propuesto matrimonio, ¿aceptas?\n> ✐ Aceptar » *${usedPrefix + command}* @${senderJid.split('@')[0]}`,
          m,
          { mentions: [senderJid, who] }
        );
      }
      break;

    case isDivorce:
      
      let divorceJid = m.sender;
      
     
      if (!marriages[divorceJid]) {
        await m.reply('💙 Tú no estás casado/a con nadie.');
        return;
      }
      
      
      let partnerJid = marriages[divorceJid];
      
      
      delete marriages[divorceJid];
      delete marriages[partnerJid];
      saveMarriages(marriages);
      
      
      let divorceName = conn.getName(divorceJid);
      let partnerName = conn.getName(partnerJid);
      
      
      global.db.data.users[divorceJid].marry = '';
      global.db.data.users[partnerJid].marry = '';
      
      
      await conn.reply(
        m.chat,
        `💔 @${divorceJid.split('@')[0]} y @${partnerJid.split('@')[0]} se han divorciado.`,
        m,
        { mentions: [divorceJid, partnerJid] }
      );
      break;
  }
};


handler.tags = ['rg'];
handler.help = ['marry *@usuario*', 'divorce'];
handler.command = ['marry', 'divorce', 'divorciarse'];
handler.group = true;
handler.register = true;

export default handler;

