const fs = require('fs')

const file = './database.json'

function load() {

if (!fs.existsSync(file)) {
fs.writeFileSync(file, JSON.stringify({ users: {} }))
}

return JSON.parse(fs.readFileSync(file))
}

function save(data) {
fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

module.exports = {
get() {
return load()
},

setUser(id, data) {

const db = load()

db.users[id] = data

save(db)

},

getUser(id) {

const db = load()

return db.users[id] || null

},

addGold(id, amount) {

const db = load()

if (!db.users[id]) {
db.users[id] = { gold: 0, xp: 0, level: 1 }
}

db.users[id].gold += amount

save(db)

}

}
