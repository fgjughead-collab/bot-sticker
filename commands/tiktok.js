const dl = require('../lib/downloads')

module.exports = {

name: 'tiktok',

async execute(sock, msg, args) {

const from = msg.key.remoteJid
const url = args[0]

const data = await dl.tiktok(url)

if (!data || !data.video) {

return sock.sendMessage(from, {
text: '❌ Erro TikTok.'
})
}

await sock.sendMessage(from, {
video: { url: data.video }
})

}

}
