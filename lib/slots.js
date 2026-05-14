const eco = require('./economy')

function slots(user) {

const icons = ["🍒","🍋","🍇","💎","7️⃣"]

const r = [
icons[Math.floor(Math.random()*icons.length)],
icons[Math.floor(Math.random()*icons.length)],
icons[Math.floor(Math.random()*icons.length)]
]

if (r[0] === r[1] && r[1] === r[2]) {
eco.addGold(user, 200)
return `🎰 ${r.join(" | ")}\n🔥 JACKPOT! +200 gold`
}

eco.addGold(user, -20)
return `🎰 ${r.join(" | ")}\n❌ Perdeu 20 gold`
}

module.exports = { slots }
