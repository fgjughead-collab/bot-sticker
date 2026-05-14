function handleCommand(body, prefix) {
if (!body.startsWith(prefix)) return null

const args = body.slice(prefix.length).trim().split(" ")
const command = args.shift().toLowerCase()

return { command, args }
}

module.exports = { handleCommand }
