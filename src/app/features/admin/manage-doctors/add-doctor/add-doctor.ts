import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin';
import { User } from '../../../../core/models/user.model';
import { Doctor } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-doctor.html',
  styleUrl: './add-doctor.css'
})
export class AddDoctorComponent {
  form: FormGroup;
  submitting = false;
  errorMsg = '';
  successMsg = '';

  specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'General Practice', 'Oncology',
    'Ophthalmology', 'ENT', 'Gynecology', 'Urology',
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name:           ['', [Validators.required, Validators.minLength(3)]],
      email:          ['', [Validators.required, Validators.email]],
      password:       ['', [Validators.required, Validators.minLength(6)]],
      phone:          ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      specialization: ['', Validators.required],
      experience:     [0, [Validators.required, Validators.min(0), Validators.max(60)]],
      bio:            ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.submitting = true;
  this.errorMsg = '';

  const newDoctor: Omit<Doctor, 'id'> = {
    ...this.form.value,
    role: 'doctor',
    isActive: true,
    rating: 0,
    reviewCount: 0,
    patients: 0,
    availableSlots: [],
    createdAt: new Date().toISOString().split('T')[0],
  };

  this.adminService.addDoctor(newDoctor).subscribe({
    next: () => {
      this.successMsg = 'Doctor added successfully!';
      this.submitting = false;

      setTimeout(() => {
        this.router.navigate(['/admin/doctors']);
      }, 1500);
    },
    error: () => {
      this.errorMsg = 'Failed to add doctor. Is json-server running?';
      this.submitting = false;
    },
  });
  }
  fc(name: string) {
    return this.form.get(name)!;
  }
}