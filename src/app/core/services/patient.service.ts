import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDoctors() {
    return this.http.get<any[]>(`${this.apiUrl}/users?role=doctor`);
  }

  getMyAppointments(patientId: string) {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments?patientId=${patientId}`);
  }

  bookAppointment(appointment: Partial<Appointment>) {
    return this.http.post(`${this.apiUrl}/appointments`, appointment);
  }
}
