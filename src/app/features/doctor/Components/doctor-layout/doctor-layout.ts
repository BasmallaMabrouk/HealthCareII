import { Component, OnInit, ViewEncapsulation } from '@angular/core';


import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../core/services/doctor.service';

import { Doctor } from '../../../../core/models/doctor.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'doctor-layout.html',
  styleUrl: 'doctor-layout.css',
  encapsulation: ViewEncapsulation.None,
})
export class DoctorLayoutComponent implements OnInit {
  doctorId = '2';
  doctor: Doctor | null = null;
  navItems: { path: string; label: string; icon: string }[] = [];

  constructor(
    private route: ActivatedRoute,

    private router: Router,
    private doctorService: DoctorService,
    private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('doctorId') ?? '2';

    this.navItems = [
      { path: `/doctor/${this.doctorId}/dashboard`, label: 'Dashboard', icon: 'dashboard' },
      {
        path: `/doctor/${this.doctorId}/appointments`,
        label: 'Appointments',
        icon: 'calendar_today',
      },
      { path: `/doctor/${this.doctorId}/profile`, label: 'Profile', icon: 'person' },
    ];

    this.doctorService.getDoctorProfile(this.doctorId).subscribe((data) => {
      this.doctor = data;
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
