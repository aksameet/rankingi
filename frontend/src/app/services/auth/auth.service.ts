import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = 'http://localhost:3000';
  private isLoggedIn = false;

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
          this.isLoggedIn = true;
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isLoggedIn = false;
        })
      );
  }

  checkAuth(): Observable<boolean> {
    if (this.isLoggedIn) {
      return of(true);
    } else {
      return this.http
        .get<{ authenticated: boolean; user?: any }>(
          `${this.apiBaseUrl}/auth/status`,
          { withCredentials: true }
        )
        .pipe(
          map((response) => {
            this.isLoggedIn = response.authenticated;
            return response.authenticated;
          })
        );
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
