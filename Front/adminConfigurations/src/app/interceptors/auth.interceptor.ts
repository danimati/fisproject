import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth for login and refresh endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Add auth token to request
  const authReq = addTokenToRequest(req, authService);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors
      if (error.status === 401) {
        if (!isRefreshing) {
          return handle401Error(authReq, next, authService, router);
        } else {
          // If refresh is in progress, wait for it to complete
          return waitForRefreshAndRetry(authReq, next, authService);
        }
      }
      return throwError(() => error);
    })
  );
};

function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/refresh');
}

function addTokenToRequest(req: HttpRequest<unknown>, authService: AuthService): HttpRequest<unknown> {
  const token = authService.getToken();
  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return req;
}

function waitForRefreshAndRetry(req: HttpRequest<unknown>, next: any, authService: AuthService): Observable<HttpEvent<unknown>> {
  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((): Observable<HttpEvent<unknown>> => {
      const retryRequest = addTokenToRequest(req, authService);
      return next(retryRequest);
    })
  ) as Observable<HttpEvent<unknown>>;
}

function handle401Error(req: HttpRequest<unknown>, next: any, authService: AuthService, router: Router): Observable<HttpEvent<unknown>> {
  isRefreshing = true;
  refreshTokenSubject.next(null);

  return from(authService.refreshToken()).pipe(
    switchMap((tokenResponse: any): Observable<HttpEvent<unknown>> => {
      isRefreshing = false;
      refreshTokenSubject.next(tokenResponse.access_token);

      // Retry the original request with new token
      const retryRequest = addTokenToRequest(req, authService);
      return next(retryRequest);
    }),
    catchError((error) => {
      isRefreshing = false;
      refreshTokenSubject.next(null);

      // Refresh failed, logout and redirect to login
      authService.clearTokens();
      router.navigate(['/front/erp/login']);

      return throwError(() => error);
    })
  );
}
