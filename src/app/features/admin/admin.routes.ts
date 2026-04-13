import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./manage-doctors/manage-doctors').then(m => m.ManageDoctorsComponent),
      },
      {
        path: 'doctors/add',
        loadComponent: () =>
          import('./manage-doctors/add-doctor/add-doctor').then(m => m.AddDoctorComponent),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./manage-patients/manage-patients').then(m => m.ManagePatientsComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./manage-appointments/manage-appointments').then(m => m.ManageAppointmentsComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];