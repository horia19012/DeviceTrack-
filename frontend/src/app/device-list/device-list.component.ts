import { Component, OnInit } from '@angular/core';
import { Device } from '../models/Device';
import { DeviceService } from '../services/device.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  isAdmin: boolean = false;
  isAdminPage: boolean = false;
  devices: Device[] = [];
  userDevices: Device[] = [];
  isAdding: boolean = false;
  addForm: FormGroup;
  formFade: boolean = false; // For controlling fade effect
  errorMessage: string | null = null; // Variable to store error messages

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.addForm = this.fb.group({
      description: ['', Validators.required],
      address: ['', Validators.required],
      maxHourlyEnergyConsumption: [0, [Validators.required, Validators.min(1)]],
      userName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.checkPageContext();
    this.fetchDevices();
  }

  checkUserRole(): void {
    const userRole = localStorage.getItem('role'); // Get the user role from local storage
    this.isAdmin = userRole === 'ADMIN'; // Set isAdmin to true if the role is ADMIN
  }

  checkPageContext(): void {
    this.isAdminPage = this.router.url.includes( '/admin/user-devices');
  }

  fetchDevices(): void {
    if (this.isAdmin && this.isAdminPage) {
      this.deviceService.getAllDevices().subscribe((devices) => {
        this.devices = devices;
      });
    } else {
      const userId = Number(localStorage.getItem('userId'));
      this.deviceService.getDevicesByUserId(userId).subscribe((devices) => {
        this.userDevices = devices;
      });
    }
  }

  toggleAdd(): void {
    this.isAdding = !this.isAdding;
    this.addForm.reset();
    this.errorMessage = null; // Reset error message on toggle
    this.formFade = !this.isAdding; // Toggle fade effect
  }

  onAdd(): void {
    if (this.addForm.valid) {
      const { userName, ...deviceData } = this.addForm.value;

      this.userService.getUserByUserName(userName).subscribe(
        (user) => {
          if (user) {
            const newDevice = {
              ...deviceData,
              userId: user.id
            };

            this.deviceService.createDevice(newDevice).subscribe(
              (addedDevice: Device) => {
                this.devices.push(addedDevice);
                this.addForm.reset();
                this.isAdding = false;
                this.formFade = false;
                this.errorMessage = null;
                alert('Device added successfully');
              },
              (error) => {
                console.error('Error adding device:', error);
                this.errorMessage = 'Failed to add device.';
              }
            );
          } else {
            this.errorMessage = 'User not found.';
          }
        },
        (error) => {
          console.error('Error fetching user by userName:', error);
          this.errorMessage = 'Error fetching user details.';
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  handleDelete(deviceId: number): void {
    this.devices = this.devices.filter(device => device.id !== deviceId);
    this.deviceService.deleteDevice(deviceId).subscribe(() => {
      console.log(`Device with ID ${deviceId} removed from server`);
    });
  }
}
