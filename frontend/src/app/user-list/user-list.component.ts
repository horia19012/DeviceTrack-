import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-in', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  editForm!: FormGroup;
  private editingUserId: number | null = null; // Track which user is being edited

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadUsers();
    this.editForm = this.fb.group({
      id: [''],
      userName: [''],
      email: [''],
      role: ['']
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.isLoading = false;
    });
  }
  deleteUser(userId: number): void {

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        // Handle successful deletion
        console.log(`User with ID ${userId} deleted successfully.`);
        // Optionally, update the local users array to remove the deleted user
        this.users = this.users.filter(user => user.id !== userId);
      },
      error: (error) => {
        // Handle error scenario
        console.error('Error deleting user:', error);
        // Optionally, you could display a user-friendly message to the user
      }
    });
  }
  updateUser(updatedUser: User) {
    this.userService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
      this.loadUsers(); // Reload the list after updating
    });
  }
}
