function isUrl(text) {
return text.startsWith('http')
}

function formatNumber(num) {
return num.toLocaleString()
}

module.exports = {
isUrl,
formatNumber
}
