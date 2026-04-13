import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../../core/services/doctor.service';
import { Doctor } from '../../../../core/models/doctor.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-profile.html',
  styleUrls: ['./doctor-profile.css'],
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | null = null;
  profileForm!: FormGroup;
  slotForm!: FormGroup;
  doctorId!: string;
  showSlotForm = false;

  constructor(
    private doctorService: DoctorService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // doctorId موجود في الـ parent route (:doctorId) مش في الـ route الحالي
    this.doctorId = this.route.parent?.snapshot.paramMap.get('doctorId') ?? '2';
    this.loadProfile();
    this.slotForm = this.fb.group({
      day: ['Sunday', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  loadProfile() {
    this.doctorService.getDoctorProfile(this.doctorId).subscribe((data) => {
      this.doctor = data;
      this.profileForm = this.fb.group({
        name: [data.name, Validators.required],
        specialization: [data.specialization, Validators.required],
        bio: [data.bio, Validators.required],
        experience: [data.experience, [Validators.required, Validators.min(0)]],
      });
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.doctorService
        .updateDoctorProfile(this.doctorId, this.profileForm.value)
        .subscribe(() => {
          this.loadProfile();
          alert('Profile updated successfully!');
        });
    }
  }

  addSlot() {
    if (this.slotForm.valid && this.doctor) {
      const newSlot = { ...this.slotForm.value, isBooked: false };
      const updatedSlots = [...(this.doctor.availableSlots || []), newSlot];

      this.doctorService
        .updateDoctorProfile(this.doctorId, { availableSlots: updatedSlots })
        .subscribe(() => {
          this.loadProfile();
          this.showSlotForm = false;
          this.slotForm.reset({ day: 'Sunday' });
        });
    }
  }

  removeSlot(index: number) {
    if (this.doctor) {
      const updatedSlots = this.doctor.availableSlots.filter((_, i) => i !== index);
      this.doctorService
        .updateDoctorProfile(this.doctorId, { availableSlots: updatedSlots })
        .subscribe(() => {
          this.loadProfile();
        });
    }
  }
}
