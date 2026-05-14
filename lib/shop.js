const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function buy(user, item, price) {
const data = db()

if (data.users[user].gold < price) {
return "❌ Sem gold suficiente"
}

data.users[user].gold -= price
data.users[user].items = data.users[user].items || []
data.users[user].items.push(item)

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

return `✅ Comprou ${item}`
}

module.exports = { buy }
