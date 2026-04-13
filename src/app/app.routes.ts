import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  {
    path: 'doctor',
    loadChildren: () => import('./features/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES),
  },
  { path: '', redirectTo: 'doctor', pathMatch: 'full' },
];
