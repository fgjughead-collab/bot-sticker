const users = {}

function isSpam(user, cmd) {
const now = Date.now()

if (!users[user]) {
users[user] = {}
}

if (!users[user][cmd]) {
users[user][cmd] = now
return false
}

const diff = now - users[user][cmd]

if (diff < 1500) {
return true
}

users[user][cmd] = now
return false
}

module.exports = { isSpam }
