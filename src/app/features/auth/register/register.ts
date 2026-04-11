import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) {

    this.registerForm = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone:    ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        ...this.registerForm.value,
        role: 'patient',
        createdAt: new Date().toISOString()
      };

      this.authService.register(userData).subscribe({
        next: (res) => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.router.navigate(['/patient/dashboard']);
        },
        error: (err) => {
          alert('Check if JSON Server is running!');
          console.error(err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
