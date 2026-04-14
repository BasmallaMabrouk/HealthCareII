import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../../core/models/doctor.model';
import { Appointment, MedicalHistory, Prescription } from '../../core/models/appointment.model';
import { User } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private usersApi = 'http://localhost:3000/users';
  private appointmentsApi = 'http://localhost:3000/appointments'; // ✅ منفصل

  constructor(private http: HttpClient) {}

  // ─── Doctor ───────────────────────────────────────────────
  getDoctorProfile(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.usersApi}/${id}`);
  }

  updateDoctorProfile(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.usersApi}/${id}`, data); // ✅ PATCH مش PUT
  }

  // ─── Appointments ─────────────────────────────────────────
  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.appointmentsApi}`) // ✅ صح
      .pipe(map((appts) => appts.filter((a) => String(a.doctorId) === String(doctorId))));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.appointmentsApi}/${id}`); // ✅
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.appointmentsApi}/${id}`, { status }); // ✅
  }

  // ─── Medical History ──────────────────────────────────────
  updateMedicalHistory(
    appointmentId: string,
    medicalHistory: MedicalHistory,
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.appointmentsApi}/${appointmentId}`, {
      medicalHistory,
    }); // ✅
  }

  // ─── Prescription ─────────────────────────────────────────
  getPrescription(appointmentId: string): Observable<Prescription | undefined> {
    return this.getAppointmentById(appointmentId).pipe(map((appt) => appt.prescription));
  }

  updatePrescription(appointmentId: string, prescription: Prescription): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.appointmentsApi}/${appointmentId}`, {
      prescription,
    }); // ✅
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
    return this.http.get<User>(`${this.usersApi}/${id}`); // ✅ مش usersApi/users/id
  }

  getAllPatients(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.usersApi}`)
      .pipe(map((users) => users.filter((u) => u.role === 'patient')));
  }

  // ─── Doctors ──────────────────────────────────────────────
  getDoctors(): Observable<Doctor[]> {
    const params = new HttpParams().set('role', 'doctor');
    return this.http.get<Doctor[]>(this.usersApi, { params });
  }

  searchDoctors(name: string, specialty: string): Observable<Doctor[]> {
    let params = new HttpParams().set('role', 'doctor');
    if (name) params = params.set('name_like', name);
    if (specialty && specialty !== 'All') params = params.set('specialization', specialty);
    return this.http.get<Doctor[]>(this.usersApi, { params });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.usersApi}/${id}`);
  }
}
