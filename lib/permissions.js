const db = require('./db')

function isOwner(user, config) {
return user === config.owner
}

function isAdmin(user) {
return new Promise((resolve) => {
db.get(`SELECT * FROM admins WHERE id = ?`, [user], (err, row) => {
resolve(!!row)
})
})
}

module.exports = {
isOwner,
isAdmin
}
