import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Device } from '../models/Device';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private baseUrl = 'http://device-app.localhost/api/devices'; // Base URL for the device API

  constructor(private http: HttpClient) {}

  // Helper method to create headers with JWT
  private createAuthorizationHeader(contentType: boolean = false): HttpHeaders {
    const token = localStorage.getItem('jwt'); // Retrieve the JWT token from local storage
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (contentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  // Create a new device
  createDevice(device: { [p: number]: any; [p: symbol]: any; userId: any }): Observable<Device> {
    const headers = this.createAuthorizationHeader(true); // Include Content-Type
    return this.http.post<Device>(this.baseUrl, device, { headers });
  }

  // Retrieve a device by ID
  getDeviceById(id: number): Observable<Device> {
    const headers = this.createAuthorizationHeader(); // No Content-Type needed
    return this.http.get<Device>(`${this.baseUrl}/${id}`, { headers });
  }

  // Retrieve all devices
  getAllDevices(): Observable<Device[]> {
    const headers = this.createAuthorizationHeader(); // No Content-Type needed
    return this.http.get<Device[]>(this.baseUrl, { headers });
  }

  // Update an existing device
  updateDevice(id: number, device: Device): Observable<Device> {
    const headers = this.createAuthorizationHeader(true); // Include Content-Type
    return this.http.put<Device>(`${this.baseUrl}/${id}`, device, { headers });
  }

  // Delete a device by ID
  deleteDevice(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader(); // No Content-Type needed
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }

  // Retrieve devices by user ID
  getDevicesByUserId(userId: number): Observable<Device[]> {
    const headers = this.createAuthorizationHeader(); // No Content-Type needed
    return this.http.get<Device[]>(`${this.baseUrl}/user/${userId}`, { headers });
  }
}
