process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)

/* 📦 IMPORTS */
const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require('@whiskeysockets/baileys')

const pino = require('pino')

const config = require('./config')

const eco = require('./lib/economy')
const games = require('./lib/games')
const ranking = require('./lib/ranking')
const downloads = require('./lib/downloads')
const shop = require('./lib/shop')

const perm = require('./lib/permissions')
const panel = require('./lib/panel')

const antispam = require('./lib/antispam')
const cd = require('./lib/cooldown')

const handler = require('./lib/handler')

/* 🚀 START BOT */
async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState('./auth')
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: 'silent' })
})

sock.ev.on('creds.update', saveCreds)

/* 📩 MESSAGES */
sock.ev.on('messages.upsert', async ({ messages }) => {

const msg = messages[0]
if (!msg.message) return

const from = msg.key.remoteJid

const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
msg.message.imageMessage?.caption ||
msg.message.videoMessage?.caption ||
''

/* 🧠 ANTI SPAM */
if (antispam.isSpam(from)) {
return sock.sendMessage(from, {
text: "🚫 Devagar! você está enviando mensagens muito rápido."
})
}

/* 👤 CRIAR USER AUTOMÁTICO */
eco.createUser(from)

/* 🚫 BAN CHECK */
if (perm.isBanned(from)) {
return sock.sendMessage(from, {
text: "🚫 Você está banido do TheBoys Bot."
})
}

/* 🧩 COMMAND PARSE */
const parsed = handler.parseCommand(body, config.prefix)

if (!parsed) return

const { cmd, args } = parsed

/* ========================= */
/* 👑 MENU PRINCIPAL */
/* ========================= */

if (cmd === 'menu') {

await sock.sendMessage(from, {
text: `
╭━━🔥 *THEBOYS BOT* 🔥━━╮

👤 .perfil
⛏ .minerar
🎮 .adivinha
🎰 .cassino
📊 .ranking
🏪 .shop

📥 DOWNLOADS
🎵 .mp3 link
🎥 .mp4 link
🎬 .tiktok link

👑 .menuadm

╰━━━━━━━━━━━━━━╯
`
})
}

/* ========================= */
/* 👤 PERFIL */
/* ========================= */

if (cmd === 'perfil') {

const u = eco.getUser(from)

await sock.sendMessage(from, {
text: `
👤 PERFIL

💰 Gold: ${u.gold}
⭐ XP: ${u.xp}
📊 Level: ${u.level}
`
})
}

/* ========================= */
/* ⛏ MINERAR (COOLDOWN) */
/* ========================= */

if (cmd === 'minerar') {

if (cd.check(from, 'minerar', 60000)) {
return sock.sendMessage(from, {
text: "⏳ Aguarde 1 minuto para minerar novamente."
})
}

const gain = Math.floor(Math.random() * 50) + 10
eco.addGold(from, gain)

await sock.sendMessage(from, {
text: `⛏ Você minerou +${gain} gold!`
})
}

/* ========================= */
/* 🎮 ADIVINHA */
/* ========================= */

if (cmd === 'adivinha') {

const res = games.adivinha(from, args[0])

await sock.sendMessage(from, { text: res })
}

/* ========================= */
/* 🎰 CASSINO */
/* ========================= */

if (cmd === 'cassino') {

const res = games.cassino(from)

await sock.sendMessage(from, { text: res })
}

/* ========================= */
/* 📊 RANKING */
/* ========================= */

if (cmd === 'ranking') {

const top = ranking.getRanking()

let text = "📊 TOP PLAYERS\n\n"

top.forEach((u, i) => {
text += `${i + 1}. ${u[0].split('@')[0]} - ${u[1].gold}💰\n`
})

await sock.sendMessage(from, { text })
}

/* ========================= */
/* 🏪 SHOP */
/* ========================= */

if (cmd === 'shop') {

const items = shop.shopList()

let text = "🏪 LOJA\n\n"

for (let i in items) {
text += `🛒 ${i} - ${items[i]} gold\n`
}

await sock.sendMessage(from, { text })
}

/* ========================= */
/* 🛒 BUY */
/* ========================= */

if (cmd === 'buy') {

const res = shop.buy(from, args[0])

await sock.sendMessage(from, { text: res })
}

/* ========================= */
/* 🎵 YOUTUBE MP3 */
/* ========================= */

if (cmd === 'mp3') {

const url = args[0]

await sock.sendMessage(from, { text: "⏳ Baixando áudio..." })

const data = await downloads.ytMP3(url)

if (!data?.url) {
return sock.sendMessage(from, { text: "❌ Erro no download" })
}

await sock.sendMessage(from, {
audio: { url: data.url },
mimetype: 'audio/mp4'
})
}

/* ========================= */
/* 🎥 YOUTUBE MP4 */
/* ========================= */

if (cmd === 'mp4') {

const url = args[0]

await sock.sendMessage(from, { text: "⏳ Baixando vídeo..." })

const data = await downloads.ytMP4(url)

if (!data?.url) {
return sock.sendMessage(from, { text: "❌ Erro no vídeo" })
}

await sock.sendMessage(from, {
video: { url: data.url }
})
}

/* ========================= */
/* 🎬 TIKTOK */
/* ========================= */

if (cmd === 'tiktok') {

const url = args[0]

const data = await downloads.tiktok(url)

if (!data?.video) {
return sock.sendMessage(from, { text: "❌ Erro no TikTok" })
}

await sock.sendMessage(from, {
video: { url: data.video }
})
}

/* ========================= */
/* 👑 PAINEL ADMIN */
/* ========================= */

if (cmd === 'menuadm') {

if (!perm.isAdminBot(from)) return

await sock.sendMessage(from, {
text: `
👑 PAINEL ADMIN

.addvip
.removevip
.addadmin
.removeadmin
.ban
.unban
.addgold
.reset
.status
`
})
}

/* ========================= */
/* 🚫 BAN */
/* ========================= */

if (cmd === 'ban') {

if (!perm.isAdminBot(from)) return

panel.ban(args[0])

await sock.sendMessage(from, {
text: "🚫 Usuário banido"
})
}

/* ========================= */
/* 💎 VIP */
/* ========================= */

if (cmd === 'addvip') {

if (!perm.isAdminBot(from)) return

panel.addVIP(args[0])

await sock.sendMessage(from, {
text: "💎 VIP adicionado"
})
}

/* ========================= */
/* 💰 ADD GOLD */
/* ========================= */

if (cmd === 'addgold') {

if (!perm.isAdminBot(from)) return

panel.addGold(args[0], parseInt(args[1]))

await sock.sendMessage(from, {
text: "💰 Gold enviado"
})
}

})

/* 🔌 CONNECTION */
sock.ev.on('connection.update', (update) => {

const { connection, lastDisconnect } = update

if (connection === 'open') {
console.log("🔥 TheBoys Bot ONLINE 🚀")
}

if (connection === 'close') {

const status = lastDisconnect?.error?.output?.statusCode

if (status !== DisconnectReason.loggedOut) {
startBot()
}
}
})

}

startBot()
