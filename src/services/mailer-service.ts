import { Types, HydratedDocument } from 'mongoose'
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { MailerModel } from '../models/mailer.model';
import { Mailer, MailerDoc, IMailerAttachment } from './../types/mailer.types'

export class MailerService {
  private static instance: MailerService
  public transportCache = new Map()

  constructor() {}

  public static getInstance(): MailerService {
    if(!MailerService.instance) {
      MailerService.instance = new MailerService();
    }

    return MailerService.instance;
  }

  async register(data:Partial<Mailer>) {
    const mailer:HydratedDocument<MailerDoc> = await MailerModel.create(data);
    return mailer
  }

  async mailersList() {
    return await MailerModel.find().lean();
  }

  async detailMailer(id:string) {
    const objID = new Types.ObjectId(id);
    return await MailerModel.findOne({ _id: objID }).lean();
  }

  async updateMailer(id:string, data:Partial<Mailer>) {
    const objID = new Types.ObjectId(id);
    await MailerModel.findByIdAndUpdate(objID, data);
    return await this.detailMailer(id)
  }

  async getTransporter(senderId:string) {
    if(this.transportCache.get(senderId)) {
      return this.transportCache.get(senderId)
    }
    
    let transporter;

    const sender = await this.detailMailer(senderId);
    if(!sender) throw new Error('Tidak ada sender yang cocok')

    if(sender.authType === 'app_password') {
      transporter = nodemailer.createTransport({
        // service: sender.service,
        host: sender.host,
        port: sender.port,
        secure: sender.secure,
        pool: true,
        maxConnections: 3,
        auth: {
          user: sender.user,
          pass: sender.password
        },
        tls: {
          rejectUnauthorized: false
        }
      })
    }

    // if(sender.authType === 'oauth2') {
    //   const oAuth2Client = new google.auth.OAuth2(sender.user, sender.clientSecret, 'https://developers.google.com/oauthplayground');
    //   oAuth2Client.setCredentials({ refresh_token: sender.refreshToken })
    //   const accessToken = (await oAuth2Client.getAccessToken()).token;

    //   // transporter = nodemailer.createTransport({
    //   //   service: sender.service,
    //   //   pool: true,
    //   //   maxConnections: 3,
    //   //   auth: {
    //   //     type: 'OAuth2',
    //   //     user: sender.user,
    //   //     clientId: sender.clientID,
    //   //     clientSecret: sender.clientSecret,
    //   //     refreshToken: sender.refreshToken,
    //   //     accessToken: accessToken  // error
    //   //   }
    //   // })
    // }

    this.transportCache.set(sender._id, transporter);
    return transporter;
  }

  async sendMailer(
    senderId:string,
    to:string,
    cc:string,
    bcc:string,
    subject:string,
    subSubject: string,
    body:any,
    attachments:IMailerAttachment[]
  ) {
    const transporter = await this.getTransporter(senderId);

    const mailerConf = await this.detailMailer(senderId);
    const logo = [
      {
        filename: 'logo.png',
        path: path.join(path.resolve(), 'public/images/logo', 'mri12864.png'),
        cid: 'logo@mailer'
      }
    ];
    const bodyDefault = attachments.length > 0 ? 'Email ini berisi lampiran file, dikirim otomatis oleh sistem.' : 'Email ini dikirim otomatis oleh sistem.'

    const htmlContent = `
      <body style="background-color: #f9fafb; font-family: 'Arial', sans-serif; margin: 0; padding: 20px;">
        <div style="max-width: 480px; background-color: #ffffff; margin: 0 auto; padding: 24px 32px; border: 1px solid #e2e8f0; border-radius: 6px; color: #111827;" role="article" aria-label="Automatic Email">
          <div style="-webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: contain; mask-size: contain; margin-bottom: 20px;" aria-hidden="true">
            <img src="logo/mri12864.png" alt="logo-mailer" style="width: 15%; height: auto;">
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">
            ${subSubject || 'Email Notifikasi'}
          </h2>
          <hr style="border: none; border-top: 1px solid #e4e7eb; margin: 28px 0"/>
          <p style="font-size: 14px; line-height: 20px; margin: 0 0 24px 0; color: #4b5563;">
            ${body || bodyDefault}
          </p>
          <hr style="border: none; border-top: 1px solid #e4e7eb; margin: 28px 0"/>
          <div style="font-size: 12px; color: #9ca3af;" aria-label="Email footer">
            <strong style="color: #111827;">&copy; ${new Date().getFullYear()} PT. Molindo Raya Industrial</strong>
            <small style="color: #a6a6a6; text-decoration: none; margin-left: 8px;">Email dikirim otomatis oleh sistem.</small>
          </div>
        </div>
      </body>
    `;

    const mailOpts = {
      from: `${mailerConf?.displayName} <${mailerConf?.user}>`,
      to,
      cc,
      bcc,
      subject: subject || 'Notifikasi Otomatis',
      html: htmlContent,
      attachments: [...logo, ...attachments]
    }

    const info = await transporter.sendMail(mailOpts);
    // console.log(transporter) 
    // console.log("Message sent: %s", info.messageId)
    
    if(attachments.length > 0){
      attachments.forEach((file:IMailerAttachment) => fs.unlinkSync(file.path))
    }

    return info;
  }
}

export const mailerService = MailerService.getInstance();