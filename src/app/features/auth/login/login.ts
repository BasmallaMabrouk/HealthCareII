import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

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
  errorMsg  = '';

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMsg  = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;

        // ── Role-based redirect ───────────────────────────────────────────
        if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (user.role === 'doctor') {
          // Doctor dashboard uses the doctor's own ID in the URL
          this.router.navigate([`/doctor/${user.id}/dashboard`]);
        } else {
          // Default: patient
          this.router.navigate(['/patient/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg = 'Incorrect email or password. Please try again.';
      }
    });
  }
}
