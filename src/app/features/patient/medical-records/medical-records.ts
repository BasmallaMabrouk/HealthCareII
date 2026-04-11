import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordService } from '../../../core/services/medical-record.service';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit {
  records: any[] = [];
  selectedRecord: any = null;
  showModal = false;
  isLoading = true;
  currentPatientId = '';

  constructor(private recordService: MedicalRecordService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentPatientId = String(JSON.parse(saved).id);
    }
    this.loadRecords();
  }

  loadRecords() {
    this.isLoading = true;
    this.recordService.getPatientRecords(this.currentPatientId).subscribe({
      next: (data) => { this.records = data; this.isLoading = false; },
      error: ()     => { this.isLoading = false; }
    });
  }

  openPrescription(record: any) {
    this.selectedRecord = record;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRecord = null;
  }
}
