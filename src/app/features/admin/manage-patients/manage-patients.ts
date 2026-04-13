import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { AdminService } from '../../../core/services/admin';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manage-patients.html',
  styleUrl: './manage-patients.css',
})
export class ManagePatientsComponent implements OnInit {
  patients: User[] = [];
  filteredPatients: User[] = [];
  loading = true;
  error = '';
  successMsg = '';
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.adminService.getPatients().subscribe({
      next: data => {
        // Ensure isActive defaults to true if not set
        this.patients = data.map(p => ({ ...p, isActive: p.isActive !== false }));
        this.filteredPatients = [...this.patients];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load patients.';
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredPatients = this.patients.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q))
    );
  }

  toggleStatus(patient: User): void {
    const action = patient.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${patient.name}?`)) return;

    this.adminService.togglePatientStatus(patient).subscribe({
      next: updated => {
        const idx = this.patients.findIndex(p => p.id === updated.id);
        if (idx > -1) this.patients[idx] = { ...updated };
        this.onSearch(); // re-apply filter
        this.successMsg = `Patient ${action}d successfully.`;
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => {
        this.error = 'Failed to update patient status.';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }
}