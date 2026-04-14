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
      const currentUser = saved ? JSON.parse(saved) : null;
      const patientId = currentUser ? String(currentUser.id) : null;
      const patientName = currentUser ? currentUser.name : 'Patient';

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];

      const newAppointment: any = {
        patientId: patientId,
        patientName: patientName,
        doctorId: String(this.doctor.id), // ← keep as string, matching db.json
        doctorName: this.doctor.name,
        date: dateStr,
        timeSlot: `${this.selectedSlot.startTime} - ${this.selectedSlot.endTime}`,
        status: 'pending',
        createdAt: today.toISOString(),
      };

      this.appointmentService.bookAppointment(newAppointment).subscribe({
        next: () => {
          this.bookingSuccess = true;
          // Navigate to my-appointments so the patient sees the booked appointment
          setTimeout(() => {
            this.router.navigate(['/patient/my-appointments']);
          }, 1200);
        },
        error: (err) => {
          console.error('Booking error:', err);
          alert('Could not complete booking. Please try again.');
        },
      });
    }
  }
}
