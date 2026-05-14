const user = require('../lib/user')

module.exports = {

name: 'perfil',

async execute(sock, msg) {

const from = msg.key.remoteJid
const userId =
msg.key.participant || msg.key.remoteJid

const data = await user.getUser(userId)

await sock.sendMessage(from, {
text: `
👤 PERFIL

💰 Gold: ${data.gold}
⭐ XP: ${data.xp}
📊 Level: ${data.level}
`
})

}

}
