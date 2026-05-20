import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ErpAuthService } from './erp-auth.service';

export const erpAuthGuard: CanActivateFn = () => {
  const auth = inject(ErpAuthService);
  const router = inject(Router);

  return auth.hasSession() ? true : router.createUrlTree(['/erp/login']);
};
