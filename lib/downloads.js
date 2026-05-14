const axios = require('axios')

async function ytSearch(url) {
try {
const res = await axios.get(`https://api.savetube.me/api/video-info?url=${url}`)
return res.data
} catch (e) {
return null
}
}

async function downloadMP3(url) {
try {
const res = await axios.get(`https://api.savetube.me/api/download/audio?url=${url}`)
return res.data
} catch (e) {
return null
}
}

async function downloadMP4(url) {
try {
const res = await axios.get(`https://api.savetube.me/api/download/video?url=${url}`)
return res.data
} catch (e) {
return null
}
}

module.exports = {
ytSearch,
downloadMP3,
downloadMP4
}
