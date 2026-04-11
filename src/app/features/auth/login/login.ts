import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (users) => {
        this.isLoading = false;
        if (!users || users.length === 0) {
          this.errorMsg = 'Incorrect email or password. Please try again.';
          return;
        }
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', 'fake-token-' + user.id);

        if (user.role === 'admin')        this.router.navigate(['/admin/dashboard']);
        else if (user.role === 'doctor')  this.router.navigate(['/doctor/dashboard']);
        else                              this.router.navigate(['/patient/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg = 'Connection error. Make sure JSON Server is running.';
      }
    });
  }
}
