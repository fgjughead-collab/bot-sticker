const antispam = require('./antispam')
const cooldown = require('./cooldown')

async function middleware(sock, msg, cmd, user) {

if (antispam.isSpam(user, cmd)) {

await sock.sendMessage(msg.key.remoteJid, {
text: "🚫 Spam detectado."
})

return false
}

return true
}

module.exports = middleware
