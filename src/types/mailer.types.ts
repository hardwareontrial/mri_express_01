import { Document } from "mongoose"

export interface Mailer {
  name: string
  displayName: string
  user: string
  password: string
  service: 'gmail'|'yahoo'|'outlook'
  host?: string
  port?: number
  secure?: boolean
  authType: 'app_password'|'oauth2'
  clientID?: string
  clientSecret?: string
  refreshToken?: string
}

export interface MailerDoc extends Document {
  name: string
  displayName: string
  user: string
  password: string
  service: 'gmail'|'yahoo'|'outlook'
  host?: string
  port?: number
  secure?: boolean
  authType: 'app_password'|'oauth2'
  clientID?: string
  clientSecret?: string
  refreshToken?: string
}

export interface IMailerAttachment {
  filename: string
  path: string
  cid?: string
}