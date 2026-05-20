import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErpAuthService } from './erp-auth.service';

export const erpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(ErpAuthService);
  const router = inject(Router);
  const token = auth.getAccessToken();
  const skipAuth = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  const isErpRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/erp');

  const request = token && !skipAuth && isErpRoute
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !skipAuth && isErpRoute) {
        auth.logout().catch(() => undefined);
        router.navigate(['/erp/login']);
      }

      return throwError(() => error);
    })
  );
};
