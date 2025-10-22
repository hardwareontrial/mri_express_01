import nodemailer, { Transporter } from 'nodemailer';
import { EmailConfig, SendEmailOptions } from '../types/mail.types';

export class EmailService {
  private static instance: EmailService
  private transporterMap: Map<string, Transporter> = new Map();
  private configMap: Map<string, EmailConfig> = new Map();

  private constructor() {}

  public static getInstance(): EmailService {
    if(!EmailService.instance) {
      EmailService.instance = new EmailService();
    }

    return EmailService.instance;
  }

  registerConfig(key: string, config: EmailConfig) {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    this.configMap.set(key, config);
    this.transporterMap.set(key, transporter);
  }

  async sendMail(options: SendEmailOptions) {
    const { senderKey, to, subject, text, html, fromOverride, attachments } = options;
    const transporter = this.transporterMap.get(senderKey);
    const config = this.configMap.get(senderKey);

    if(!transporter || !config) throw new Error(`Email Transporter/Konfigurasi SMTP tidak ditemukan.`);

    const from = fromOverride || config.user;

    return transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      attachments
    })
  }
}

export const emailService = EmailService.getInstance();
export default emailService;