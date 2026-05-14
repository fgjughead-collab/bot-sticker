const fs = require('fs')

const dbPath = './database.json'

function db() {
return JSON.parse(fs.readFileSync(dbPath))
}

function save(data) {
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

/* ITENS DA LOJA */
const items = {
"espada": 200,
"escudo": 150,
"vip": 500,
"boost": 300
}

function shopList() {
return items
}

/* COMPRAR ITEM */
function buy(user, item) {

const data = db()

if (!items[item]) return "❌ Item inválido"

if (!data.users[user]) return "❌ Usuário não existe"

if (data.users[user].gold < items[item]) {
return "❌ Gold insuficiente"
}

data.users[user].gold -= items[item]

if (!data.users[user].items) {
data.users[user].items = []
}

data.users[user].items.push(item)

save(data)

return `✅ Comprou ${item}`
}

module.exports = {
shopList,
buy
}
