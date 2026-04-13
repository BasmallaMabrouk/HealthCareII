import { User } from './user.model';

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Doctor extends User {
  specialization: string;
  experience: number;
  bio: string;
  patients: number;
  availableSlots: TimeSlot[];
  rating?: number;
  reviewCount?: number;
}
