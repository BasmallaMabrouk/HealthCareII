import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge-pipe';
import { Appointment } from '../../../core/models/appointment.model';
import { AdminService } from '../../../core/services/admin';



@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatusBadgePipe],
  templateUrl: './manage-appointments.html',
  styleUrl: './manage-appointments.css',
})
export class ManageAppointmentsComponent implements OnInit {
  allAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = true;
  error = '';

  filterStatus = 'all';
  searchQuery = '';

  statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      appointments: this.adminService.getAllAppointments(),
      users: this.adminService.getAllUsers(),
    }).subscribe({
      next: ({ appointments, users }) => {
        // Enrich appointments with patient and doctor names
        this.allAppointments = appointments.map(appt => ({
          ...appt,
          patientName: users.find(u => u.id === appt.patientId)?.name ?? 'Unknown',
          doctorName:  users.find(u => u.id === appt.doctorId)?.name  ?? 'Unknown',
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load appointments.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.allAppointments];

    if (this.filterStatus !== 'all') {
      result = result.filter(a => a.status === this.filterStatus);
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        a =>
          a.patientName?.toLowerCase().includes(q) ||
          a.doctorName?.toLowerCase().includes(q) ||
          a.date.includes(q)
      );
    }

    this.filteredAppointments = result;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return map[status] ?? '';
  }
}