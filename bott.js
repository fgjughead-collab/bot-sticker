process.on('uncaughtException', (err) => {
console.log('UNCAUGHT EXCEPTION:', err)
})

process.on('unhandledRejection', (err) => {
console.log('UNHANDLED REJECTION:', err)
})

const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason
} = require('@whiskeysockets/baileys')

const pino = require('pino')

const config = require('./config')

const user = require('./lib/user')
const middleware = require('./lib/middleware')
const loadCommands = require('./lib/loader')
const detect = require('./lib/detect')

const commands = loadCommands()

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState('./auth')

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: 'silent' }),
browser: ['TheBoys Bot', 'Chrome', '1.0.0']
})

/* =========================
SALVAR SESSÃO
========================= */

sock.ev.on('creds.update', saveCreds)

/* =========================
CONEXÃO
========================= */

let reconnecting = false

sock.ev.on('connection.update', async (update) => {

const {
connection,
lastDisconnect
} = update

if (connection === 'open') {

console.log('🔥 THEBOYS BOT ONLINE')

reconnecting = false
}

if (connection === 'close') {

const status =
lastDisconnect?.error?.output?.statusCode

console.log('❌ CONEXÃO FECHADA:', status)

if (status === DisconnectReason.loggedOut) {

console.log('❌ Sessão desconectada.')
return
}

if (!reconnecting) {

reconnecting = true

console.log('🔄 Reconectando em 5 segundos...')

setTimeout(() => {
startBot()
}, 5000)

}

}

})

/* =========================
MENSAGENS
========================= */

sock.ev.on('messages.upsert', async ({ messages }) => {

try {

const msg = messages[0]

if (!msg.message) return

if (msg.key.fromMe) return

const from = msg.key.remoteJid

const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
''

/* =========================
USER ID
========================= */

const userId =
msg.key.participant || msg.key.remoteJid

/* =========================
CRIAR USER
========================= */

user.createUser(userId)

/* =========================
AUTO DETECTAR LINKS
========================= */

const platform = detect(body)

if (platform) {

console.log(`📥 Link detectado: ${platform}`)

}

/* =========================
PREFIX
========================= */

if (!body.startsWith(config.prefix)) return

const args =
body.slice(config.prefix.length).trim().split(/ +/)

const cmd =
args.shift().toLowerCase()

/* =========================
MIDDLEWARE
========================= */

const allowed =
await middleware(sock, msg, cmd, userId)

if (!allowed) return

/* =========================
COMANDO
========================= */

if (commands[cmd]) {

await commands[cmd].execute(
sock,
msg,
args
)

} else {

await sock.sendMessage(from, {
text: '❌ Comando não encontrado.'
})

}

} catch (e) {

console.log('MESSAGE ERROR:', e)

}

})

}

/* =========================
INICIAR BOT
========================= */

startBot()
