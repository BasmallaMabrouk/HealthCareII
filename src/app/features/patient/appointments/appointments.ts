import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Appointment } from '../../../core/models/appointment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);

  myAppointments: Appointment[] = [];
  // ✅ Map doctorId → doctor name
  doctorNames: { [id: string]: string } = {};
  isLoading = true;
  patientId = '';

  ngOnInit(): void {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.patientId = String(JSON.parse(saved).id);
    }
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.appointmentService.getPatientAppointments(this.patientId).subscribe({
      next: (data) => {
        this.myAppointments = data.reverse();
        this.isLoading = false;

        // ✅ Fetch unique doctor names
        const uniqueDoctorIds = [...new Set(data.map((a) => String(a.doctorId)))];
        if (uniqueDoctorIds.length === 0) return;

        const requests = uniqueDoctorIds.map((id) => this.doctorService.getDoctorProfile(id));
        forkJoin(requests).subscribe({
          next: (doctors) => {
            doctors.forEach((d) => {
              this.doctorNames[d.id] = d.name;
            });
          },
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.myAppointments = this.myAppointments.filter((a) => a.id !== id);
        },
        error: () => alert('Could not cancel. Please try again.'),
      });
    }
  }
}
