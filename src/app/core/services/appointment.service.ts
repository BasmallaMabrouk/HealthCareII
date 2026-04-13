import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/appointments';

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
  }
}
