import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import pino from "pino"
import express from "express"

const app = express()
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.send("Bot online")
})

app.listen(PORT, () => {
  console.log(`🌐 Server rodando na porta ${PORT}`)
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info")

  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("📌 Escaneie o QR Code no Railway logs")
      console.log(qr)
    }

    if (connection === "open") {
      console.log("✅ BOT CONECTADO COM SUCESSO")
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

      console.log("❌ conexão fechada")

      if (shouldReconnect) {
        console.log("🔄 reconectando...")
        startBot()
      }
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]

    if (!msg.message) return

    const from = msg.key.remoteJid

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    console.log("📩 Mensagem:", text)

    if (text.toLowerCase() === "ping") {
      await sock.sendMessage(from, {
        text: "pong 🏓"
      })
    }
  })
}

startBot()
