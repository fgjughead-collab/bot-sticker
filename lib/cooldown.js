const cooldown = {}

function check(user, cmd, time) {
const key = user + cmd
const now = Date.now()

if (!cooldown[key]) {
cooldown[key] = now
return false
}

if (now - cooldown[key] < time) {
return true
}

cooldown[key] = now
return false
}

module.exports = { check }
