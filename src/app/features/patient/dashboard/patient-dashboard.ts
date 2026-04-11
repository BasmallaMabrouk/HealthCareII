import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css'
})
export class PatientDashboardComponent implements OnInit {
  private appointmentService = inject(AppointmentService);

  patientName = 'Patient';
  patientId   = '';

  upcomingAppointments: Appointment[] = [];
  isLoading = true;
  stats = { total: 0, pending: 0, confirmed: 0 };

  ngOnInit(): void {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const user = JSON.parse(saved);
      this.patientName = user.name;
      this.patientId = String(user.id);
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData() {
    this.isLoading = true;
    this.appointmentService.getPatientAppointments(this.patientId).subscribe({
      next: (data) => {
        this.stats.total     = data.length;
        this.stats.pending   = data.filter(a => a.status === 'pending').length;
        this.stats.confirmed = data.filter(a => a.status === 'confirmed').length;
        this.upcomingAppointments = [...data].reverse().slice(0, 3);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }
}
