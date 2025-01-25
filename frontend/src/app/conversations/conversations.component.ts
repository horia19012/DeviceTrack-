import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ChatWebSocketService} from '../services/chat-web-socket.service';
import {ChatMessage} from '../models/ChatMessage';
import {Status} from '../models/Status';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
})
export class ConversationsComponent implements OnInit {
  @Input() isConversationsOpen: boolean = false; // Toggle conversations visibility
  isChatOpen: boolean = false; // Toggle chat window visibility
  selectedMessages: ChatMessage[] = []; // Messages for the selected chat
  selectedSender: string = ''; // Currently selected sender
  senders: string[] = []; // List of unique senders

  constructor(private chatWebSocketService: ChatWebSocketService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Subscribe to the messages observable from ChatWebSocketService
    this.chatWebSocketService.messages$.subscribe((messages: ChatMessage[]) => {
      this.senders = Array.from(
        new Set(
          messages
            .map((message) => message.senderName)
            .filter((sender) => sender !== 'admin') // Exclude 'admin'
        )
      );
    });
    // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
    // this.cdr.detectChanges();
  }

  openChat(senderName: string): void {
    console.log('Opening chat with:', senderName);

    // Filter messages for the selected sender
    this.selectedMessages = this.chatWebSocketService.getMessages().filter(
      (message) => message.senderName === senderName && message.status !== 'READ'
    );

    // Update the status of messages to "READ" and replace them in the WebSocket service
    this.selectedMessages.forEach((message) => {
      if (message.status !== Status.READ) {
        message.status = Status.READ; // Update status locally
        message.timestamp= new Date();
        this.chatWebSocketService.updateMessage(message); // Update the message in the service
        this.chatWebSocketService.sendMessage(`/app/chat/${message.senderName}`, message); // Notify sender
      }
    });

    this.selectedSender = senderName;
    this.isChatOpen = true; // Show chat window
  }

  closeChat(): void {
    this.isChatOpen = false; // Hide chat window
    this.selectedSender = ''; // Reset sender
    this.selectedMessages = []; // Clear messages
  }
}
