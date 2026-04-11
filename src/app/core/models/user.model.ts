export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  createdAt: string;
}
