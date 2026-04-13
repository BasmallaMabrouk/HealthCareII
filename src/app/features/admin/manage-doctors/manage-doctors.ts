import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminService } from '../../../core/services/admin';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './manage-doctors.html',
  styleUrl: './manage-doctors.css',
})
export class ManageDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  error = '';
  successMsg = '';

  editingDoctorId: string | null = null;
  submitting = false;
  doctorForm!: FormGroup;

  specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'General Practice',
    'Oncology',
    'Ophthalmology',
    'ENT',
    'Gynecology',
    'Urology',
  ];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;

    this.adminService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load doctors.';
        this.loading = false;
      },
    });
  }

  startEdit(doctor: Doctor): void {
    this.editingDoctorId = doctor.id;
    this.successMsg = '';
    this.error = '';

    this.doctorForm = this.fb.group({
      name: [doctor.name, [Validators.required, Validators.minLength(3)]],
      email: [doctor.email, [Validators.required, Validators.email]],
      phone: [doctor.phone, [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      specialization: [doctor.specialization, Validators.required],
      experience: [doctor.experience, [Validators.required, Validators.min(0), Validators.max(60)]],
      bio: [doctor.bio, Validators.required],
    });
  }

  cancelEdit(): void {
    this.editingDoctorId = null;
    this.error = '';
  }

  saveEdit(doctor: Doctor): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const formVal = this.doctorForm.value;

    const updated: Doctor = {
      ...doctor,
      name: formVal.name,
      email: formVal.email,
      phone: formVal.phone,
      specialization: formVal.specialization,
      experience: formVal.experience,
      bio: formVal.bio,
      patients: doctor.patients ?? 0,
      availableSlots: doctor.availableSlots ?? [],
    };

    this.adminService.updateDoctor(doctor.id, updated).subscribe({
      next: () => {
        this.successMsg = 'Doctor updated successfully!';
        this.submitting = false;
        this.editingDoctorId = null;
        this.loadDoctors();

        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => {
        this.error = 'Update failed.';
        this.submitting = false;
      },
    });
  }

  deleteDoctor(doctor: Doctor): void {
    if (!confirm(`Are you sure you want to remove Dr. ${doctor.name}?`)) return;

    this.adminService.deleteDoctor(doctor.id).subscribe({
      next: () => this.loadDoctors(),
      error: () => {
        this.error = 'Delete failed.';
      },
    });
  }

  fc(name: string) {
    return this.doctorForm.get(name)!;
  }
}