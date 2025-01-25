import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../models/User';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-cell',
  templateUrl: './user-cell.component.html',
  styleUrl: './user-cell.component.css'
})
export class UserCellComponent {
  @Input() user!: User;
  @Output() deleteUser = new EventEmitter<number>();
  @Output() updateUser = new EventEmitter<User>();

  isEditing = false;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.user) {
      this.editForm.patchValue({
        userName: this.user.userName,
        email: this.user.email,
        role: this.user.role
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onDelete() {
    this.deleteUser.emit(this.user.id);
  }
  onSave() {
    // Construct a new User object with updated values
    const updatedUser: User = {
      id: this.user.id, // Keep the original user ID
      userName: this.editForm.value.userName, // Update the properties with form values
      email: this.editForm.value.email,
      role: this.editForm.value.role,
      password: this.user.password // Retain the original password (or manage it differently if needed)
    };

    // Emit the updated user object
    this.updateUser.emit(updatedUser);
    this.toggleEdit(); // Optionally toggle edit mode off after saving
  }
}
