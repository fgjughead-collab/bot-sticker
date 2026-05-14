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
logger: pino({ level: 'silent' })
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', (update) => {

const { connection, qr, lastDisconnect } = update

// 📱 QR CODE
if (qr) {
console.log('\nESCANEIA O QR ABAIXO:\n')
QRCode.generate(qr, { small: true })
}

// ✅ CONECTOU
if (connection === 'open') {
console.log('BOT CONECTADO COM SUCESSO')
}

// ❌ CAIU CONEXÃO
if (connection === 'close') {
const statusCode = lastDisconnect?.error?.output?.statusCode

const shouldReconnect = statusCode !== DisconnectReason.loggedOut

console.log('CONEXÃO FECHADA. RECONNECT:', shouldReconnect)

if (shouldReconnect) {
setTimeout(() => {
startBot()
}, 5000)
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

// 📌 MENU
if (body === '.menu') {
await sock.sendMessage(from, {
text:
`╭━━ BOT STICKER ━━╮
┃ .s → Criar figurinha
╰━━━━━━━━━━━━━━━╯`
})
return
}

// 📌 STICKER
if (body === '.s') {

let media

if (isImage) {
media = msg.message.imageMessage
} else if (isQuotedImage) {
media = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
} else {
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

exec(
`ffmpeg -i input.jpg -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white" output.webp`,
async (err) => {

if (err) {
console.log(err)
return
}

const sticker = fs.readFileSync('./output.webp')

await sock.sendMessage(from, {
sticker
})

fs.unlinkSync('./input.jpg')
fs.unlinkSync('./output.webp')
}
)

}

})

}

startBot()
