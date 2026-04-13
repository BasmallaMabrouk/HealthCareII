import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../../core/models/doctor.model';
import { Appointment, MedicalHistory, Prescription } from '../../core/models/appointment.model';
import { User } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})


export class DoctorService {
  private api = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // ─── Doctor ───────────────────────────────────────────────
  getDoctorProfile(id: string): Observable<Doctor> {
   return this.http.get<Doctor>(`${this.api}/${id}`);
  }

  updateDoctorProfile(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.api}/${id}`, data);
  }

  // ─── Appointments ─────────────────────────────────────────
  // json-server v1 مش بيعمل filter بـ query params صح
  // فبنجيب الكل ونعمل filter على client side
  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.api}/appointments`)
      .pipe(map((appts) => appts.filter((a) => String(a.doctorId) === String(doctorId))));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.api}/appointments/${id}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/appointments/${id}`, { status });
  }

  // ─── Medical History ──────────────────────────────────────
  updateMedicalHistory(
    appointmentId: string,
    medicalHistory: MedicalHistory,
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/appointments/${appointmentId}`, {
      medicalHistory,
    });
  }

  // ─── Prescription ─────────────────────────────────────────
  getPrescription(appointmentId: string): Observable<Prescription | undefined> {
    return this.getAppointmentById(appointmentId).pipe(map((appt) => appt.prescription));
  }

  updatePrescription(appointmentId: string, prescription: Prescription): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/appointments/${appointmentId}`, {
      prescription,
    });
  }

  deleteMedicine(
    appointmentId: string,
    medicineId: string,
    currentPrescription: Prescription,
  ): Observable<Appointment> {
    const updated: Prescription = {
      ...currentPrescription,
      medicines: currentPrescription.medicines.filter((m) => m.id !== medicineId),
    };
    return this.updatePrescription(appointmentId, updated);
  }

  // ─── Patients ─────────────────────────────────────────────
  getPatient(id: string): Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`);
  }

  getAllPatients(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.api}/users`)
      .pipe(map((users) => users.filter((u) => u.role === 'patient')));
  }



  getDoctors(): Observable<Doctor[]> {
    const params = new HttpParams().set('role', 'doctor');
    return this.http.get<Doctor[]>(this.api, { params });
  }

  searchDoctors(name: string, specialty: string): Observable<Doctor[]> {
    let params = new HttpParams().set('role', 'doctor');

    if (name) {
      params = params.set('name_like', name);
    }
    if (specialty && specialty !== 'All') {
      params = params.set('specialization', specialty);
    }

    return this.http.get<Doctor[]>(this.api, { params });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.api}/${id}`);
  }
}
