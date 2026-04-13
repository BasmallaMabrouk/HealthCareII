import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMsg  = '';
  infoMsg   = '';

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.registerForm = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone:    ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMsg  = '';
    this.infoMsg   = '';

    const { email, password, name, phone } = this.registerForm.value;

    // ── Step 1: Check if email already exists ────────────────────────────
    this.authService.getUserByEmail(email).subscribe({
      next: (users) => {

        // Email found → redirect to login
        if (users.length > 0) {
          this.isLoading = false;
          this.infoMsg = 'This email is already registered. Redirecting to login…';
          setTimeout(() => this.router.navigate(['/auth/login']), 1500);
          return;
        }

        // New email → register as patient
        const userData = {
          name,
          email,
          password,
          phone,
          role: 'patient' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        this.authService.register(userData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/patient/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.errorMsg = 'Registration failed. Make sure JSON Server is running.';
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
