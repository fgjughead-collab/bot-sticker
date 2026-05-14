const user = require('../lib/user')

module.exports = {

name: 'daily',

async execute(sock, msg) {

const from = msg.key.remoteJid
const userId =
msg.key.participant || msg.key.remoteJid

const gain = 500

user.addGold(userId, gain)

await sock.sendMessage(from, {
text: `🎁 Daily recebido: +${gain} gold`
})

}

}
