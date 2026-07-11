import { Request, Response } from "express";
import { ISendContactMessageUseCase } from "../../application/interfaces/contact/ISendContactMessageUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class ContactController {
    constructor(private sendContactMessageUseCase: ISendContactMessageUseCase) { }

    sendMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, subject, message } = req.body;

            await this.sendContactMessageUseCase.execute({
                name,
                email,
                subject,
                message,
            });

            res.status(StatusCodes.OK).json({
                success: true,
                message: Messages.CONTACT_SUCCESS,
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to send message",
            });
        }
    };
}
