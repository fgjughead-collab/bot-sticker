const fs = require('fs')

function log(text) {

const line =
`[${new Date().toISOString()}] ${text}\n`

console.log(line)

fs.appendFileSync('./logs/bot.log', line)
}

module.exports = { log }
