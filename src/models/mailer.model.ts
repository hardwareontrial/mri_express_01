import { Schema, model } from 'mongoose'
import { MailerDoc } from '../types/mailer.types'

const MailerSchema = new Schema<MailerDoc>({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  service: { type: String, required: true, enum: ['gmail', 'yahoo', 'outlook'] },
  host: { type: String, required: false, default: '' },
  port: { type: Number, required: false },
  secure: { type: Boolean, required: false },
  authType: { type: String, required: true, enum: ['app_password', 'oauth2'] },
  clientID: { type: String, required: false, default: '' },
  clientSecret: { type: String, required: false, default: '' },
  refreshToken: { type: String, required: false, default: '' },
},{
  collection: 'mailer',
  timestamps: false,
  strict: false,
});

MailerSchema.pre('save', async function (next): Promise<void> {
  if(this.service === 'gmail') {
    this.host = 'smtp.gmail.com'
  }

  if(this.port === undefined || this.port === 0) {
    this.port = 465
  }

  if(this.port === 465) {
    this.secure = true
  } else if( this.port === 587) {
    this.secure = true
  } else {
    this.secure = false
  }

  next()
})

export const MailerModel = model<MailerDoc>('Mailer', MailerSchema);