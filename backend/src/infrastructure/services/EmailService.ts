import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/repositories/IEmailService";
import logger from "../../shared/utils/logger";

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logger.warn("Email credentials are not configured. Skipping email delivery.");
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      logger.error("Failed to send email. Continuing registration flow.", { error });
    }  }
} 