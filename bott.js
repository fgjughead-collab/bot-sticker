import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import P from "pino";

const logger = P({ level: "silent" });

// 🔥 seu número (já no formato internacional correto)
const PHONE_NUMBER = "244942147501";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "connecting") {
      console.log("🔄 conectando...");
    }

    if (connection === "open") {
      console.log("✅ conectado");

      try {
        // gera pairing code quando necessário
        if (!sock.authState.creds.registered) {
          const code = await sock.requestPairingCode(PHONE_NUMBER);

          console.log("\n══════════════════════");
          console.log("📌 CÓDIGO WHATSAPP:");
          console.log(code);
          console.log("══════════════════════\n");
        }
      } catch (err) {
        console.log("❌ erro pairing:", err.message);
      }
    }

    if (connection === "close") {
      console.log("❌ caiu conexão, reiniciando...");

      setTimeout(() => {
        startBot();
      }, 3000);
    }
  });
}

startBot();
