import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";

import P from "pino";

const logger = P({ level: "silent" });

const PHONE_NUMBER = "5511999999999"; // 🔥 TROCA AQUI

let sock = null;
let pairingSent = false;
let isReconnecting = false;

async function startBot() {
  if (sock) {
    console.log("⚠️ Bot já está rodando...");
    return;
  }

  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      console.log("🔄 conectando...");
    }

    if (connection === "open") {
      console.log("✅ WhatsApp conectado");

      // 🔑 pairing code SÓ UMA VEZ por sessão
      if (!sock.authState.creds.registered && !pairingSent) {
        try {
          const code = await sock.requestPairingCode(PHONE_NUMBER);

          pairingSent = true;

          console.log("\n══════════════════════");
          console.log("📌 CÓDIGO WHATSAPP:");
          console.log(code);
          console.log("══════════════════════\n");
        } catch (err) {
          console.log("❌ erro ao gerar pairing:", err.message);
        }
      }
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log("❌ conexão fechada:", statusCode);

      sock = null;
      pairingSent = false;

      // ❌ evita loop infinito
      if (!isReconnecting) {
        isReconnecting = true;

        console.log("🔄 reconectando em 5s...");

        setTimeout(() => {
          isReconnecting = false;
          startBot();
        }, 5000);
      }
    }
  });
}

startBot();
