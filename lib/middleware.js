const fs = require('fs')

const dbFile = './database.json'

function load() {
return JSON.parse(fs.readFileSync(dbFile))
}

module.exports = async function middleware(sock, msg, cmd, userId) {

const db = load()

const from = msg.key.remoteJid

const isOwner = userId.includes(require('../config').owner)

const isAdmin = db.admins.includes(userId)

const isVip = db.vip.includes(userId)

const isBanned = db.banned.includes(userId)

/* 🚫 BAN CHECK */
if (isBanned) {
await sock.sendMessage(from, {
text: "🚫 Você está banido do bot."
})
return false
}

/* 👑 ADMIN COMMANDS */
const adminCommands = [
"ban",
"unban",
"vip",
"addgold",
"setadmin"
]

if (adminCommands.includes(cmd)) {

if (!isOwner && !isAdmin) {
await sock.sendMessage(from, {
text: "❌ Sem permissão."
})
return false
}

}

/* ⭐ VIP COMMANDS (exemplo futuro) */
const vipCommands = [
"cassino",
"daily"
]

if (vipCommands.includes(cmd)) {

if (!isVip && !isAdmin && !isOwner) {
await sock.sendMessage(from, {
text: "⭐ Apenas VIP pode usar este comando."
})
return false
}

}

return true
}
