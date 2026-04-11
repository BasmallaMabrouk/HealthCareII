export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  notes: string;
  date: string;
  medications: Medication[];
}

export interface Medication {
  name: string;
  dosage: string;
  instructions: string;
}
