import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout';
import { DoctorListComponent } from './features/doctor-listing/doctor-list/doctor-list';
import { DoctorDetailComponent } from './features/doctor-listing/doctor-detail/doctor-detail';
import { Appointments } from './features/patient/appointments/appointments';
import { MedicalRecords } from './features/patient/medical-records/medical-records';
import { Patient } from './features/patient/patient-layout/patient-layout';
import { authGuard, roleGuard } from './core/guards/role-guard';

export const routes: Routes = [

  // ── Auth (public) ────────────────────────────────────────────────────────
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      { path: '', redirectTo: 'register', pathMatch: 'full' }
    ]
  },

  // ── Admin (role: admin only) ─────────────────────────────────────────────
  {
    path: 'admin',
    canMatch: [roleGuard],
    data: { expectedRoles: ['admin'] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },

  // ── Doctor (role: doctor only) ───────────────────────────────────────────
  {
    path: 'doctor',
    canMatch: [roleGuard],
    data: { expectedRoles: ['doctor'] },
    loadChildren: () =>
      import('./features/doctor/doctor.routes').then(m => m.DOCTOR_ROUTES),
  },

  // ── Patient (role: patient only) ─────────────────────────────────────────
  {
    path: 'patient',
    component: Patient,
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { expectedRoles: ['patient'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/patient/dashboard/patient-dashboard').then(m => m.PatientDashboardComponent)
      },
      { path: 'doctors',           component: DoctorListComponent },
      { path: 'doctors/:id',       component: DoctorDetailComponent },
      { path: 'my-appointments',   component: Appointments },
      { path: 'records',           component: MedicalRecords },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Default & wildcard ────────────────────────────────────────────────────
  { path: '',   redirectTo: 'auth/register', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/register' }
];
