import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor, TimeSlot } from '../../../core/models/doctor.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './doctor-detail.html',
  styleUrl: './doctor-detail.css',
})
export class DoctorDetailComponent implements OnInit {
  doctor: Doctor | null = null;
  isLoading = true;
  selectedSlot: TimeSlot | null = null;
  isBooking = false;
  bookingSuccess = false;
  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.doctorService.getDoctorById(id).subscribe({
        next: (data) => {
          this.doctor = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching doctor details', err);
          this.isLoading = false;
        },
      });
    }
  }

  selectSlot(slot: TimeSlot) {
    if (!slot.isBooked) {
      this.selectedSlot = slot;
    }
  }

  confirmBooking() {
    if (this.selectedSlot && this.doctor) {
      const saved = localStorage.getItem('currentUser');
      const patientId = saved ? JSON.parse(saved).id : null;

      const newAppointment: any = {
        patientId: patientId,
        doctorId: Number(this.doctor.id),
        doctorName: this.doctor.name,
        date: '2026-04-10',
        timeSlot: `${this.selectedSlot.startTime} - ${this.selectedSlot.endTime}`,
        status: 'pending',
      };

      this.appointmentService.bookAppointment(newAppointment).subscribe({
        next: (res) => {
          console.log('Booking pending:', res);
          this.router.navigate(['/patient/dashboard']);
        },
      });
    }
  }
}
