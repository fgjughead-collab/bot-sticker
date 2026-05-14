import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from '@whiskeysockets/baileys'

import pino from 'pino'

let pairingInProgress = false

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log('✅ Conectado com sucesso!')
      pairingInProgress = false
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode

      console.log('❌ conexão fechada:', statusCode)

      // evita crash infinito
      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(startBot, 5000)
      }
    }
  })

  // 🔥 PAIRING CODE CONTROLADO (SEM LOOP)
  if (!sock.authState.creds.registered && !pairingInProgress) {
    pairingInProgress = true

    const phoneNumber = '5511999999999' // <-- TROCA AQUI

    try {
      const code = await sock.requestPairingCode(phoneNumber)

      console.log('\n══════════════════════')
      console.log('🔑 CÓDIGO WHATSAPP:')
      console.log(code)
      console.log('══════════════════════\n')

      console.log('⏳ Aguarde o login no WhatsApp...')

      // bloqueia novo código por 2 minutos
      setTimeout(() => {
        pairingInProgress = false
      }, 2 * 60 * 1000)

    } catch (err) {
      console.log('Erro ao gerar pairing code:', err)
      pairingInProgress = false
    }
  }
}

startBot()
