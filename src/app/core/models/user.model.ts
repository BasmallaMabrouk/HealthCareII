export interface AvailableSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'doctor' | 'patient';
  isActive?: boolean;
  createdAt: string;
  // Doctor-specific
  specialization?: string;
  experience?: number;
  bio?: string;
  availableSlots?: AvailableSlot[];
  rating?: number;
  reviewCount?: number;
}