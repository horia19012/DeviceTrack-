import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatMessage} from '../models/ChatMessage'; // Import ChatMessage interface
import {Status} from '../models/Status'; // Import Status enum
import {ChatWebSocketService} from '../services/chat-web-socket.service'; // Service for WebSocket communication

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @Input() messages: ChatMessage[] = []; // Messages for the chat
  @Input() targetUser: string = ''; // Target user's username
  currentUser: string = ''; // Distinguish between user and admin
  @Output() chatClosed: EventEmitter<void> = new EventEmitter<void>(); // Event to notify when chat is closed
  @Input() initialMessage: string = ''; // Receive the initial message

  newMessage: string = ''; // Input for new message
  username: string = ''; // Current user's username

  constructor(private chatWebSocketService: ChatWebSocketService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    if (this.username !== "admin") {
      this.targetUser = this.username;
    }

    // Subscribe to user's specific topic for incoming messages
    this.chatWebSocketService.connect(this.username);

    this.chatWebSocketService.messages$.subscribe((allMessages: ChatMessage[]) => {
      allMessages.forEach((msg) => {
        // Check if the message is relevant to the current chat
        if (msg.chatId === `${this.targetUser}-admin`) {
          // Only add the message if it doesn't already exist in the array
          if (!this.messages.some((m) => m.timestamp === msg.timestamp && m.message === msg.message)) {
            this.messages.push(msg);
          }
        }
      });

      // Sort the messages array by timestamp to ensure they are in order
      this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Manually trigger change detection
      this.cdr.detectChanges();
    });

    // Send the initial message if provided
    if (this.initialMessage.trim()) {
      const initialChatMessage: ChatMessage = {
        chatId: `${this.username}-admin`,
        senderName: this.username,
        receiverName: 'admin',
        message: this.initialMessage,
        timestamp: new Date(),
        status: Status.SENT,
      };

      // Ensure connection before sending
      this.chatWebSocketService.sendMessage('/app/chat/admin', initialChatMessage);
      // this.messages.push(initialChatMessage);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      if (this.username !== 'admin') {
        this.sendMessageToAdmin();
      } else {
        this.sendMessageToUser();
      }
    }
  }

  sendMessageToAdmin(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        chatId: `${this.username}-admin`,  // Unique chat ID
        senderName: this.username, // Sender is the current user
        receiverName: 'admin', // Hardcoded receiver for now
        message: this.newMessage, // The new message text
        timestamp: new Date(), // Current timestamp
        status: Status.SENT, // Set initial status to SENT
      };

      // Send the message via WebSocket service
      this.chatWebSocketService.sendMessage(`/app/chat/admin`, message);

      // Add the message to the local message array
      // this.messages.push(message);
      this.newMessage = ''; // Clear the input field
    }
  }

  sendMessageToUser(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        chatId: `${this.targetUser}-admin`, // Unique chat ID
        senderName: this.username, // Sender is the current user
        receiverName: this.targetUser, // Dynamic receiver
        message: this.newMessage, // The new message text
        timestamp: new Date(), // Current timestamp
        status: Status.SENT, // Set initial status to SENT
      };

      // Send the message via WebSocket service
      this.chatWebSocketService.sendMessage(`/app/chat/${this.targetUser}`, message);

      // Add the message to the local message array
      // this.messages.push(message);
      this.newMessage = ''; // Clear the input field
    }
  }

  closeChat(): void {
    this.chatClosed.emit(); // Notify the parent component that the chat is closed
  }

  printMessage() {
    console.log(this.messages);
  }
}
