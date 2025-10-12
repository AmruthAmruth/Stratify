import { Server } from "socket.io";

// ---------------------------
// Repositories
// ---------------------------
import { MessageRepository } from "../infrastructure/repositories/MessageRepository";
import { ConversationRepository } from "../infrastructure/repositories/ConversationRepository";

// ---------------------------
// Use Cases
// ---------------------------
import { SendMessageUseCase } from "../application/use-cases/chat/SendMessageUseCase";
import { CreateConversationUseCase } from "../application/use-cases/chat/CreateConversationUseCase";
import { GetMessageUseCase } from "../application/use-cases/chat/GetMessagesUseCase";
import { GetUserConversationUseCase } from "../application/use-cases/chat/GetUserConversationsUseCase";

// ---------------------------
// Socket Gateway
// ---------------------------
import { SocketGateway } from "../interfaces/helpers/socketHandlers";

// ---------------------------
// Repository Instances
// ---------------------------
const messageRepository = new MessageRepository();
const conversationRepository = new ConversationRepository();

// ---------------------------
// Use Case Instances
// ---------------------------
const sendMessageUseCase = new SendMessageUseCase(messageRepository, conversationRepository);
const getMessagesUseCase = new GetMessageUseCase(messageRepository);
const createConversationUseCase = new CreateConversationUseCase(conversationRepository);
const getUserConversationsUseCase = new GetUserConversationUseCase(conversationRepository);

// ---------------------------
// Exported Dependencies
// ---------------------------
export const useCases = {
  sendMessageUseCase,
  getMessagesUseCase,
  createConversationUseCase,
  getUserConversationsUseCase,
};

export const repositories = {
  messageRepository,
  conversationRepository,
};

// ---------------------------
// Type Definition
// ---------------------------
export type SocketGatewayDependencies = {
  useCases: typeof useCases;
  repositories: typeof repositories;
};

// ---------------------------
// Factory Function
// ---------------------------
// Since `SocketGateway` no longer uses repositories directly, 
// we only pass `useCases` to keep dependencies minimal and clean.
export const createSocketGateway = (io: Server) => {
  return new SocketGateway(io, useCases);
};
 