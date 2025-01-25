import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Device } from '../models/Device';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
import { ConsumptionAlert } from '../models/ConsumptionAlert';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css'],
})
export class DeviceComponent {
  @Input() device!: Device;

}
