import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
  user?: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  full_name?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE: string;
  private readonly TOKEN_KEY = 'gateway_token';
  private readonly REFRESH_TOKEN_KEY = 'gateway_refresh_token';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService
  ) {
    this.API_BASE = this.configService.getApiUrl();
    this.initializeAuth();
  }

  private initializeAuth(): void {
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      if (token) {
        this.validateToken(token).subscribe({
          next: (user) => {
            this.currentUserSubject.next(user);
            this.initializedSubject.next(true);
          },
          error: (error) => {
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
              localStorage.removeItem(this.TOKEN_KEY);
            }
            this.currentUserSubject.next(null);
            this.initializedSubject.next(true);
          }
        });
      } else {
        this.currentUserSubject.next(null);
        this.initializedSubject.next(true);
      }
    } else {
      this.currentUserSubject.next(null);
      this.initializedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          this.setToken(response.access_token, response.refresh_token);
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }
      })
    );
  }

  logout(): void {
    console.log("logging out")
    const token = this.getToken();
    if (token) {
      fetch(`${this.API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        if (response.ok) {
          this.clearTokens();
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.clearTokens();
      this.router.navigate(['/login']);
    }
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get isInitialized(): boolean {
    return this.initializedSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private setToken(token: string, refreshToken?: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Refresh token failed');
    }

    const tokenResponse: LoginResponse = await response.json();
    
    // Update tokens
    this.setToken(tokenResponse.access_token, tokenResponse.refresh_token);
    
    return tokenResponse;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  private validateToken(token: string): Observable<User> {
    
    return this.http.get<any>(`${this.API_BASE}/auth/me`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).pipe(
      tap(response => {
        if (response) {
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  validateTokenPublic(): Observable<Boolean> {
    const token = this.getToken();
    if (token) {
      
      return this.validateToken(token).pipe(
        map(() => true)
      );
    }
    return of(false);
  }



}
