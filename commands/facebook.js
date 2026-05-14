const dl = require('../lib/downloads')

module.exports = {

name: 'facebook',

async execute(sock, msg, args) {

const from = msg.key.remoteJid
const url = args[0]

if (!url) {

return sock.sendMessage(from, {
text: '❌ Envie um link do Facebook.'
})

}

await sock.sendMessage(from, {
text: '⏳ Baixando vídeo...'
})

const data = await dl.facebook(url)

if (!data || !data.video) {

return sock.sendMessage(from, {
text: '❌ Não consegui baixar.'
})

}

await sock.sendMessage(from, {
video: { url: data.video }
})

}

}
