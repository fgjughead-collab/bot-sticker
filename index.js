import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";

import pino from "pino";

const PHONE_NUMBER = "244942147501";

let reconnectAttempts = 0;
const MAX_RECONNECT = 5;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      console.log("🔄 conectando...");
    }

    if (connection === "open") {
      console.log("✅ BOT ONLINE");

      reconnectAttempts = 0;

      // só gera código se NÃO estiver logado ainda
      if (!sock.authState.creds.registered) {
        try {
          await new Promise(r => setTimeout(r, 10000)); // 👈 delay forte evita expiração

          const code = await sock.requestPairingCode(PHONE_NUMBER);

          console.log("\n📌 CÓDIGO WHATSAPP:", code, "\n");
        } catch (e) {
          console.log("Erro pairing:", e.message);
        }
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      console.log("❌ conexão fechou:", reason);

      // evita loop infinito de restart
      if (reconnectAttempts >= MAX_RECONNECT) {
        console.log("⛔ muitas tentativas, parando bot.");
        return;
      }

      reconnectAttempts++;

      const delay = 5000 * reconnectAttempts;

      console.log(`🔄 reconectando em ${delay / 1000}s...`);

      setTimeout(startBot, delay);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const from = msg.key.remoteJid;

    if (text === "!ping") {
      await sock.sendMessage(from, { text: "pong 🟢" });
    }

    if (text === "!oi") {
      await sock.sendMessage(from, { text: "oi 😎" });
    }
  });
}

startBot();
