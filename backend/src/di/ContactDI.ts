import { EmailService } from "../infrastructure/services/EmailService";
import { SendContactMessageUseCase } from "../application/use-cases/contact/SendContactMessageUseCase";
import { ContactController } from "../interfaces/controllers/ContactController";

export const contactDI = () => {
    const emailService = new EmailService();
    const sendContactMessageUseCase = new SendContactMessageUseCase(emailService);

    return new ContactController(sendContactMessageUseCase);
};
