const db = require('../lib/db')

module.exports = {

name: 'ranking',

async execute(sock, msg) {

const from = msg.key.remoteJid

db.all(
`SELECT * FROM users ORDER BY gold DESC LIMIT 10`,
[],
async (err, rows) => {

let text = '🏆 RANKING\n\n'

rows.forEach((u, i) => {
text += `${i + 1}. ${u.id.split('@')[0]} - ${u.gold}💰\n`
})

await sock.sendMessage(from, { text })

})

}

}
