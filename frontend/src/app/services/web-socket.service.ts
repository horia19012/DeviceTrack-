import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Stomp} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any;
  private webSocketEndPoint: string = 'http://monitoring-app.localhost/ws';
  public alertSubject = new Subject<any>();
  private userId: string | null = null; // Store userId
  private connected: boolean = false;
  constructor() {}

  // Initialize WebSocket connection with userId
  connect(userId: string) {
    this.userId = userId;  // Store the userId
    console.log('Initializing WebSocket Connection for user: ', userId);

    // Create WebSocket connection using SockJS
    const ws = new WebSocket(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);

    // Connect to WebSocket and send userId as part of connection headers (optional)
    this.stompClient.connect(
      { 'userId': this.userId },  // Add userId as part of connection headers (if needed by backend)
      (frame: any) => {
        console.log('Connected: ' + frame);

        // Log the topic you're subscribing to
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const userAlertTopic = `/user/${storedUserId}/alerts`; // Correct the topic with userId
          console.log(`Subscribed to topic: ${userAlertTopic}`);

          // Subscribe to the user-specific alert topic
          this.stompClient.subscribe(userAlertTopic, (message: any) => {
            console.log("Alert received");
            this.onAlertReceived(message);
          });
        } else {
          console.error('UserId not found in localStorage.');
        }
      },
      this.errorCallback  // Handle connection errors
    );
  }

  connectToChat() {
    console.log('Initializing WebSocket connection...');

    // Use the WebSocket factory with STOMP
    const webSocketFactory = () => new WebSocket('ws://localhost:8080/ws');
    this.stompClient = Stomp.over(webSocketFactory); // Proper factory setup

    console.log('Attempting to connect to the WebSocket server via STOMP...');

    // Connect with STOMP
    this.stompClient.connect(
      {},
      () => {
        this.connected = true;
        console.log('Connected to WebSocket server via STOMP.');
      },
    );
  }





  // Handle incoming alert messages
  private onAlertReceived(message: any) {
    // console.log('Alert Received: ' + message.body);
    // Forward the alert message to subscribers
    this.alertSubject.next(JSON.parse(message.body));  // Assuming the message is a JSON string
  }

  // Handle errors and retry connection
  private errorCallback(error: any) {
    console.log('Error Callback → ' + error);
    // Retry connection after 5 seconds
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);  // Reconnect with the same userId
      }
    }, 5000);
  }

  sendMessage(destination: string, message: any): void {
    if (this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
      console.log('Message sent:', message);
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    if (this.connected) {
      this.stompClient.subscribe(destination, (response: any) => {
        const message = JSON.parse(response.body);
        console.log('Message received:', message);
        callback(message);
      });
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }
}

