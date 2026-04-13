import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
<<<<<<< HEAD
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
=======
>>>>>>> 771e485 (add home page)
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/appointments';

<<<<<<< HEAD
  // ✅ Client-side filter to avoid json-server type coercion issues
  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(this.baseUrl)
      .pipe(map((appts) => appts.filter((a) => String(a.patientId) === String(patientId))));
  }

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(this.baseUrl)
      .pipe(map((appts) => appts.filter((a) => String(a.doctorId) === String(doctorId))));
  }

  bookAppointment(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  updateAppointment(id: string, data: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  cancelAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
=======
  getPatientAppointments(patientId: string) {
    return this.http.get<Appointment[]>(`http://localhost:3000/appointments?patientId=${patientId}`);
  }

  getDoctorAppointments(doctorId: string) {
    return this.http.get<Appointment[]>(`${this.baseUrl}?doctorId=${doctorId}`);
  }

  bookAppointment(appointment: Appointment) {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  updateAppointment(id: string, data: Partial<Appointment>) {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  cancelAppointment(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
>>>>>>> 771e485 (add home page)
  }
}
