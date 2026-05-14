const db = require('./db')

function createUser(id) {
return db.createUser(id)
}

function getUser(id) {
return db.getUser(id)
}

function addGold(id, amount) {
return db.addGold(id, amount)
}

function addXP(id, amount) {
return db.addXP(id, amount)
}

function getGold(id) {
const user = db.getUser(id)
return user?.gold || 0
}

function isUser(id) {
return db.getUser(id) !== null
}

module.exports = {
createUser,
getUser,
addGold,
addXP,
getGold,
isUser
}
