import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit {
  records: any[] = [];
  appointmentsMap: { [appointmentId: string]: Appointment } = {};

  selectedAppointment: Appointment | null = null;
  selectedRecord: any = null;
  showPrescriptionModal = false;

  isLoading = true;
  currentPatientId = '';

  constructor(
    private recordService: MedicalRecordService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentPatientId = String(JSON.parse(saved).id);
    }
    this.loadAll();
  }

  loadAll() {
    this.isLoading = true;
    forkJoin({
      records: this.recordService.getPatientRecords(this.currentPatientId),
      appointments: this.appointmentService.getPatientAppointments(this.currentPatientId)
    }).subscribe({
      next: ({ records, appointments }) => {
        this.records = records;
        appointments.forEach(a => {
          if (a.prescription?.medicines?.length) {
            this.appointmentsMap[String(a.id)] = a;
          }
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getPrescription(record: any): Appointment | null {
    if (!record.appointmentId) return null;
    return this.appointmentsMap[String(record.appointmentId)] || null;
  }

  openPrescriptionModal(record: any) {
    this.selectedRecord = record;
    this.selectedAppointment = this.getPrescription(record);
    this.showPrescriptionModal = true;
  }

  closeModal() {
    this.showPrescriptionModal = false;
    this.selectedAppointment = null;
    this.selectedRecord = null;
  }
}