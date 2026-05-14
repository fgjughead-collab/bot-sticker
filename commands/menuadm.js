module.exports = {

name: 'menuadm',

async execute(sock, msg) {

const from = msg.key.remoteJid

await sock.sendMessage(from, {
text: `
👑 MENU ADMIN

🚫 .ban
✅ .unban
⚙ .vip
💰 .setgold
📢 .broadcast
`
})

}

}
