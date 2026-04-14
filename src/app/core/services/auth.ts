import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ── Helper: always coerce id to string ─────────────────────────────────
  private normalizeUser(user: User): User {
    return { ...user, id: String(user.id) };
  }

  /** Check if email already exists */
  getUserByEmail(email: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(email)}`)
      .pipe(map(users => users.map(u => this.normalizeUser(u))));
  }

  getUserByPhone(phone: string): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?phone=${phone}`)
      .pipe(map(users => users.map(u => this.normalizeUser(u))));
  }

  updatePassword(userId: string, newPassword: string): Observable<User> {
    return this.http
      .patch<User>(`${this.apiUrl}/users/${userId}`, { password: newPassword })
      .pipe(map(u => this.normalizeUser(u)));
  }

  /**
   * Login: fetch by email only, then verify password in code.
   * Avoids json-server query issues with special characters like @ and .
   */
  login(email: string, password: string): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(email)}`)
      .pipe(
        map(users => {
          const user = users.find(u =>
            u.email === email &&
            u.password === password
          );
          if (!user) throw new Error('Invalid credentials');
          return this.normalizeUser(user); // id always string
        }),
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', `fake-token-${user.id}`);
        })
      );
  }

  /**
   * Register a new user (always as patient from public register page).
   */
  register(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      map(user => this.normalizeUser(user)),
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
    if (!data) return null;
    const user = JSON.parse(data) as User;
    return this.normalizeUser(user);
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