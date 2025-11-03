import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { MailerService } from '../services/mailer-service';
import { IMailerAttachment } from './../types/mailer.types';

export class MailerController {
  private service = new MailerService();

  public mailers = async (req:Request, res:Response, _next:NextFunction) => {
    try {
      const response = await this.service.mailersList()
      res.json(response)
    } catch (error) {
      _next(error)
    }
  }

  public mailer = async (req:Request, res:Response, _next:NextFunction) => {
    try {
      const { id } = req.params
      const response = await this.service.detailMailer(id);
      res.json(response)
    } catch (error) {
      _next(error)
    }
  }

  public registerMailer = async (req:Request, res:Response, _next:NextFunction) => {
    try {
      const { form } = req.body;
      const created = await this.service.register(form);
      res.json(created)
    } catch (error) {
      _next(error)
    }
  }

  public updateMailer = async (req:Request, res:Response, _next:NextFunction) => {
    try {
      const { data } = req.body
      const { id } = req.params
      const updated = await this.service.updateMailer(id, data);
      res.json(updated)
    } catch (error) {
      _next(error)
    }
  }

  public sendMail = async (req:Request, res:Response, _next:NextFunction) => {
    try {
      console.log(req)
      const { id } = req.params;
      const { to, cc, bcc, subject, subSubject, body } = req.body;

      let attachments:IMailerAttachment[] = [];

      if(req.files) {
        const uploadedFiles = req.files as Express.Multer.File[]
        attachments = uploadedFiles.map(file => ({
          filename: file.originalname,
          path: path.join(path.resolve(), file.path)
        }))
      }

      const sending = await this.service.sendMailer(id, to, cc, bcc, subject, subSubject, body, attachments)
      res.json(sending)
    } catch (error) {
      console.error(error)
      _next(error)
    }
  }
}