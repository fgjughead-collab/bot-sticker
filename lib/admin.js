const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function addAdmin(user) {
const data = db()

if (!data.admins.includes(user)) {
data.admins.push(user)
save(data)
}
}

function removeAdmin(user) {
const data = db()

data.admins = data.admins.filter(u => u !== user)
save(data)
}

function ban(user) {
const data = db()

if (!data.banned.includes(user)) {
data.banned.push(user)
save(data)
}
}

module.exports = {
addAdmin,
removeAdmin,
ban
}
