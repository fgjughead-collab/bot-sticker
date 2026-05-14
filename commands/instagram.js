const dl = require('../lib/downloads')

module.exports = {

name: 'instagram',

async execute(sock, msg, args) {

const from = msg.key.remoteJid
const url = args[0]

if (!url) {

return sock.sendMessage(from, {
text: '❌ Envie link Instagram.'
})

}

await sock.sendMessage(from, {
text: '⏳ Baixando reel...'
})

const data = await dl.instagram(url)

if (!data || !data.video) {

return sock.sendMessage(from, {
text: '❌ Erro Instagram.'
})

}

await sock.sendMessage(from, {
video: { url: data.video }
})

}

}
