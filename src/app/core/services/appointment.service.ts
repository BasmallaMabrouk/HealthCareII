import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/appointments';

  getPatientAppointments(patientId: string) {
    return this.http.get<Appointment[]>(`http://localhost:3000/appointments?patientId=${patientId}`);
  }

  getDoctorAppointments(doctorId: string) {
    return this.http.get<Appointment[]>(`${this.baseUrl}?doctorId=${doctorId}`);
  }

  bookAppointment(appointment: Partial<Appointment>) {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  updateAppointment(id: string, data: Partial<Appointment>) {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  cancelAppointment(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
