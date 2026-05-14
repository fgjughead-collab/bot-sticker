module.exports = {

name: 'menu',

async execute(sock, msg) {

await sock.sendMessage(msg.key.remoteJid, {
text: `
🔥 THEBOYS BOT 🔥

👤 .perfil
⛏ .minerar
🎮 .cassino
📊 .ranking
🏪 .shop
`
})

}
}
