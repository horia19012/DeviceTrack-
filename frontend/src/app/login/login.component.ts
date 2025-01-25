import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          console.log('Login successful:', response);

          if (response) {
            const jwtToken = response;
            localStorage.setItem('jwt', jwtToken);
            localStorage.setItem('username', this.loginForm.value.username);

            this.userService.getUserByUserName(this.loginForm.value.username).subscribe(
              (user) => {
                localStorage.setItem('userId', user.id.toString());
                localStorage.setItem('role', user.role.toString());

                if (user.role === 'USER') {
                  this.router.navigateByUrl("/user");
                } else {
                  this.router.navigateByUrl("/admin/user-list");
                }
              },
              (error) => {
                console.error('Error fetching user details:', error);
                alert('Login failed: Unable to fetch user details.');
              }
            );
          } else {
            alert('Login failed: No token received.');
          }
        },
        (error) => {
          console.error('Error during login:', error);
          alert('Login failed: Please check your credentials and try again.');
        }
      );
    } else {
      alert('Please fill in both the username and password fields.');
    }
  }

  redirectBasedOnRole(role: string): string {
    return role === 'ADMIN' ? '/admin' : '/user';
  }
}
