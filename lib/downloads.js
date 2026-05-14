const axios = require('axios')

/* YOUTUBE INFO */
async function ytInfo(url) {
try {
const res = await axios.get(
`https://api.savetube.me/api/video-info?url=${url}`
)
return res.data
} catch {
return null
}
}

/* YOUTUBE MP3 */
async function ytMP3(url) {
try {
const res = await axios.get(
`https://api.savetube.me/api/download/audio?url=${url}`
)
return res.data
} catch {
return null
}
}

/* YOUTUBE MP4 */
async function ytMP4(url) {
try {
const res = await axios.get(
`https://api.savetube.me/api/download/video?url=${url}`
)
return res.data
} catch {
return null
}
}

/* TIKTOK (via API alternativa) */
async function tiktok(url) {
try {
const res = await axios.get(
`https://api.tiklydown.eu.org/api/download?url=${url}`
)
return res.data
} catch {
return null
}
}

module.exports = {
ytInfo,
ytMP3,
ytMP4,
tiktok
}
