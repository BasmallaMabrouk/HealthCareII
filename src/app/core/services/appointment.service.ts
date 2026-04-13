import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/appointments';

  /**
   * جيب كل الـ appointments وعمل filter على الـ client
   * عشان نتجنب مشكلة JSON Server مع الـ ID types (string vs number)
   */
  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl).pipe(
      map(all => all.filter(a => String(a.patientId) === String(patientId)))
    );
  }

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl).pipe(
      map(all => all.filter(a => String(a.doctorId) === String(doctorId)))
    );
  }

  bookAppointment(appointment: Appointment) {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  updateAppointment(id: string, data: Partial<Appointment>) {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  cancelAppointment(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}