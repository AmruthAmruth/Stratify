

import nodemailer from 'nodemailer'

export class EmailService{
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