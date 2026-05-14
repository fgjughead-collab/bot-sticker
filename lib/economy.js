const fs = require('fs')

const dbPath = './database.json'

function loadDB() {
return JSON.parse(fs.readFileSync(dbPath))
}

function saveDB(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function addUser(user) {
const db = loadDB()

if (!db.users[user]) {
db.users[user] = {
gold: 100,
xp: 0,
level: 1,
vip: false
}
saveDB(db)
}
}

function addGold(user, amount) {
const db = loadDB()
addUser(user)

db.users[user].gold += amount
saveDB(db)
}

function getProfile(user) {
const db = loadDB()
addUser(user)
return db.users[user]
}

module.exports = {
addUser,
addGold,
getProfile
}
