import { promises as fsPromises, existsSync, rmSync } from "fs";
import path from 'path';
import ws from 'ws';

const fs = { ...fsPromises, existsSync };

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
    const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
    const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
    const isCommand3 = /^(bots|listjadibots|subbots)$/i.test(command);

    async function reportError(e) {
        await m.reply(`💙 Ocurrió un error.`);
        console.error('Error en el handler:', e);
    }

    try {
        switch (true) {
            case isCommand1:
                await handleDeleteSession(m, _envio, usedPrefix, command);
                break;
                
            case isCommand2:
                await handleStopBot(m, _envio);
                break;
                
            case isCommand3:
                await handleListSubBots(m, _envio, usedPrefix);
                break;
        }
    } catch (error) {
        reportError(error);
    }
};

// Función para manejar la eliminación de sesión
async function handleDeleteSession(m, conn, usedPrefix, command) {
    let mentionedJid = m.mentionedJid?.[0] || m.fromMe ? conn.user.jid : m.sender;
    let uniqid = mentionedJid.split('@')[0];
    const sessionPath = path.join(`./${jadi}`, uniqid);

    if (!await fs.existsSync(sessionPath)) {
        return conn.sendMessage(m.chat, { 
            text: `💙 Usted no tiene una sesión, puede crear una usando:\n${usedPrefix + command}\n\nSi tiene una *(ID)* puede usarla para saltarse el paso anterior usando:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` 
        }, { quoted: m });
    }

    if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(m.chat, {
            text: `💙 Use este comando al *Bot* principal.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split('@')[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { text: `💙 Tu sesión como *Sub-Bot* se ha eliminado` }, { quoted: m });
    
    try {
        rmSync(sessionPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, { text: `Ha cerrado sesión y borrado todo rastro.` }, { quoted: m });
    } catch (e) {
        throw e;
    }
}


async function handleStopBot(m, conn) {
    if (global.conn.user.jid === conn.user.jid) {
        return conn.reply(m.chat, `💙 Si no es *SubBot* comuníquese al numero principal del *Bot* para ser *SubBot*`, m);
    }
    
    await conn.reply(m.chat, `💙 Miku desactivada.`, m);
    conn.ws.close();
}


async function handleListSubBots(m, conn, usedPrefix) {
    const activeBots = [...new Set(
        [...global.conns]
            .filter(conn => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED)
    )];

    function formatUptime(ms) {
        const segundos = Math.floor(ms / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const días = Math.floor(horas / 24);
        
        return [
            días && `${días} día${días > 1 ? 's' : ''}`,
            horas % 24 && `${horas % 24} hora${horas % 24 > 1 ? 's' : ''}`,
            minutos % 60 && `${minutos % 60} minuto${minutos % 60 > 1 ? 's' : ''}`,
            segundos % 60 && `${segundos % 60} segundo${segundos % 60 > 1 ? 's' : ''}`
        ].filter(Boolean).join(', ');
    }

    const botList = activeBots.map((v, index) => (
        `• 「 ${index + 1} 」\n` +
        `📎 https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado\n` +
        `👤 Usuario: ${v.user.name || 'Sub-Bot'}\n` +
        `🕑 Online: ${v.uptime ? formatUptime(Date.now() - v.uptime) : 'Desconocido'}`
    )).join('\n\n__________________________\n\n');

    const responseMessage = {
        text: `💙 *LISTA DE SUBBOTS*\n\n` +
              `💙 PUEDES PEDIR PERMISO PARA QUE TE DEJEN UNIR EL BOT A TÚ GRUPO\n\n` +
              `\`\`\`CADA USUARIO SUB BOT USA FUNCIÓN COMO QUIERA, EL NÚMERO PRINCIPAL NO SE HACE RESPONSABLE DEL USO DE LA FUNCIÓN\`\`\`\n\n` +
              `SUBBOT CONECTADO: ${activeBots.length || '0'}\n\n${botList || 'No hay Sub-Bots disponibles por el momento'}`.trim(),
        mentions: conn.parseMention(botList)
    };

    
    const imageUrl = 'https://image.tensorartassets.com/posts/images/770029053091756511/e47e6f14-ba09-4cb3-9800-b36dca989384.png'; 
    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: responseMessage.text,
        mentions: responseMessage.mentions
    }, { quoted: m });
}

handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'listjadibots', 'subbots'];
export default handler;
