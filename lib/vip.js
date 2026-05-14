const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function addVIP(user) {
const data = db()

if (!data.vip.includes(user)) {
data.vip.push(user)
save(data)
}
}

function removeVIP(user) {
const data = db()

data.vip = data.vip.filter(u => u !== user)
save(data)
}

module.exports = {
addVIP,
removeVIP
}
