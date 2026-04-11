import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../models/medical-record.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = 'http://localhost:3000/medicalRecords';

  constructor(private http: HttpClient) {}

  getPatientRecords(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}?patientId=${patientId}`);
  }

  getRecordById(recordId: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${recordId}`);
  }

  addMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrl, record);
  }
}
