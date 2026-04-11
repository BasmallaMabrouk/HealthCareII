import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);

  myAppointments: Appointment[] = [];
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
      next: (data) => { this.myAppointments = data.reverse(); this.isLoading = false; },
      error: ()     => { this.isLoading = false; }
    });
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.myAppointments = this.myAppointments.filter(a => a.id !== id);
        },
        error: () => alert('Could not cancel. Please try again.')
      });
    }
  }
}
