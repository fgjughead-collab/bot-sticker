module.exports = {

name: 'menu',

async execute(sock, msg) {

const from = msg.key.remoteJid

await sock.sendMessage(from, {
text: `
╭━━🔥 THEBOYS BOT 🔥━━╮

👤 .perfil
⛏ .minerar
🎮 .cassino
📊 .ranking
🏪 .shop

📥 DOWNLOADS
🎵 .mp3 link
🎥 .mp4 link
🎬 .tiktok link

👑 .menuadm

╰━━━━━━━━━━━━━━╯
`
})

}

}
