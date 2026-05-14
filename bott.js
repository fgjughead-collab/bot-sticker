const express = require("express")
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const app = express()

const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  res.send("💓 bot alive")
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server rodando na porta ${PORT}`)
})

let sock = null
let reconnecting = false

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("./auth")

    const { version } = await fetchLatestBaileysVersion()

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      browser: ["TheBoys", "Chrome", "1.0.0"]
    })

    sock.ev.on("creds.update", saveCreds)

    // =========================
    // CÓDIGO DE ASSOCIAÇÃO
    // =========================

    if (!sock.authState.creds.registered) {

      const numero = "244942147501"
      // troque pelo seu número
      // sem + sem espaço

      const code = await sock.requestPairingCode(numero)

      console.log(`
╔══════════════════════╗
   CÓDIGO WHATSAPP
╚══════════════════════╝

${code}

`)
    }

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update

      if (connection === "open") {
        console.log("🚀 Bot iniciado com sucesso")
        reconnecting = false
      }

      if (connection === "close") {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode

        console.log("❌ Conexão fechou:", statusCode)

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("⚠️ Sessão desconectada")
          return
        }

        if (reconnecting) return

        reconnecting = true

        try {
          sock.ws.close()
        } catch {}

        console.log("🔁 Reconectando em 10s...")

        setTimeout(() => {
          startBot()
        }, 10000)
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

      if (text.toLowerCase() === "ping") {
        await sock.sendMessage(from, {
          text: "pong 🏓"
        })
      }
    })

  } catch (err) {
    console.log("🔥 Erro geral:", err)

    reconnecting = false

    setTimeout(() => {
      startBot()
    }, 10000)
  }
}

startBot()

setInterval(() => {
  console.log("💓 bot alive")
}, 60000)

process.on("uncaughtException", (err) => {
  console.log("⚠️ uncaughtException:", err)
})

process.on("unhandledRejection", (err) => {
  console.log("⚠️ unhandledRejection:", err)
})
