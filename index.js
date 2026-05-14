const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
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
logger: pino({ level: 'silent' }),
auth: state
})

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update

    // 🔥 MOSTRA QR SEM RESETAR
    if (qr) {
        console.log("\n📱 ESCANEIE O QR ABAIXO:\n")
        require('qrcode-terminal').generate(qr, { small: true })
    }

    // 🔥 CONECTADO
    if (connection === 'open') {
        console.log("✅ BOT CONECTADO COM SUCESSO")
    }

    // 🔥 SÓ RECONECTA SE CAIR DE VERDADE
    if (connection === 'close') {
        const shouldReconnect =
            lastDisconnect?.error?.output?.statusCode !== 401

        console.log("⚠️ Conexão fechada. Reconnect:", shouldReconnect)

        if (shouldReconnect) {
            setTimeout(() => {
                startBot()
            }, 5000) // espera 5s antes de reiniciar (evita QR reset rápido)
        }
    }
})

const { connection, qr, lastDisconnect } = update

if (qr) {
QRCode.generate(qr, { small: true })
}

if (connection === 'close') {

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if (shouldReconnect) {
startBot()
}

} else if (connection === 'open') {
console.log('BOT CONECTADO')
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

await sock.sendMessage(from, {
text:
`╭━━ BOT STICKER ━━╮
┃ .s → Criar figurinha
╰━━━━━━━━━━━━━━━╯`
})

}

if (body === '.s') {

let media

if (isImage) {
media = msg.message.imageMessage
} else if (isQuotedImage) {
media =
msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
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
