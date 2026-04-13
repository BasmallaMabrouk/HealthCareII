import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../../../core/services/doctor.service';
import { Appointment } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.css'],
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patientNames: { [id: string]: string } = {};
  doctorId!: string;
  activeFilter = 'all';
  isLoading = true;
  actionLoading: { [id: string]: boolean } = {};

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.parent?.snapshot.paramMap.get('doctorId') ?? '2';
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.doctorService.getDoctorAppointments(this.doctorId).subscribe({
      next: (appts) => {
        // newest first
        this.appointments = appts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        this.isLoading = false;

        if (appts.length === 0) return;
        const ids = [...new Set(appts.map((a) => String(a.patientId)))];
        const requests = ids.map((id) => this.doctorService.getPatient(id));
        forkJoin(requests).subscribe((patients) => {
          patients.forEach((p) => (this.patientNames[p.id] = p.name));
        });
      },
      error: () => (this.isLoading = false),
    });
  }

  confirm(appt: Appointment): void {
    this.actionLoading[appt.id] = true;
    this.doctorService.updateAppointmentStatus(appt.id, 'confirmed').subscribe({
      next: (updated) => {
        const idx = this.appointments.findIndex((a) => a.id === updated.id);
        if (idx > -1) this.appointments[idx] = updated;
        this.actionLoading[appt.id] = false;
      },
      error: () => (this.actionLoading[appt.id] = false),
    });
  }

  cancel(appt: Appointment): void {
    if (!confirm(`Cancel appointment for ${this.getPatientName(appt.patientId)}?`)) return;
    this.actionLoading[appt.id] = true;
    this.doctorService.updateAppointmentStatus(appt.id, 'cancelled').subscribe({
      next: (updated) => {
        const idx = this.appointments.findIndex((a) => a.id === updated.id);
        if (idx > -1) this.appointments[idx] = updated;
        this.actionLoading[appt.id] = false;
      },
      error: () => (this.actionLoading[appt.id] = false),
    });
  }

  complete(appt: Appointment): void {
    this.actionLoading[appt.id] = true;
    this.doctorService.updateAppointmentStatus(appt.id, 'completed').subscribe({
      next: (updated) => {
        const idx = this.appointments.findIndex((a) => a.id === updated.id);
        if (idx > -1) this.appointments[idx] = updated;
        this.actionLoading[appt.id] = false;
      },
      error: () => (this.actionLoading[appt.id] = false),
    });
  }

  viewDetail(appt: Appointment): void {
    this.router.navigate([`/doctor/${this.doctorId}/appointments/${appt.id}`]);
  }

  getPatientName(patientId: string): string {
    return this.patientNames[String(patientId)] || '...';
  }

  getInitials(name: string): string {
    if (!name || name === '...') return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get filteredAppointments(): Appointment[] {
    if (this.activeFilter === 'all') return this.appointments;
    return this.appointments.filter((a) => a.status === this.activeFilter);
  }

  get counts() {
    return {
      all: this.appointments.length,
      pending: this.appointments.filter((a) => a.status === 'pending').length,
      confirmed: this.appointments.filter((a) => a.status === 'confirmed').length,
      completed: this.appointments.filter((a) => a.status === 'completed').length,
      cancelled: this.appointments.filter((a) => a.status === 'cancelled').length,
    };
  }
}
