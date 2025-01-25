import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {LoginRequest} from '../models/LoginRequest';
import {WebSocketService} from './web-socket.service';
import {ChatWebSocketService} from './chat-web-socket.service'; // Import WebSocketService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://user-app.localhost/'; // Adjust the URL if needed

  constructor(private http: HttpClient, private webSocketService: WebSocketService, private chatSocketService: ChatWebSocketService) {
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http
      .post(this.apiUrl + 'login', loginRequest, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'text', // Change response type to 'text'
      })
      .pipe(
        catchError(this.handleError),
        // Handle successful login response
        map((response) => {
          // Assuming the server sends a JWT token and user information (e.g., userId, role)
          const token = response;
          const userRole = 'USER'; // Modify this based on your server's response
          const username = loginRequest.username; // Assuming the username is sent in the login request

          // Store the JWT token, user role, and username in localStorage
          localStorage.setItem('jwt', token);
          localStorage.setItem('role', userRole);
          localStorage.setItem('username', username);


          // Assuming userId is part of the response or can be derived (if not, update accordingly)
          const userId = 'user-id'; // Replace this with the actual userId from the server response

          // Connect WebSocket for the logged-in user
          this.webSocketService.connect(userId);
          this.chatSocketService.connect(localStorage.getItem('username')||'');

          return response; // Return response for further handling
        })
      );
  }

  register(signRequest: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'register', signRequest, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError)); // Ensure handleError is implemented
  }

  logout(): void {
    localStorage.removeItem('jwt');  // Remove token
    localStorage.removeItem('role');  // Remove user role
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.webSocketService.disconnect();
    this.chatSocketService.disconnect();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Check if the token exists
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt'); // Check if a JWT token is present
  }

  getUserRole(): string | null {
    return localStorage.getItem('role'); // Retrieve the user's role from local storage
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Server-side error: Error Code: ${error.status}\nMessage: ${error.message}\nError Body: ${error.error}`;
    }
    console.error('Error during login:', error);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage
    if (!token) {
      console.error('No token found in localStorage.');
      throw new Error('Unauthorized: No token found.');
    }

    // Create the request header
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Use the token directly without JSON.parse
    });
    return reqHeader;
  }




}
