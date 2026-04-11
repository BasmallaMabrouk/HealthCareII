import { User } from './user.model';

export interface Doctor extends User {
  specialization: string;
  experience: number;
  bio: string;
  availableSlots: TimeSlot[];
  rating: number;
  reviewCount: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
