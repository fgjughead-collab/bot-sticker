const fs = require('fs')

const dbPath = './database.json'

function getRanking() {
const data = JSON.parse(fs.readFileSync(dbPath))

return Object.entries(data.users)
.sort((a, b) => b[1].gold - a[1].gold)
.slice(0, 10)
}
module.exports = { getRanking }
