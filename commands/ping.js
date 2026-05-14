module.exports = {

name: 'ping',

async execute(sock, msg) {

const from = msg.key.remoteJid

await sock.sendMessage(from, {
text: '🏓 Pong!'
})

}

}
