import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // 🔴 desliga QR
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update

    if (connection === 'open') {
      console.log('✅ Bot conectado!')
    }

    if (connection === 'close') {
      console.log('❌ conexão fechou, reiniciando...')
      startBot()
    }
  })

  // 🔥 ISSO AQUI GERA O CÓDIGO (SEM QR)
  const phoneNumber = '5511999999999' // 👈 SEU NÚMERO (com DDI)

  try {
    const code = await sock.requestPairingCode(phoneNumber)
    console.log(`
╔══════════════════════╗
   CÓDIGO WHATSAPP
╚══════════════════════╝
${code}
`)
  } catch (err) {
    console.log('Erro pairing code:', err)
  }
}

startBot()
