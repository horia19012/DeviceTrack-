import {Component, Input} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {WebSocketService} from './services/web-socket.service';
import {ChatWebSocketService} from './services/chat-web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  isMessageWindowOpen = false; // Toggle to open/close the chat window
  @Input() isChatRoomOpen = false;
  messageContent: string = ''; // Input for the initial user message
  alertsCount: number = 0; // Notifications count

  initialMessage: string = ''; // Stores the first message sent to chat
  isNotificationsOpen: boolean = false;
  isConversationsOpen: boolean = false;
  userInput: string = 'enter message';

  constructor(private authService: AuthService, private router: Router) {
  }

  onLogout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  toggleMessageWindow(): void {
    this.isMessageWindowOpen = !this.isMessageWindowOpen;
    this.messageContent='';
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.authService.getUserRole() === 'USER';
  }

  toggleNotificationPanel(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  onAlertCountChanged(count: number): void {
    this.alertsCount = count;
  }

  sendMessageToAdmin(): void {
    if (this.messageContent.trim()) {
      const username = localStorage.getItem('username'); // Retrieve username from localStorage

        this.isChatRoomOpen = true;
      } else {
        alert('Username not found in localStorage.');
      }

  }



  handleChatClosed() {
    this.isChatRoomOpen = false;
    this.messageContent='';
  }

  toggleConversationsWindow(): void {
    this.isConversationsOpen = !this.isConversationsOpen;
    console.log('Conversations window is now:', this.isConversationsOpen);
  }
}
