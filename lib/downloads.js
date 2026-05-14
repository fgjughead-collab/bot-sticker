const axios = require('axios')

async function request(url) {

try {

const res = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0'
},
timeout: 20000
})

return res.data

} catch (e) {

console.log('DOWNLOAD ERROR:', e.message)

return null
}

}

/* =========================
YOUTUBE INFO
========================= */

async function ytInfo(url) {

return await request(
`https://api.savetube.me/api/video-info?url=${encodeURIComponent(url)}`
)

}

/* =========================
YOUTUBE MP3
========================= */

async function ytMP3(url) {

return await request(
`https://api.savetube.me/api/download/audio?url=${encodeURIComponent(url)}`
)

}

/* =========================
YOUTUBE MP4
========================= */

async function ytMP4(url) {

return await request(
`https://api.savetube.me/api/download/video?url=${encodeURIComponent(url)}`
)

}

/* =========================
TIKTOK
========================= */

async function tiktok(url) {

return await request(
`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
)

}

/* =========================
FACEBOOK
========================= */

async function facebook(url) {

return await request(
`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
)

}

/* =========================
INSTAGRAM
========================= */

async function instagram(url) {

return await request(
`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
)

}

module.exports = {
ytInfo,
ytMP3,
ytMP4,
tiktok,
facebook,
instagram
}
