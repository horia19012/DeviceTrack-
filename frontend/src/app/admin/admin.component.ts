import {Component, Input} from '@angular/core';
import {Device} from '../models/Device';
import {Subscription} from 'rxjs';
import {WebSocketService} from '../services/web-socket.service';
import {ConsumptionAlert} from '../models/ConsumptionAlert';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {


}
