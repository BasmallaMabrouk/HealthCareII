import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, DashboardStats } from '../../../core/services/admin';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: data => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load statistics.';
        this.loading = false;
      },
    });
  }
}