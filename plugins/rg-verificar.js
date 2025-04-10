import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import axios from 'axios'; 

let Reg = /\|?(.*)([.|] ?)([0-9])$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];
    let name2 = conn.getName(m.sender);

    
    let delirius = await axios.get(`https://delirius-apiofc.vercel.app/tools/country?text=${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}`);
    let paisdata = delirius.data.result;
    let mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido';
    let perfil = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/736x/7b/c6/95/7bc6955d19ce9fa6e562e634d85c912b.jpg');

    // Obtener biografía del usuario
    let bio = 0, fechaBio;
    let sinDefinir = '😿 Es privada';
    let biografia = await conn.fetchStatus(m.sender).catch(() => null);
    if (!biografia || !biografia[0] || biografia[0].status === null) {
        bio = sinDefinir;
        fechaBio = "Fecha no disponible";
    } else {
        bio = biografia[0].status || sinDefinir;
        fechaBio = biografia[0].setAt ? new Date(biografia[0].setAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "Fecha no disponible";
    }

   
    if (user.registered === true) {
        await m.reply('*💙 Ya estás registrado. Para volver a registrarte, usa el comando: #unreg*');
        return; 
    }

  
    if (!Reg.test(text)) {
        throw `*💙 El comando ingresado es incorrecto. Uselo de la siguiente manera:*\n\n#reg Nombre.edad\n\n*Ejemplo:*\n#reg ${name2}.18`;
    }

    let [, name, splitter, age] = text.match(Reg);

    if (!name) throw '💙 No puedes registrarte sin nombre. El nombre es obligatorio. Inténtelo de nuevo.';
    if (!age) throw '💙 No puedes registrarte sin la edad. La edad es opcional. Inténtelo de nuevo.';
    if (name.length >= 30) throw '💙 El nombre no debe tener más de 30 caracteres.';
    age = parseInt(age);
    if (age > 999) throw '『😏』Viejo/a Sabroso/a';
    if (age < 5) throw '『🍼』Ven aquí, te adoptaré!!';

   
    user.name = name.trim();
    user.age = age;
    user.descripcion = bio;
    user.regTime = +new Date();
    user.registered = true;
    global.db.data.users[m.sender].money += 5;
    global.db.data.users[m.sender].chocolates = (global.db.data.users[m.sender].chocolates || 0) + 15;
    global.db.data.users[m.sender].exp += 245;
    global.db.data.users[m.sender].joincount += 12;

    
    let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20);
    m.react('📩');

    // Mensaje de registro exitoso
    let regbot = `
💙 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 💙
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
「✨️」𝗘𝗱𝗮𝗱: ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 15 Cebollines 🌱
• 5 coins 🪙
• 245 Experiencia 💸
• 12 Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
¡Sigue nuestro team!
${channel2}
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
${packname}`;

    await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: '¡Usᥙᥲrі᥆ rᥱgіs𝗍rᥲძ᥆!',
                body: '💙 LA MELODIA MAS AGUDA!!',
                thumbnailUrl: imagen3,
                sourceUrl: redes,
                previewType: "PHOTO",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
};

handler.help = ['reg'];
handler.tags = ['rg'];
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'];
export default handler;
