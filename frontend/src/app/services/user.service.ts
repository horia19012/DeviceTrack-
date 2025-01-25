import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {User} from '../models/User';
import {Observable, catchError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://user-app.localhost/api/users'; // URL-ul pentru API-ul utilizatorilor
  private apiDeviceUrl = 'http://device-app.localhost/api/devices/user'; // URL-ul pentru dispozitive

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  registerUser(user: User): Observable<User> {
    const headers = this.authService.createAuthorizationHeader();
    return this.http.post<User>(this.apiUrl, user, {headers});
  }

  getUserById(userId: number): Observable<string> {
    const headers = this.authService.createAuthorizationHeader();
    return this.http.get<string>(`${this.apiUrl}/${userId}/username`, {headers: this.authService.createAuthorizationHeader()});
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {headers: this.authService.createAuthorizationHeader()});
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {headers: this.authService.createAuthorizationHeader()});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {headers: this.authService.createAuthorizationHeader()});
  }

  deleteDevicesByUserId(userId: number): Observable<void> {
    const headers = this.authService.createAuthorizationHeader();
    return this.http.delete<void>(`${this.apiDeviceUrl}/${userId}`, {headers: this.authService.createAuthorizationHeader()});
  }

  getUserNameById(userId: number): Observable<string> {
    const headers = this.authService.createAuthorizationHeader();
    return this.http.get<string>(`${this.apiUrl}/${userId}/username`, {headers: this.authService.createAuthorizationHeader()});
  }

  getUserByUserName(userName: string): Observable<User> {


    // Make the HTTP GET request
    return this.http.get<User>(`${this.apiUrl}/username/${userName}`, { headers: this.authService.createAuthorizationHeader() }).pipe(
      catchError((error: HttpErrorResponse) => this.authService.handleError(error)) // Handle errors
    );
  }


}
