import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface ErpUser {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  full_name?: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  user?: ErpUser;
}

@Injectable({ providedIn: 'root' })
export class ErpAuthService {
  private readonly API_BASE = environment.apiUrl;
  private readonly ACCESS_TOKEN_KEY = 'erp_access_token';
  private readonly REFRESH_TOKEN_KEY = 'erp_refresh_token';
  private readonly USER_KEY = 'erp_user';

  private readonly userSubject = new BehaviorSubject<ErpUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.API_BASE}/auth/login`, credentials).pipe(
      tap((response) => {
        this.storeTokens(response.access_token, response.refresh_token, response.user);
      })
    );
  }

  async logout(): Promise<void> {
    const token = this.getAccessToken();

    try {
      if (token) {
        await fetch(`${this.API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.warn('ERP logout request failed; clearing local session anyway.', error);
    } finally {
      this.clearSession();
      await this.router.navigate(['/erp/login']);
    }
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenResponse>(`${this.API_BASE}/auth/refresh`, { refresh_token: refreshToken }).pipe(
      tap((response) => {
        this.storeTokens(response.access_token, response.refresh_token, response.user ?? this.currentUser);
      })
    );
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  hasSession(): boolean {
    return !!this.getAccessToken();
  }

  get currentUser(): ErpUser | null {
    return this.userSubject.value;
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const cachedUser = localStorage.getItem(this.USER_KEY);
    if (cachedUser) {
      try {
        this.userSubject.next(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem(this.USER_KEY);
      }
    }

    const token = this.getAccessToken();
    if (!token) {
      return;
    }

    this.http.get<ErpUser>(`${this.API_BASE}/auth/me`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).pipe(
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    ).subscribe((user) => {
      if (user) {
        this.userSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    });
  }

  private storeTokens(accessToken: string, refreshToken: string, user?: ErpUser | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    this.userSubject.next(null);
  }
}
