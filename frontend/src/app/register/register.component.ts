import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/User';

import {UserService} from '../services/user.service';

import {Component, OnInit} from '@angular/core';
import {Role} from '../models/Role';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {notSame: true};
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);

      // Create a User object
      const user: User = {
        id: 0,
        userName: this.registerForm.value.username,
        role: Role.USER,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(user).subscribe((response) => {
        if (response.id != null) {
          alert('Hello ' + response.userName);
          // Redirect to login page after successful registration
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
