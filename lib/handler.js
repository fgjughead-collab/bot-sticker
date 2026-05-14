function parseCommand(body, prefix) {

if (!body.startsWith(prefix)) return null

const args = body.slice(prefix.length).trim().split(" ")
const cmd = args.shift().toLowerCase()

return { cmd, args }
}

module.exports = { parseCommand }
