import {Status} from './Status';

export interface ChatMessage {
  chatId: string; // Unique identifier for the chat
  senderName: string; // Name of the sender
  receiverName: string; // Name of the receiver
  message: string; // The chat message content
  timestamp: Date; // The date and time of the message
  status: Status; // The status of the message
}
