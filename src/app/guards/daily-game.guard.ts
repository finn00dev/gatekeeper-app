import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const dailyGameGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const cookieValue = cookieService.get('todaysResult');
  if (cookieValue) {
    return router.parseUrl('/results');
  }

  return true;
};
