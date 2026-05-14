const dl = require('../lib/downloads')

module.exports = {

name: 'mp3',

async execute(sock, msg, args) {

const from = msg.key.remoteJid
const url = args[0]

if (!url) {
return sock.sendMessage(from, {
text: '❌ Envie um link.'
})
}

await sock.sendMessage(from, {
text: '⏳ Baixando áudio...'
})

const data = await dl.ytMP3(url)

if (!data || !data.url) {

return sock.sendMessage(from, {
text: '❌ Falha no download.'
})
}

await sock.sendMessage(from, {
audio: { url: data.url },
mimetype: 'audio/mp4'
})

}

}
