import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from '@whiskeysockets/baileys'

import P from 'pino'

const logger = P({ level: 'silent' })

const PHONE_NUMBER = '5511999999999' // 🔥 TROCA AQUI

let sock = null
let reconnecting = false

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false
  })

  // salva sessão
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log('✅ Conectado com sucesso')

      // 🔥 pairing code SÓ AQUI
      try {
        if (!sock.authState.creds.registered) {
          const code = await sock.requestPairingCode(PHONE_NUMBER)
          console.log('\n══════════════════════')
          console.log('📌 SEU CÓDIGO WHATSAPP:')
          console.log(code)
          console.log('══════════════════════\n')
        }
      } catch (err) {
        console.log('❌ erro ao gerar pairing code:', err.message)
      }
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode

      console.log('❌ Conexão fechada:', statusCode)

      // 🔥 evita loop infinito no Railway
      if (!reconnecting) {
        reconnecting = true
        console.log('🔄 tentando reconectar em 5s...')
        setTimeout(() => {
          reconnecting = false
          startBot()
        }, 5000)
      }
    }

    if (connection === 'connecting') {
      console.log('🔄 conectando...')
    }
  })
}

// start inicial
startBot()
