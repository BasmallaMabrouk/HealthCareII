import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { User } from '../models/user.model';
import { Appointment } from '../models/appointment.model';

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────
  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      doctors: this.http.get<User[]>(`${this.apiUrl}/users?role=doctor`),
      patients: this.http.get<User[]>(`${this.apiUrl}/users?role=patient`),
      appointments: this.http.get<Appointment[]>(`${this.apiUrl}/appointments`),
    }).pipe(
      map(({ doctors, patients, appointments }) => ({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
      }))
    );
  }

  // ─── Doctors ──────────────────────────────────────────────────────────────
  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?role=doctor`);
  }

  getDoctorById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  addDoctor(doctor: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, doctor);
  }

  updateDoctor(id: string, doctor: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // ─── Patients ─────────────────────────────────────────────────────────────
  getPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?role=patient`);
  }

  getPatientById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  addPatient(patient: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, patient);
  }

  updatePatient(id: string, patient: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  togglePatientStatus(patient: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${patient.id}`, {
      ...patient,
      isActive: !patient.isActive,
    });
  }

  // ─── Appointments ─────────────────────────────────────────────────────────
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}`);
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${id}`, appointment);
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`);
  }

  // ─── Shared ───────────────────────────────────────────────────────────────
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}