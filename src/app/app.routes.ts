import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout';

import { DoctorListComponent } from './features/doctor-listing/doctor-list/doctor-list';
import { DoctorDetailComponent } from './features/doctor-listing/doctor-detail/doctor-detail';
import { Appointments } from './features/patient/appointments/appointments';
import { MedicalRecords } from './features/patient/medical-records/medical-records';
import { Patient } from './features/patient/patient-layout/patient-layout';

export const routes: Routes = [
  // 1️⃣ Auth Section (with animation layout)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      { path: '', redirectTo: 'register', pathMatch: 'full' }
    ]
  },

  // 2️⃣ Patient Section (with sidebar layout)
  {
    path: 'patient',
    component: Patient,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/patient/dashboard/patient-dashboard').then(m => m.PatientDashboardComponent)
      },
      { path: 'doctors', component: DoctorListComponent },
      { path: 'doctors/:id', component: DoctorDetailComponent },
      { path: 'my-appointments', component: Appointments },
      { path: 'records', component: MedicalRecords },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/register' }
];
