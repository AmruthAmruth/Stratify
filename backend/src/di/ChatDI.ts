import { Server } from "socket.io";

import { MessageRepository } from "../infrastructure/repositories/MessageRepository";
import { ConversationRepository } from "../infrastructure/repositories/ConversationRepository";

import { SendMessageUseCase } from "../application/use-cases/chat/SendMessageUseCase";
import { CreateConversationUseCase } from "../application/use-cases/chat/CreateConversationUseCase";
import { GetMessageUseCase } from "../application/use-cases/chat/GetMessagesUseCase";
import { GetUserConversationUseCase } from "../application/use-cases/chat/GetUserConversationsUseCase";

import { SocketGateway } from "../interfaces/helpers/socketHandlers";


const messageRepository = new MessageRepository();
const conversationRepository = new ConversationRepository();


const sendMessageUseCase = new SendMessageUseCase(
  messageRepository,
  conversationRepository,
);
const getMessagesUseCase = new GetMessageUseCase(messageRepository);
const createConversationUseCase = new CreateConversationUseCase(
  conversationRepository,
);
const getUserConversationsUseCase = new GetUserConversationUseCase(
  conversationRepository,
);


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


export type SocketGatewayDependencies = {
  useCases: typeof useCases;
  repositories: typeof repositories;
};


export const createSocketGateway = (io: Server) =>
  new SocketGateway(io, useCases);
