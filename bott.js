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

const { connection, lastDisconnect } = update

if (connection === 'open') {
console.log('✅ CONECTADO COM SUCESSO')
}

if (connection === 'close') {

const statusCode =
lastDisconnect?.error?.output?.statusCode

console.log('❌ Conexão fechou:', statusCode)

if (statusCode !== DisconnectReason.loggedOut) {

setTimeout(() => {
startBot()
}, 5000)

} else {
console.log('❌ Deslogado do WhatsApp. Precisa reconectar manualmente.')
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

/* MENU */
if (body === '.menu') {

await sock.sendMessage(from, {
text:
`╭━━ BOT STICKER ━━╮
┃ .s → Criar sticker
╰━━━━━━━━━━━━━━━╯`
})

}

/* STICKER */
if (body === '.s') {

await sock.sendMessage(from, {
text: '🫡🤌🏾 Processando sticker...'
})

let media = null
let mediaType = null

if (msg.message.imageMessage) {
media = msg.message.imageMessage
mediaType = 'image'
}

else if (msg.message.videoMessage) {

const seconds = msg.message.videoMessage.seconds || 0

if (seconds > 15) {
return sock.sendMessage(from, {
text: '❌ O vídeo deve ter no máximo 15 segundos.'
})
}

media = msg.message.videoMessage
mediaType = 'video'
}

else if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {

media =
msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage

mediaType = 'image'
}

else if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage) {

const quotedVideo =
msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage

const seconds = quotedVideo.seconds || 0

if (seconds > 15) {
return sock.sendMessage(from, {
text: '❌ O vídeo deve ter no máximo 15 segundos.'
})
}

media = quotedVideo
mediaType = 'video'
}

if (!media) {
return sock.sendMessage(from, {
text: '❌ Envie ou responda uma imagem/vídeo com .s'
})
}

let stream

try {
stream = await downloadContentFromMessage(media, mediaType)
} catch (e) {
return sock.sendMessage(from, {
text: '❌ Erro ao baixar mídia.'
})
}

let buffer = Buffer.from([])

for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

const inputFile =
mediaType === 'image'
? './input.jpg'
: './input.mp4'

fs.writeFileSync(inputFile, buffer)

const command =
mediaType === 'image'
? `ffmpeg -i input.jpg -vcodec libwebp output.webp`
: `ffmpeg -i input.mp4 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0" -loop 0 -ss 00:00:00 -t 00:00:15 -preset default -an -vsync 0 output.webp`

exec(command, async (err) => {

if (err) {
console.log(err)
return sock.sendMessage(from, {
text: '❌ Erro ao criar sticker.'
})
}

const sticker = fs.readFileSync('./output.webp')

await sock.sendMessage(from, {
sticker
})

fs.unlinkSync(inputFile)
fs.unlinkSync('./output.webp')

})

})

}

startBot()
