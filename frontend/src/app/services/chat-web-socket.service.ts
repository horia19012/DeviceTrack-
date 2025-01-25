import {Injectable} from '@angular/core';
import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {BehaviorSubject, Subject} from 'rxjs';
import {ChatMessage} from '../models/ChatMessage';

@Injectable({
  providedIn: 'root',
})
export class ChatWebSocketService {
  private stompClient: Client | null = null;
  // public messageSubject = new Subject<any>();
  private messages: ChatMessage[] = [];
  private messagesSubject = new BehaviorSubject<ChatMessage[]>(this.messages); // Observable for the array

  public messages$ = this.messagesSubject.asObservable();

  constructor() {
  }

  // Connect to WebSocket
  connect(username: string): void {
    if (this.stompClient?.connected) {
      console.log('WebSocket is already connected');
      return;
    }

    this.stompClient = new Client({
      brokerURL: 'ws://user-app.localhost/chat', // Backend WebSocket URL
      reconnectDelay: 5000, // Automatically try to reconnect
      webSocketFactory: () => new SockJS('http://user-app.localhost/chat'), // Use SockJS
      debug: (str) => console.log('WebSocket Debug:', str), // Log debug messages
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket server');

      // Dynamically subscribe to a topic specific to the username
      const userMessagesEndpoint = `/topic/messages/${username}`; // Topic specific to the user
      console.log(`Subscribing to endpoint: ${userMessagesEndpoint}`);
      //
      // if (this.stompClient instanceof Client) {
      //   this.stompClient.subscribe(userMessagesEndpoint, (message: IMessage) => {
      //
      //     console.log(`Message received for user ${username}:`, JSON.parse(message.body));
      //   });
      // }
      if (this.stompClient instanceof Client) {
        this.stompClient.subscribe(userMessagesEndpoint, (message: IMessage) => {
          const parsedMessage: ChatMessage = JSON.parse(message.body); // Parse as ChatMessage
          console.log(`Message received for user ${username}:`, parsedMessage);

          // Add the message to the shared service
          this.addMessage(parsedMessage);

        });
      }
    };

    this.stompClient.activate();
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message); // Add the new message to the array
    this.messagesSubject.next([...this.messages]); // Emit a copy of the updated array
  }


  // Subscribe to a specific topic
  subscribeToTopic(topic: string, callback: (message: any) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    this.stompClient.subscribe(topic, (msg: IMessage) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  }

  // Subscribe to a user-specific topic
  subscribeToUser(username: string, callback: (message: any) => void): void {
    const topic = `/topic/messages/${username}`;
    this.subscribeToTopic(topic, callback);
  }

  updateMessage(updatedMessage: ChatMessage): void {
    const index = this.messages.findIndex(
      (msg) => msg.chatId === updatedMessage.chatId && msg.timestamp === updatedMessage.timestamp && msg.message===updatedMessage.message
    );

    if (index !== -1) {
      // Replace the existing message with the updated one
      this.messages[index] = updatedMessage;
    } else {
      console.warn('Message not found for update:', updatedMessage);
    }

    // Emit the updated messages array
    this.messagesSubject.next([...this.messages]);
  }

  // Send a message to a specific destination
  sendMessage(destination: string, body: ChatMessage): void {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('WebSocket is not connected');
      setTimeout(() => this.sendMessage(destination, body), 1000); // Retry after 1 second
      return;
    }

    // Add the sent message to the local messages array
    this.addMessage(body);

    // Publish the message to the WebSocket server
    this.stompClient.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  }


  getMessages() {
    return [...this.messages]; // Return a copy of the messages array
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      console.log('Disconnected from WebSocket server');
    } else {
      console.warn('WebSocket is already disconnected');
    }
  }
}
