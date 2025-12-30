import { ContactMessageDTO } from "../../dto/ContactMessageDTO";

export interface ISendContactMessageUseCase {
    execute(data: ContactMessageDTO): Promise<void>;
}
