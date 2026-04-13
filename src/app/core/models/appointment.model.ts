export interface Medicine {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface MedicalHistory {
  symptoms: string;
  allergies: string;
  chronicDiseases: string;
  previousSurgeries: string;
  currentMedications: string;
}

export interface Prescription {
  notes: string;
  medicines: Medicine[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  medicalHistory?: MedicalHistory;
  prescription?: Prescription;
}
