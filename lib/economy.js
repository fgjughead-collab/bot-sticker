const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function createUser(id) {
const data = db()

if (!data.users[id]) {
data.users[id] = {
gold: 100,
xp: 0,
level: 1
}
save(data)
}
}

function getUser(id) {
const data = db()
createUser(id)
return data.users[id]
}

function addGold(id, value) {
const data = db()
createUser(id)

data.users[id].gold += value
save(data)
}

module.exports = {
createUser,
getUser,
addGold
}
