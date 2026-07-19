import { ISendContactMessageUseCase } from "../../interfaces/contact/ISendContactMessageUseCase";
import { ContactMessageDTO } from "../../dto/ContactMessageDTO";
import { IEmailService } from "../../../domain/repositories/IEmailService";
import { AppError } from "../../../interfaces/middleware/ErrorMiddleware";
import { Messages } from "../../../shared/constants/messages";
import { StatusCodes } from "../../../shared/constants/statusCodes";

export class SendContactMessageUseCase implements ISendContactMessageUseCase {
    constructor(private emailService: IEmailService) { }

    async execute(data: ContactMessageDTO): Promise<void> {
        // Validate input
        if (!data.name || !data.email || !data.subject || !data.message) {
            throw new AppError(Messages.MISSING_FIELDS, StatusCodes.BAD_REQUEST);
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new AppError(Messages.INVALID_EMAIL_FORMAT, StatusCodes.BAD_REQUEST);
        }

        // Prepare email content
        const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0f172a; margin-bottom: 5px; }
            .value { color: #1f2937; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission - Stratify</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the Stratify contact form</p>
              <p>Received at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

        // Send email to amruthshyju@gmail.com
        await this.emailService.sendEmail(
            "amruthshyju@gmail.com",
            `Stratify Contact Form: ${data.subject}`,
            emailHtml
        );
    }
}
