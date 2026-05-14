const shop = require('../lib/shop')

module.exports = {

name: 'shop',

async execute(sock, msg) {

const from = msg.key.remoteJid

const items = shop.shopList()

let text = '🏪 LOJA\n\n'

for (let i in items) {
text += `🛒 ${i} - ${items[i]} gold\n`
}

await sock.sendMessage(from, { text })

}

}
