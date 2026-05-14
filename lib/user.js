const db = require('./db')

function createUser(id) {
db.run(`INSERT OR IGNORE INTO users (id) VALUES (?)`, [id])
}

function getUser(id) {
return new Promise((resolve) => {
db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
resolve(row)
})
})
}

function addGold(id, amount) {
db.run(`UPDATE users SET gold = gold + ? WHERE id = ?`, [amount, id])
}

function setGold(id, amount) {
db.run(`UPDATE users SET gold = ? WHERE id = ?`, [amount, id])
}

function addXP(id, amount) {
db.run(`UPDATE users SET xp = xp + ? WHERE id = ?`, [amount, id])
}

module.exports = {
createUser,
getUser,
addGold,
setGold,
addXP
}
