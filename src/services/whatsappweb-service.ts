import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import Qrcode from 'qrcode'
import path from 'path'
import { SocketioService, socketIoService } from './socketio-service'

export class WASession {
  private client: Client
  private io: SocketioService
  public status: string = 'disconnect'
  public sessionID: string
  public phoneNumber: string|null = null

  constructor(io: SocketioService, sessionID: string) {
    this.io = io;
    this.sessionID = sessionID;
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionID,
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.initialize();
  }

  private initialize() {
    this.client.on('qr', async(qr) => {

      const qrDataURL = await Qrcode.toDataURL(qr);
      this.io.emit('whatsappweb:qr', { sessionID: this.sessionID, qr: qrDataURL });
      this.status = 'qr';
      console.log(`[INFO] WhatsappWeb QR: ${this.sessionID} ready`);

      this.client.on('authenticated', () => {
        this.status = 'authenticated'
        this.io.emit('whatsappweb:status', { sessionID: this.sessionID, status: this.status })
      })

      this.client.on('ready', async () => {
        const info = this.client.getNumberId;
        console.log(info)
        this.phoneNumber = info.toString()
      })
    })
  }

  public async sendMessage(number: string, message: string) {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    return this.client.sendMessage(chatId, message)
  }

  public destroy() {
    this.client.destroy();
    this.status = 'disconnect'
  }
}
