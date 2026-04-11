import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  login(credentials: { email: string; password: string }): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`
    );
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  getUserByPhone(phone: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?phone=${phone}`);
  }

  updatePassword(userId: string, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, { password: newPassword });
  }

  getCurrentUser(): any {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
