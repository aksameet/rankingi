// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, BehaviorSubject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = 'http://localhost:3000';
  // private apiBaseUrl = 'https://api-jfyc2o6rla-uc.a.run.app';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiBaseUrl}/auth/login`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.isLoggedInSubject.next(true);
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isLoggedInSubject.next(false);
        })
      );
  }

  checkAuth(): Observable<boolean> {
    return this.http
      .get<{ authenticated: boolean; user?: any }>(
        `${this.apiBaseUrl}/auth/status`,
        { withCredentials: true }
      )
      .pipe(
        map((response) => {
          this.isLoggedInSubject.next(response.authenticated);
          return response.authenticated;
        }),
        catchError((err) => {
          // On error (e.g. 401), update state and return false
          this.isLoggedInSubject.next(false);
          return of(false);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}
