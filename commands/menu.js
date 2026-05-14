module.exports = {

name: 'menu',

async execute(sock, msg) {

const from = msg.key.remoteJid

await sock.sendMessage(from, {
text: `
╭━━🔥 THEBOYS BOT 🔥━━╮

👤 PERFIL
.perfil
.gold
.daily
.ranking

🎮 GAMES
.minerar
.cassino
.adivinha

📥 DOWNLOADS
.mp3 link
.mp4 link
.tiktok link
.facebook link
.instagram link

🛠 UTIL
.ping

👑 ADMIN
.menuadm

╰━━━━━━━━━━━━━━╯
`
})

}

}
