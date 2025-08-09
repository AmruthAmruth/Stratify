
import nodemailer from 'nodemailer'

export class EmailService{
    private transporter;
    constructor(){
        this.transporter=nodemailer.createTransport({
             host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
        })
    }

    async send(to:string,subject:string,text:string):Promise<void>{
        await this.transporter.sendMail({
      from: `"Stratify" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
        })
    }
}