import { Router } from 'express';
import multer from 'multer';
import { MailerController } from '../controllers/mailer-controller';

export const multerStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/mailer/uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix+'-'+cleanName)
  }
})

export class MailerRoutes {
  public router = Router();
  private controller = new MailerController();
  private upload = multer({ storage: multerStorage });

  constructor() {
    this.init()
  }

  private init() {
    this.router.get('/', this.controller.mailers);
    this.router.post('/', this.controller.registerMailer);
    this.router.get('/:id/detail', this.controller.mailer);
    this.router.put('/:id/update', this.controller.updateMailer);
    this.router.post('/:id/send', this.upload.array('attachments', 5), this.controller.sendMail);
  }
}