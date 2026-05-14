function detect(url) {

if (url.includes('youtube.com') || url.includes('youtu.be')) {
return 'youtube'
}

if (url.includes('tiktok.com')) {
return 'tiktok'
}

if (url.includes('facebook.com') || url.includes('fb.watch')) {
return 'facebook'
}

if (url.includes('instagram.com')) {
return 'instagram'
}

return null
}

module.exports = detect
