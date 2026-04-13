import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalRecord } from '../models/medical-record.model';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {
  private apiUrl = 'http://localhost:3000/medicalRecords';

  constructor(private http: HttpClient) {}

  /**
   * جيب كل الـ records وعمل filter على الـ client
   * عشان نتجنب مشكلة JSON Server مع الـ ID types
   */
  getPatientRecords(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl).pipe(
      map(all => all.filter(r => String(r.patientId) === String(patientId)))
    );
  }

  getRecordById(recordId: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${recordId}`);
  }

  addMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrl, record);
  }
}