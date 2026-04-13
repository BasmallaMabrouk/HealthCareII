import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /** Check if email already exists */
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`);
  }

  getUserByPhone(phone: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?phone=${phone}`);
  }

  updatePassword(userId: string, newPassword: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, { password: newPassword });
  }

  /**
   * Login: fetch user by email+password, store in localStorage
   */
  login(email: string, password: string): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          if (!users.length) throw new Error('Invalid credentials');
          return users[0];
        }),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', `fake-token-${user.id}`);
        })
      );
  }

  /**
   * Register a new user (always as patient from public register page)
   */
  register(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', `fake-token-${user.id}`);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getRole(): 'admin' | 'doctor' | 'patient' | null {
    return this.getCurrentUser()?.role ?? null;
  }

  /**
   * Returns the correct dashboard route array based on user role.
   */
  getDashboardRoute(): string[] {
    const role = this.getRole();
    if (role === 'admin') return ['/admin/dashboard'];
    if (role === 'doctor') {
      const user = this.getCurrentUser();
      return [`/doctor/${user?.id}/dashboard`];
    }
    return ['/patient/dashboard'];
  }
}
