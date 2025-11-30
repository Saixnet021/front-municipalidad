import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUser();
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        this.setSession(response);
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, data).pipe(
      tap((response: any) => {
        this.setSession(response);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('user_data');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setSession(response: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, response.token);
      const userData = {
        firstname: response.firstname,
        lastname: response.lastname
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
    this.loadUser();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const userDataStr = localStorage.getItem('user_data');
      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);
        this.userSubject.next({ ...userData, token });
      } else if (token) {
        this.userSubject.next({ token });
      }
    }
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }
}
