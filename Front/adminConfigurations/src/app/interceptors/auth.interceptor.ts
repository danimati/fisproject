import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login and refresh endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    // Add auth token to request
    let authReq = this.addTokenToRequest(request);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors
        if (error.status === 401) {
          if (!this.isRefreshing) {
            return this.handle401Error(authReq, next);
          } else {
            // If refresh is in progress, wait for it to complete
            return this.waitForRefreshAndRetry(authReq, next);
          }
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private waitForRefreshAndRetry(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        const retryRequest = this.addTokenToRequest(request);
        return next.handle(retryRequest);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return from(this.authService.refreshToken()).pipe(
      switchMap((tokenResponse) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(tokenResponse.access_token);
        
        // Retry the original request with new token
        const retryRequest = this.addTokenToRequest(request);
        return next.handle(retryRequest);
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        
        // Refresh failed, logout and redirect to login
        this.authService.clearTokens();
        this.router.navigate(['/login']);
        
        return throwError(() => error);
      })
    );
  }
}
