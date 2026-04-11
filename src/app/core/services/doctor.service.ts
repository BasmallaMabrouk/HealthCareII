import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    const params = new HttpParams().set('role', 'doctor');
    return this.http.get<Doctor[]>(this.apiUrl, { params });
  }

  searchDoctors(name: string, specialty: string): Observable<Doctor[]> {
    let params = new HttpParams().set('role', 'doctor');

    if (name) {
      params = params.set('name_like', name);
    }
    if (specialty && specialty !== 'All') {
      params = params.set('specialization', specialty);
    }

    return this.http.get<Doctor[]>(this.apiUrl, { params });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
}
