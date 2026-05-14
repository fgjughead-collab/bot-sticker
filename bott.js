// =====================
// 1. IMPORTS
// =====================
const express = require('express')
const app = express()

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const pino = require('pino')
const fs = require('fs')

const config = require('./config')
const db = require('./lib/db')
const user = require('./lib/user')

// =====================
// 2. WEB SERVER (RENDER FIX)
// =====================
app.get('/', (req, res) => {
  res.send('TheBoys Bot online 🚀')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Server rodando na porta', process.env.PORT || 3000)
})

// =====================
// 3. BOT CORE
// =====================
async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true
    })

    // salvar login
    sock.ev.on('creds.update', saveCreds)

    // conexão
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'open') {
        console.log('✅ TheBoys Bot ONLINE')
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode

        console.log('❌ Conexão fechou:', statusCode)

        if (statusCode !== DisconnectReason.loggedOut) {
          console.log('🔁 Reconectando...')
          setTimeout(startBot, 5000)
        } else {
          console.log('🚫 Sessão encerrada. Precisa novo QR.')
        }
      }
    })

    // mensagens
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0]
      if (!msg.message) return

      const from = msg.key.remoteJid
      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ''

      // =====================
      // MENU
      // =====================
      if (body === '.menu') {
        await sock.sendMessage(from, {
          text: `
🔥 TheBoys Bot

👤 .perfil
⛏ .minerar
🎮 .adivinha 1-5
🎰 .cassino
📊 .ranking
`
        })
      }

      // =====================
      // PERFIL
      // =====================
      if (body === '.perfil') {
        const u = user.getUser(from) || { gold: 0, xp: 0, level: 1 }

        await sock.sendMessage(from, {
          text: `
👤 PERFIL

💰 Gold: ${u.gold}
⭐ XP: ${u.xp}
📊 Level: ${u.level}
`
        })
      }

      // =====================
      // MINERAR
      // =====================
      if (body === '.minerar') {
        const gain = Math.floor(Math.random() * 50) + 1
        db.addGold(from, gain)

        await sock.sendMessage(from, {
          text: `⛏ Você minerou +${gain} gold!`
        })
      }
    })

    console.log('🚀 Bot iniciado com sucesso')

  } catch (err) {
    console.log('❌ Erro no bot:', err)
    setTimeout(startBot, 5000)
  }
}

// =====================
// START
// =====================
startBot()
