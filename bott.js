// ===================== IMPORTS =====================
const express = require('express')
const app = express()

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const pino = require('pino')

// libs locais
const config = require('./config')
const db = require('./lib/db')
const user = require('./lib/user')

// ===================== EXPRESS (RENDER FIX) =====================
app.get('/', (req, res) => {
  res.send('TheBoys Bot online 🚀')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Server rodando na porta', process.env.PORT || 3000)
})

// ===================== CONTROLADORES =====================
let isReconnecting = false

// ===================== BOT START =====================
async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      browser: ['TheBoys Bot', 'Chrome', '1.0.0']
    })

    // salvar sessão
    sock.ev.on('creds.update', saveCreds)

    // conexão
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'open') {
        console.log('🚀 Bot ONLINE')
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode

        console.log('❌ Conexão fechou:', statusCode)

        // se logout real
        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
          console.log('🚫 Sessão expirada — precisa novo QR')
          return
        }

        // evita loop infinito
        if (isReconnecting) return
        isReconnecting = true

        console.log('🔁 Reconectando em 30s...')

        setTimeout(() => {
          isReconnecting = false
          startBot()
        }, 30000)
      }
    })

    // ===================== MENSAGENS =====================
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0]
      if (!msg.message) return

      const from = msg.key.remoteJid

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ''

      // ================= MENU =================
      if (body === '.menu') {
        await sock.sendMessage(from, {
          text: `
🔥 THEBOYS BOT

👤 .perfil
⛏ .minerar
🎮 .adivinha
🎰 .cassino
📊 .ranking
`
        })
      }

      // ================= PERFIL =================
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

      // ================= MINERAR =================
      if (body === '.minerar') {
        const gain = Math.floor(Math.random() * 50) + 1
        db.addGold(from, gain)

        await sock.sendMessage(from, {
          text: `⛏ Você minerou +${gain} gold!`
        })
      }
    })

    console.log('🚀 Bot iniciado com sucesso')

    // keep alive log (Render não dorme lógica)
    setInterval(() => {
      console.log('💓 bot alive')
    }, 60000)

  } catch (err) {
    console.log('❌ Erro no bot:', err)

    if (!isReconnecting) {
      isReconnecting = true

      setTimeout(() => {
        isReconnecting = false
        startBot()
      }, 30000)
    }
  }
}

// ===================== START =====================
startBot()
