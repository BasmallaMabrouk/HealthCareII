import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatch(group: AbstractControl) {
  const pw  = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { mismatch: true };
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.resetForm = this.fb.group({
      username:        ['', [Validators.required, Validators.email]],
      newPassword:     ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatch });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { username, newPassword } = this.resetForm.value;

    this.authService.getUserByEmail(username).subscribe({
      next: (users) => {
        if (!users || users.length === 0) {
          this.isLoading = false;
          this.errorMsg = 'No account found with this email address.';
          return;
        }
        const user = users[0];
        this.authService.updatePassword(user.id, newPassword).subscribe({
          next: () => {
            this.isLoading = false;
            this.successMsg = 'Password updated successfully! Redirecting to login...';
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          },
          error: () => {
            this.isLoading = false;
            this.errorMsg = 'Failed to update password. Please try again.';
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg = 'Connection error. Make sure JSON Server is running.';
      }
    });
  }
}
