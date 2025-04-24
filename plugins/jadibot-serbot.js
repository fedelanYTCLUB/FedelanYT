const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = "*╭━╴╶╴╶╴╶╴ꖒ╶╴╶╴╶╴╶━╮*\n*│💙 S E R B O T - S U B B O T 💙*\n*🎧 𝐇𝐀𝐓𝐒𝐔𝐍𝐄 𝐌𝐈𝐊𝐔 - 𝐁𝐎𝐓 🎧*\n*│ 𝐸𝑠𝑐𝑎𝑛𝑒𝑎 𝑒𝑠𝑡𝑒 𝑄𝑅 𝑝𝑎𝑟𝑎 𝑠𝑒𝑟 𝑢𝑛 𝑆𝑢𝑏 𝐵𝑜𝑡*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│💙 𝑷𝒂𝒔𝒐𝒔 𝒑𝒂𝒓𝒂 𝒆𝒔𝒄𝒂𝒏𝒆𝒂𝒓:*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `1` : 𝐻𝑎𝑔𝑎 𝑐𝑙𝑖𝑐𝑘 𝑒𝑛 𝑙𝑜𝑠 3 𝑝𝑢𝑛𝑡𝑜𝑠*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `2` : 𝑇𝑜𝑞𝑢𝑒 𝑑𝑖𝑠𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑜𝑠 𝑣𝑖𝑛𝑐𝑢𝑙𝑎𝑑𝑜𝑠*\n*├╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `3` : 𝐸𝑠𝑐𝑎𝑛𝑒𝑎 𝑒𝑠𝑡𝑒 𝑄𝑅*\n*├╶╴╶╴╶╴╶╴╶╴*\n> *𝑵𝒐𝒕𝒂:* 𝑬𝒔𝒕𝒆 𝒄𝒐𝒅𝒊𝒈𝒐 𝑸𝑹 𝒆𝒙𝒑𝒊𝒓𝒂 𝒆𝒏 30 𝒔𝒆𝒈𝒖𝒏𝒅𝒐𝒔.\n*╰━╴╶╴╶╴╶╴ꖒ╶╴╶╴╶╴╶━╯*"
let rtx2 = "*╭━╴╶╴╶╴╶╴ꖒ╶╴╶╴╶╴╶━╮*\n*│💙 S E R B O T - S U B B O T 💙*\n*🎧 𝐇𝐀𝐓𝐒𝐔𝐍𝐄 𝐌𝐈𝐊𝐔 - 𝐁𝐎𝐓 🎧*\n*│ 𝑈𝑠𝑎 𝑒𝑠𝑡𝑒 𝐶ó𝑑𝑖𝑔𝑜 𝑝𝑎𝑟𝑎 𝑐𝑜𝑛𝑣𝑒𝑟𝑡𝑖𝑟𝑡𝑒 𝑒𝑛 𝑢𝑛 𝑆𝑢𝑏 𝐵𝑜𝑡*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│💙 𝑷𝒂𝒔𝒐𝒔:*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `1` : 𝐻𝑎𝑔𝑎 𝑐𝑙𝑖𝑐𝑘 𝑒𝑛 𝑙𝑜𝑠 3 𝑝𝑢𝑛𝑡𝑜𝑠*\n*├╶╴╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `2` : 𝑇𝑜𝑞𝑢𝑒 𝑑𝑖𝑠𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑜𝑠 𝑣𝑖𝑛𝑐𝑢𝑙𝑎𝑑𝑜𝑠*\n*├╶╴╶╴╶╴╶╴╶╴╶╴*\n*│ `3` : 𝑆𝑒𝑙𝑒𝑐𝑐𝑖𝑜𝑛𝑎 𝑉𝑖𝑛𝑐𝑢𝑙𝑎𝑟 𝑐𝑜𝑛 𝑒𝑙 𝑛𝑢𝑚𝑒𝑟𝑜 𝑑𝑒 𝑡𝑒𝑙é𝑓𝑜𝑛𝑜*\n*├╶╴╶╴╶╴╶╴╶╴*\n*│ `4` : 𝐸𝑠𝑐𝑟𝑖𝑏𝑎 𝑒𝑙 𝐶𝑜𝑑𝑖𝑔𝑜*\n*├╶╴╶╴╶╴╶╴*\n> *𝑵𝒐𝒕𝒂:* 𝑬𝒔𝒕𝒆 𝑪𝒐𝒅𝒊𝒈𝒐 𝒔𝒐𝒍𝒐 𝒇𝒖𝒏𝒄𝒊𝒐𝒏𝒂 𝒆𝒏 𝒆𝒍 𝒏𝒖𝒎𝒆𝒓𝒐 𝒒𝒖𝒆 𝒍𝒐 𝒔𝒐𝒍𝒊𝒄𝒊𝒕𝒐.\n*╰━╴╶╴╶╴╶╴ꗰ╶╴╶╴╶╴╶━╯*"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mikuJBOptions = {}

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    let time = global.db.data.users[m.sender].Subs + 120000
    if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `☠️ Debes esperar ${msToTime(time - new Date())} para volver a vincular un SubBot.`, m)
    if (Object.values(global.conns).length === 20) {
        return m.reply('😁 Ya no hay cupos para nuevos SubBots.')
    }
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathMikuJadiBot = path.join(`./${jadi}/`, id)
    
    if (!fs.existsSync(pathMikuJadiBot)) {
        fs.mkdirSync(pathMikuJadiBot, { recursive: true })
    }
    
    mikuJBOptions.pathMikuJadiBot = pathMikuJadiBot
    mikuJBOptions.m = m
    mikuJBOptions.conn = conn
    mikuJBOptions.args = args
    mikuJBOptions.usedPrefix = usedPrefix
    mikuJBOptions.command = command
    
    try {
        await mikuJadiBot(mikuJBOptions)
        global.db.data.users[m.sender].Subs = new Date * 1
    } catch (error) {
        console.error('Error al iniciar sub-bot:', error)
        conn.reply(m.chat, '❌ Ocurrió un error al iniciar el sub-bot. Por favor intenta nuevamente.', m)
    }
} 

handler.help = ['serbot', 'serbot code']
handler.tags = ['serbot']
handler.command = ['jadibot', 'serbot']
export default handler 

// Función mejorada de reconexión
async function reconnectHandler(sock, pathMikuJadiBot, connectionOptions) {
    try {
        const oldChats = sock.chats;
        try { 
            sock.ws.close(); 
        } catch (e) { 
            console.error('Error al cerrar conexión:', e); 
        }
        
        sock.ev.removeAllListeners();
        await delay(2000); // Espera breve antes de reconectar
        
        const newSock = makeWASocket(connectionOptions, { chats: oldChats });
        newSock.isInit = true;
        
        // Actualizar en el array global
        const index = global.conns.indexOf(sock);
        if (index !== -1) {
            global.conns[index] = newSock;
        }
        
        return newSock;
    } catch (error) {
        console.error('Error en reconexión:', error);
        return null;
    }
}

// Configuración mejorada de event handlers
function setupEventHandlers(sock, handler, saveCreds) {
    // Remover listeners antiguos
    sock.ev.removeAllListeners("messages.upsert");
    sock.ev.removeAllListeners("connection.update");
    sock.ev.removeAllListeners("creds.update");
    
    // Configurar nuevos handlers
    sock.handler = handler.handler.bind(sock);
    sock.connectionUpdate = connectionUpdate.bind(sock);
    sock.credsUpdate = saveCreds.bind(sock, true);
    
    sock.ev.on("messages.upsert", sock.handler);
    sock.ev.on("connection.update", sock.connectionUpdate);
    sock.ev.on("creds.update", sock.credsUpdate);
}

export async function mikuJadiBot(options) {
    let { pathMikuJadiBot, m, conn, args, usedPrefix, command } = options
    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
    let txtCode, codeBot, txtQR
    
    if (mcode) {
        args[0] = args[0].replace(/^--code$|^code$/, "").trim()
        if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
        if (args[0] == "") args[0] = undefined
    }
    
    const pathCreds = path.join(pathMikuJadiBot, "creds.json")
    if (!fs.existsSync(pathMikuJadiBot)) {
        fs.mkdirSync(pathMikuJadiBot, { recursive: true })
    }
    
    try {
        args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
    } catch {
        conn.reply(m.chat, `😍 *Use correctamente el comando »* ${usedPrefix + command} code`, m)
        return
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`)

        let { version, isLatest } = await fetchLatestBaileysVersion()
        const msgRetry = (MessageRetryMap) => { }
        const msgRetryCache = new NodeCache()
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMikuJadiBot)

        const connectionOptions = {
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetry,
            msgRetryCache,
            version: [2, 3000, 1015901307],
            syncFullHistory: true,
            browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['HATSUNE-MIKU (Sub Bot)', 'Chrome','2.0.0'],
            defaultQueryTimeoutMs: undefined,
            getMessage: async (key) => {
                return { conversation: 'HATSUNE-MIKU' }
            }
        } 

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            
            if (isNewLogin) sock.isInit = false
            
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { 
                        image: await qrcode.toBuffer(qr, { scale: 8 }), 
                        caption: rtx.trim()
                    }, { quoted: m })
                }
                
                if (txtQR && txtQR.key) {
                    setTimeout(() => { 
                        conn.sendMessage(m.sender, { delete: txtQR.key })
                    }, 30000)
                }
                return
            } 
            
            if (qr && mcode) {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
                secret = secret.match(/.{1,4}/g)?.join("-")
                txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
                codeBot = await m.reply(secret)
                console.log(secret)
            }
            
            if (txtCode && txtCode.key) {
                setTimeout(() => { 
                    conn.sendMessage(m.sender, { delete: txtCode.key })
                }, 30000)
            }
            
            if (codeBot && codeBot.key) {
                setTimeout(() => { 
                    conn.sendMessage(m.sender, { delete: codeBot.key })
                }, 30000)
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            
            if (connection === 'close') {
                try {
                    if (reason === DisconnectReason.connectionClosed || reason === 428) {
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathMikuJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
                        sock = await reconnectHandler(sock, pathMikuJadiBot, connectionOptions)
                        if (sock) setupEventHandlers(sock, handler, saveCreds)
                    }
                    else if (reason === DisconnectReason.connectionLost || reason === 408) {
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathMikuJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
                        sock = await reconnectHandler(sock, pathMikuJadiBot, connectionOptions)
                        if (sock) setupEventHandlers(sock, handler, saveCreds)
                    }
                    else if (reason === DisconnectReason.restartRequired || reason === 515) {
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathMikuJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
                        sock = await reconnectHandler(sock, pathMikuJadiBot, connectionOptions)
                        if (sock) setupEventHandlers(sock, handler, saveCreds)
                    }
                    else if (reason === DisconnectReason.badSession || reason === 500) {
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathMikuJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
                        await conn.sendMessage(`${path.basename(pathMikuJadiBot)}@s.whatsapp.net`, {
                            text: '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*'
                        }, { quoted: null })
                        fs.rmdirSync(pathMikuJadiBot, { recursive: true })
                    }
                    else if (reason === DisconnectReason.invalidSession || reason === 401 || reason === 403) {
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathMikuJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
                        fs.rmdirSync(pathMikuJadiBot, { recursive: true })
                    }
                } catch (error) {
                    console.error('Error al manejar desconexión:', error)
                }
            }
            
            if (connection == `open`) {
                if (!global.db.data?.users) loadDatabase()
                let userName = sock.authState.creds.me.name || 'Anónimo'
                let userJid = sock.authState.creds.me.jid || `${path.basename(pathMikuJadiBot)}@s.whatsapp.net`
                
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathMikuJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
                
                sock.isInit = true
                global.conns.push(sock)

                m?.chat && await conn.sendMessage(m.chat, {
                    text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `@${m.sender.split('@')[0]}, genial ya eres parte de nuestra familia de SubBots.`,
                    mentions: [m.sender]
                }, { quoted: m })
            }
        }

        // Monitoreo periódico de la conexión
        setInterval(async () => {
            if (!sock.user) {
                try { 
                    sock.ws.close() 
                } catch (e) {
                    console.error('Error al cerrar conexión inactiva:', e)
                }
                
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)                
                if (i < 0) return
                
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)

        let handler = await import('../miku/handler.js')
        
        setupEventHandlers(sock, handler, saveCreds)
    })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    
    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds
    
    return minutes + ' m y ' + seconds + ' s '
}
