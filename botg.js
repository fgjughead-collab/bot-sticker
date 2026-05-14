const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason,
downloadContentFromMessage
} = require('@whiskeysockets/baileys')

const pino = require('pino')
const fs = require('fs')
const { exec } = require('child_process')
const QRCode = require('qrcode-terminal')

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState('./auth')
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level: 'silent' }),
printQRInTerminal: false
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', (update) => {

const { connection, qr, lastDisconnect } = update

if (qr) {
console.log("\n📱 ESCANEIA O QR:\n")
QRCode.generate(qr, { small: true })
}

if (connection === 'open') {
console.log("✅ CONECTADO COM SUCESSO")
}

if (connection === 'close') {

const statusCode = lastDisconnect?.error?.output?.statusCode

console.log("❌ Conexão fechou:", statusCode)

// 🔥 só reinicia se NÃO for logout
if (statusCode !== DisconnectReason.loggedOut) {
setTimeout(() => {
startBot()
}, 5000)
} else {
console.log("⚠️ Você foi deslogado. Apague auth e escaneie de novo.")
}

}

})

sock.ev.on('messages.upsert', async ({ messages }) => {

const msg = messages[0]
if (!msg.message) return

const from = msg.key.remoteJid

const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
''

const isImage = msg.message.imageMessage

const isQuotedImage =
msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

if (body === '.menu') {
return sock.sendMessage(from, {
text: `╭━━ BOT ━━╮\n┃ .s sticker\n╰━━━━━━━━╯`
})
}

if (body === '.s') {

let media = isImage
? msg.message.imageMessage
: isQuotedImage
? msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
: null

if (!media) {
return sock.sendMessage(from, {
text: 'Envie ou responda uma imagem com .s'
})
}

const stream = await downloadContentFromMessage(media, 'image')

let buffer = Buffer.from([])

for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

fs.writeFileSync('./input.jpg', buffer)

exec(`ffmpeg -i input.jpg output.webp`, async (err) => {

if (err) {
console.log(err)
return
}

const sticker = fs.readFileSync('./output.webp')

await sock.sendMessage(from, { sticker })

fs.unlinkSync('./input.jpg')
fs.unlinkSync('./output.webp')
})

}

})

}

startBot()
