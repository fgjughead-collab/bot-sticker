const fs = require('fs')

const file = './database.json'

function load() {

if (!fs.existsSync(file)) {
fs.writeFileSync(file, JSON.stringify({ users: {} }, null, 2))
}

return JSON.parse(fs.readFileSync(file))
}

function save(data) {
fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

/* ================= USERS ================= */

function getUser(id) {

const db = load()
return db.users[id] || null

}

function createUser(id) {

const db = load()

if (!db.users[id]) {
db.users[id] = {
gold: 0,
xp: 0,
level: 1
}
}

save(db)

}

/* ================= GOLD ================= */

function addGold(id, amount) {

const db = load()

if (!db.users[id]) {
createUser(id)
return addGold(id, amount)
}

db.users[id].gold += amount

save(db)

}

/* ================= XP ================= */

function addXP(id, amount) {

const db = load()

if (!db.users[id]) {
createUser(id)
return addXP(id, amount)
}

db.users[id].xp += amount

if (db.users[id].xp >= 100) {
db.users[id].level += 1
db.users[id].xp = 0
}

save(db)

}

module.exports = {
getUser,
createUser,
addGold,
addXP
}
