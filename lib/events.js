const frases = [
"🔥 Hoje é dia de ganhar gold!",
"💰 O TheBoys Bot está ativo!",
"🎮 Bora farmar XP!",
"👑 Quem será o top 1 hoje?"
]

function randomEvent() {
return frases[Math.floor(Math.random() * frases.length)]
}

module.exports = { randomEvent }
