

import nodemailer from 'nodemailer'
import { IEmailService } from '../../domain/repositories/IEmailService';


export class EmailService implements IEmailService{
  private transporter;
  constructor(){
     this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

   async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  }


} 