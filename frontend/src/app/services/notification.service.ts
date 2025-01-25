import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConsumptionAlert } from '../models/ConsumptionAlert';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private alerts: ConsumptionAlert[] = [];
  public alertSubject = new Subject<ConsumptionAlert[]>();

  addAlert(alert: ConsumptionAlert): void {
    this.alerts.push(alert);

    // Limit the number of alerts to prevent memory overflow
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }

    // Notify all subscribers
    this.alertSubject.next(this.alerts);
  }

  getAlerts(): ConsumptionAlert[] {
    return [...this.alerts];
  }
}
