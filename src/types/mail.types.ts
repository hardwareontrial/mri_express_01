export interface EmailConfig {
  host: string | undefined
  port: number
  secure: boolean
  user: string
  password: string
}

export interface SendEmailOptions {
  senderKey: string // konfigurasi smtp yang dipakai
  to: string | string[]
  subject: string
  text?: string
  html?: string
  fromOverride?: string // override 'from'
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  filename: string
  path?: string
  content?: Buffer | string
  contentType?: string
}

export interface EmailJobData {
  senderKey: string
  to: string
  subject: string
  text?: string
  html?: string
  fromOverride?: string // override 'from'
  attachments?: {
    filename: string
    path: string
  }[]
}

export const ConnectionJob = {
  host: '127.0.0.1',
  port: 6379
}

