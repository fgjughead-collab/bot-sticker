const axios = require('axios')

async function downloadMedia(url) {
if (!url.startsWith("http")) return null

try {
const res = await axios.get(`https://api.savetube.me/api/info?url=${url}`)
return res.data
} catch (e) {
return null
}
}

module.exports = { downloadMedia }
