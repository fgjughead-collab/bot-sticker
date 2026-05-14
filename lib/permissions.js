const db = require('../database.json')
const config = require('../config')

function isOwner(user) {
return user.includes(config.owner)
}

function isAdminBot(user) {
return db.admins.includes(user) || isOwner(user)
}

function isVIP(user) {
return db.vip.includes(user)
}

function isBanned(user) {
return db.banned.includes(user)
}

function getRole(user) {
if (isOwner(user)) return "OWNER"
if (isAdminBot(user)) return "ADMIN"
if (isVIP(user)) return "VIP"
return "USER"
}

module.exports = {
isOwner,
isAdminBot,
isVIP,
isBanned,
getRole
}
