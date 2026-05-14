process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)

const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require('@whiskeysockets/baileys')

const pino = require('pino')
const fs = require('fs')

const config = require('./config')
const db = require('./lib/db')
const user = require('./lib/user')

/* ================= BOT START ================= */

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState('./auth')
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: 'silent' }),
printQRInTerminal: true
})

sock.ev.on('creds.update', saveCreds)

/* ================= CONNECTION ================= */

sock.ev.on('connection.update', (update) => {

const { connection, lastDisconnect } = update

if (connection === 'open') {
console.log('🔥 TheBoys Bot ONLINE')
}

if (connection === 'close') {

const code = lastDisconnect?.error?.output?.statusCode

console.log('❌ Conexão fechou:', code)

if (code !== DisconnectReason.loggedOut) {
setTimeout(() => startBot(), 5000)
} else {
console.log('❌ Deslogado do WhatsApp')
}

}

})

/* ================= MESSAGES ================= */

sock.ev.on('messages.upsert', async ({ messages }) => {

const msg = messages[0]
if (!msg.message) return

const from = msg.key.remoteJid
const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
''

/* garante user */
db.getUser(from)

/* ================= MENU ================= */

if (body === '.menu') {

await sock.sendMessage(from, {
text: `
╭━━🔥 THEBOYS BOT 🔥━━╮

👤 PERFIL
.perfil

💰 ECONOMIA
.gold
.minerar

🎮 GAMES
.adivinha

📥 DOWNLOADS (em breve)
.mp3
.mp4
.tiktok

╰━━━━━━━━━━━━━━╯
`
})

}

/* ================= PERFIL ================= */

if (body === '.perfil') {

const u = db.getUser(from)

await sock.sendMessage(from, {
text: `
👤 PERFIL

💰 Gold: ${u?.gold || 0}
⭐ XP: ${u?.xp || 0}
📊 Level: ${u?.level || 1}
`
})

}

/* ================= MINERAR ================= */

if (body === '.minerar') {

const gain = Math.floor(Math.random() * 50) + 1

db.addGold(from, gain)

await sock.sendMessage(from, {
text: `⛏ Você minerou +${gain} gold!`
})

}

/* ================= ADIVINHA ================= */

if (body.startsWith('.adivinha')) {

const num = Math.floor(Math.random() * 5) + 1
const guess = body.split(' ')[1]

if (!guess) {
return sock.sendMessage(from, { text: 'Digite um número de 1 a 5' })
}

if (parseInt(guess) === num) {
db.addGold(from, 100)
return sock.sendMessage(from, { text: '🎉 Acertou! +100 gold' })
} else {
return sock.sendMessage(from, { text: `❌ Errou! era ${num}` })
}

}

})

}

startBot()
