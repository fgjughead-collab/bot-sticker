const fs = require('fs')
const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function isOwner(user, config) {
return user === config.owner
}

function isAdmin(user) {
const data = db()
return data.admins.includes(user)
}

function isVIP(user) {
const data = db()
return data.vip.includes(user)
}

module.exports = { isOwner, isAdmin, isVIP }
