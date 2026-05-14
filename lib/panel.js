const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

/* BAN */
function ban(user) {
const data = db()
if (!data.banned.includes(user)) data.banned.push(user)
save(data)
}

/* UNBAN */
function unban(user) {
const data = db()
data.banned = data.banned.filter(u => u !== user)
save(data)
}

/* VIP */
function addVIP(user) {
const data = db()
if (!data.vip.includes(user)) data.vip.push(user)
save(data)
}

function removeVIP(user) {
const data = db()
data.vip = data.vip.filter(u => u !== user)
save(data)
}

/* ADMIN BOT */
function addAdmin(user) {
const data = db()
if (!data.admins.includes(user)) data.admins.push(user)
save(data)
}

function removeAdmin(user) {
const data = db()
data.admins = data.admins.filter(u => u !== user)
save(data)
}

/* GOLD */
function addGold(user, amount) {
const data = db()
if (!data.users[user]) return
data.users[user].gold += amount
save(data)
}

/* RESET USER */
function resetUser(user) {
const data = db()
if (!data.users[user]) return
data.users[user] = {
gold: 100,
xp: 0,
level: 1
}
save(data)
}

/* BROADCAST */
function broadcast(message) {
const data = db()

const users = Object.keys(data.users)

return users
}

module.exports = {
ban,
unban,
addVIP,
removeVIP,
addAdmin,
removeAdmin,
addGold,
resetUser,
broadcast
}
