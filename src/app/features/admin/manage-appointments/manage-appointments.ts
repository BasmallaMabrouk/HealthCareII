import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge-pipe';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatusBadgePipe],
  templateUrl: './manage-appointments.html',
  styleUrl: './manage-appointments.css',
})
export class ManageAppointmentsComponent implements OnInit {
  allAppointments: any[] = [];
  filteredAppointments: any[] = [];
  loading = true;
  error = '';
  filterStatus = 'all';
  searchQuery = '';

  statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  private patients: any[] = [];
  private doctors: any[] = [];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadAll(): void {
    this.loading = true;

    // Load patients, doctors, and appointments in parallel
    Promise.all([
      this.adminService.getPatients().toPromise(),
      this.adminService.getDoctors().toPromise(),
      this.adminService.getAllAppointments().toPromise(),
    ]).then(([patients, doctors, appointments]) => {
      this.patients = patients || [];
      this.doctors  = doctors  || [];

      // Enrich appointments with resolved names
      this.allAppointments = (appointments || []).map((appt: any) => ({
        ...appt,
        patientName: appt.patientName
          || this.patients.find(p => p.id === appt.patientId)?.name
          || 'Unknown Patient',
        doctorName: appt.doctorName
          || this.doctors.find(d => d.id === appt.doctorId)?.name
          || 'Unknown Doctor',
      }));

      this.applyFilters();
      this.loading = false;
    }).catch(() => {
      this.error = 'Failed to load appointments.';
      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allAppointments];

    if (this.filterStatus !== 'all') {
      result = result.filter(a => a.status === this.filterStatus);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        a =>
          a.patientName?.toLowerCase().includes(q) ||
          a.doctorName?.toLowerCase().includes(q) ||
          a.date?.includes(q)
      );
    }

    this.filteredAppointments = result;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}