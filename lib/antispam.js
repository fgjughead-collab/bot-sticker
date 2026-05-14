const users = {}

function isSpam(user) {
const now = Date.now()

if (!users[user]) {
users[user] = { last: now, count: 1 }
return false
}

const diff = now - users[user].last

if (diff < 2000) {
users[user].count += 1
} else {
users[user].count = 1
}

users[user].last = now

if (users[user].count > 5) {
return true
}

return false
}

module.exports = { isSpam }
