const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./bot.db')

db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS users (
id TEXT PRIMARY KEY,
gold INTEGER DEFAULT 100,
xp INTEGER DEFAULT 0,
level INTEGER DEFAULT 1
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS bans (
id TEXT PRIMARY KEY
)
`)
})

module.exports = db
