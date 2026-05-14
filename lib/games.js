const eco = require('./economy')

function adivinha(user, guess) {
const num = Math.floor(Math.random() * 5) + 1

if (parseInt(guess) === num) {
eco.addGold(user, 50)
return "🎉 Você ganhou 50 gold!"
}

return `❌ Errou! Era ${num}`
}

function cassino(user) {
const win = Math.random() > 0.5

if (win) {
eco.addGold(user, 100)
return "🎰 Você ganhou 100 gold!"
}

eco.addGold(user, -50)
return "💀 Você perdeu 50 gold!"
}

module.exports = { adivinha, cassino }
