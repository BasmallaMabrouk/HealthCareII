import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
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

  // ── Helper: always return id as string ──────────────────────────────────
  private normalizeId<T extends { id: string | number }>(obj: T): T {
    return { ...obj, id: String(obj.id) };
  }

  // ───────────────────────── DASHBOARD ─────────────────────────
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

  // ───────────────────────── DOCTORS ─────────────────────────
  getDoctors(): Observable<Doctor[]> {
    return this.http
      .get<Doctor[]>(`${this.apiUrl}/users?role=doctor`)
      .pipe(map(doctors => doctors.map(d => this.normalizeId(d))));
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http
      .get<Doctor>(`${this.apiUrl}/users/${id}`)
      .pipe(map(d => this.normalizeId(d)));
  }

  addDoctor(doctor: Omit<Doctor, 'id'>): Observable<Doctor> {
    const payload = {
      ...doctor,                  
      role: 'doctor',
      isActive: true,
      rating: doctor.rating ?? 0,
      reviewCount: doctor.reviewCount ?? 0,
      patients: doctor.patients ?? 0,
      availableSlots: doctor.availableSlots ?? [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    return this.http
      .post<Doctor>(`${this.apiUrl}/users`, payload)
      .pipe(map(d => this.normalizeId(d)));
  }

  updateDoctor(id: string, doctor: Partial<Doctor>): Observable<Doctor> {
    const { password, ...safeDoctor } = doctor as any;
    return this.http
      .put<Doctor>(`${this.apiUrl}/users/${id}`, safeDoctor)
      .pipe(map(d => this.normalizeId(d)));
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // ───────────────────────── PATIENTS ─────────────────────────
  getPatients(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?role=patient`)
      .pipe(map(patients => patients.map(p => this.normalizeId(p))));
  }

  getPatientById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/${id}`)
      .pipe(map(p => this.normalizeId(p)));
  }

  addPatient(patient: Omit<User, 'id'>): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/users`, { ...patient, role: 'patient' })
      .pipe(map(p => this.normalizeId(p)));
  }

  updatePatient(id: string, patient: Partial<User>): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/${id}`, patient)
      .pipe(map(p => this.normalizeId(p)));
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  togglePatientStatus(patient: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/${patient.id}`, {
        ...patient,
        isActive: !patient.isActive,
      })
      .pipe(map(p => this.normalizeId(p)));
  }

  // ───────────────────────── APPOINTMENTS ─────────────────────────
  getAllAppointments(): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.apiUrl}/appointments`)
      .pipe(map(appts => appts.map(a => this.normalizeId(a))));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http
      .get<Appointment>(`${this.apiUrl}/appointments/${id}`)
      .pipe(map(a => this.normalizeId(a)));
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    return this.http
      .post<Appointment>(`${this.apiUrl}/appointments`, appointment)
      .pipe(map(a => this.normalizeId(a)));
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http
      .put<Appointment>(`${this.apiUrl}/appointments/${id}`, appointment)
      .pipe(map(a => this.normalizeId(a)));
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`);
  }

  // ───────────────────────── SHARED ─────────────────────────
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(map(users => users.map(u => this.normalizeId(u))));
  }
}