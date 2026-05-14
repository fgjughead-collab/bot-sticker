const dl = require('../lib/downloads')

module.exports = {

name: 'mp4',

async execute(sock, msg, args) {

const from = msg.key.remoteJid
const url = args[0]

await sock.sendMessage(from, {
text: '⏳ Baixando vídeo...'
})

const data = await dl.ytMP4(url)

if (!data || !data.url) {

return sock.sendMessage(from, {
text: '❌ Erro no vídeo.'
})
}

await sock.sendMessage(from, {
video: { url: data.url }
})

}

}
