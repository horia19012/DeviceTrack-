import {ApplicationRef, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {ConsumptionAlert} from '../models/ConsumptionAlert';
import {WebSocketService} from '../services/web-socket.service';
import {ChatWebSocketService} from '../services/chat-web-socket.service';
import {ChatMessage} from '../models/ChatMessage';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit {
  @Input() isNotificationsOpen: boolean = false;  // Track the state of the notification panel
  alerts: ConsumptionAlert[] = [];
  messages: ChatMessage[] = [];
  username: string = '';
  filteredMessages: ChatMessage[] = [];
  @Output() alertsCountChanged: EventEmitter<number> = new EventEmitter<number>();


  constructor(private appRef: ApplicationRef, private notificationService: NotificationService, private webSocketService: WebSocketService, private chatWebSocketService: ChatWebSocketService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscribeToAlerts();
    this.subscribeToMessages();
    this.chatWebSocketService.messages$.subscribe((messages: ChatMessage[]) => {
      this.messages = messages; // Update local messages array
      this.filterMessages();
      console.log('Updated messages in notification panel:', this.messages);
    });
    this.username = localStorage.getItem('username') || "";
  }

  //Method to fetch alerts from the notification service
  getAlerts(): void {
    this.notificationService.alertSubject.subscribe((alerts: ConsumptionAlert[]) => {
      this.alerts = alerts;
    });
    this.cdr.detectChanges();
  }

  private subscribeToAlerts(): void {
    this.webSocketService.alertSubject.subscribe((alert: ConsumptionAlert) => {
      console.log('Notification Panel Alert:', alert);

      // Append the new alert to the end of the alerts array
      this.alerts = [...this.alerts, alert]; // Update reference with new array containing all previous alerts + new alert
      console.log('Last alert:', this.alerts.at(this.alerts.length - 1));

      this.alertsCountChanged.emit(this.alerts.length);
      this.cdr.detectChanges();

    });
  }

  private subscribeToMessages(): void {
    const adminTopic = '/app/chat/admin';

    console.log('Subscribing to admin topic:', adminTopic);

    this.chatWebSocketService.subscribeToTopic(adminTopic, (message: ChatMessage) => {
      console.log('Message received from user:', message);
      // Emit the updated alerts count
      this.alertsCountChanged.emit(this.alerts.length);
      this.cdr.detectChanges();
    });
  }


  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  filterMessages(): void {
    this.filteredMessages = this.messages.filter(
      (message) =>
        message.senderName !== localStorage.getItem('username') && message.receiverName === localStorage.getItem('username')
    );
  }

  deleteAllNotifications(): void {
    this.alerts = [];  // Clear the alerts array
    this.messages = [];
    console.log('All notifications have been deleted.');
    this.alertsCountChanged.emit(this.alerts.length);
  }

}
