const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function addXP(user, amount) {
const data = db()

if (!data.users[user]) return

data.users[user].xp += amount

const levelUp = data.users[user].xp >= data.users[user].level * 100

if (levelUp) {
data.users[user].level += 1
data.users[user].xp = 0
}

save(data)
}

module.exports = { addXP }
