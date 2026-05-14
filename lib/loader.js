const fs = require('fs')

function loadCommands() {

const commands = {}

const files = fs.readdirSync('./commands')

for (const file of files) {

const cmd =
require(`../commands/${file}`)

commands[cmd.name] = cmd
}

return commands
}

module.exports = loadCommands
