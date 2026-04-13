import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from '../doctor/Components/doctor-dashboard/doctor-dashboard';
import { DoctorAppointmentsComponent } from '../doctor/Components/appointment/appointment';
import { AppointmentDetailComponent } from '../doctor/Components/appointment-detail/appointment-detail';
import { DoctorProfileComponent } from '../doctor/Components/doctor-profile/doctor-profile';
import { DoctorLayoutComponent } from '../doctor/Components/doctor-layout/doctor-layout';

export const DOCTOR_ROUTES: Routes = [
  {
    path: ':doctorId', // ← /doctor/2  or  /doctor/3
    component: DoctorLayoutComponent,
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // fallback: لو حد فتح /doctor بدون id
  { path: '', redirectTo: '2/dashboard', pathMatch: 'full' },
];
