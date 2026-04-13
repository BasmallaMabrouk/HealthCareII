import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from '../doctor/Components/doctor-dashboard/doctor-dashboard';
import { DoctorAppointmentsComponent } from '../doctor/Components/appointment/appointment';
import { AppointmentDetailComponent } from '../doctor/Components/appointment-detail/appointment-detail';
import { DoctorProfileComponent } from '../doctor/Components/doctor-profile/doctor-profile';
import { DoctorLayoutComponent } from '../doctor/Components/doctor-layout/doctor-layout';
import { authGuard } from '../../core/guards/role-guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: ':doctorId',
    component: DoctorLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',        component: DoctorDashboardComponent },
      { path: 'appointments',     component: DoctorAppointmentsComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'profile',          component: DoctorProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];
