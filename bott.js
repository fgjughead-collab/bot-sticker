const express = require("express")
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")

/* ================= EXPRESS SERVER ================= */

const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("💓 bot alive")
})

app.listen(PORT, "0.0.0.0", () => {
  console.log("🌐 Server rodando na porta", PORT)
})

/* ================= BOT ================= */

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("./auth")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update

      if (connection === "open") {
        console.log("🚀 Bot iniciado com sucesso")
      }

      if (connection === "close") {
        console.log("❌ Conexão fechou:", lastDisconnect?.error?.message)

        console.log("🔁 Reconectando...")
        setTimeout(() => {
          startBot()
        }, 5000)
      }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0]

      if (!msg.message) return

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text

      if (!text) return

      if (text === "ping") {
        await sock.sendMessage(msg.key.remoteJid, {
          text: "pong 🏓"
        })
      }
    })

    return sock
  } catch (err) {
    console.log("🔥 Erro no bot:", err)

    setTimeout(() => {
      startBot()
    }, 5000)
  }
}

/* ================= START ================= */

startBot()

/* ================= PROTEÇÃO ================= */

process.on("uncaughtException", (err) => {
  console.log("⚠️ uncaughtException:", err)
})

process.on("unhandledRejection", (err) => {
  console.log("⚠️ unhandledRejection:", err)
})

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM recebido, mantendo processo vivo")
})

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT recebido")
})
