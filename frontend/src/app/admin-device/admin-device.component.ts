import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from '../models/Device';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device.service';
import { UserService } from '../services/user.service'; // Import UserService
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-device',
  templateUrl: './admin-device.component.html',
  styleUrls: ['./admin-device.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class AdminDeviceComponent {
  @Input() device!: Device;
  @Output() deleteDevice = new EventEmitter<void>();
  isEditing = false;
  editForm!: FormGroup;
  username: string | undefined; // To hold the fetched username

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      description: [this.device.description, Validators.required],
      address: [this.device.address, Validators.required],
      maxHourlyEnergyConsumption: [this.device.maxHourlyEnergyConsumption, [Validators.required, Validators.min(0)]],
      userId: [this.device.userId, Validators.required]
    });

    // Fetch the username using the userId
    this.userService.getUserNameById(this.device.userId).subscribe(
      (name) => (this.username = name),
      (error) => console.error('Error fetching username:', error)
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onSave() {
    if (this.editForm.valid) {
      this.deviceService.updateDevice(this.device.id, this.editForm.value).subscribe(
        response => {
          console.log('Device updated successfully', response);
          this.device = { ...this.device, ...this.editForm.value };
          this.toggleEdit();
        },
        error => {
          console.error('Error updating device', error);
        }
      );
    }
  }

  onDelete() {
    this.deviceService.deleteDevice(this.device.id).subscribe(
      response => {
        console.log('Device deleted successfully', response);
        this.deleteDevice.emit();
      },
      error => {
        console.error('Error deleting device', error);
      }
    );
  }
}
