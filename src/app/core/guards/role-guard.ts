import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * authGuard – blocks any route if the user is not logged in.
 * Redirects to /auth/login.
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/auth/login']);
  return false;
};

/**
 * roleGuard – used with canMatch on lazy-loaded feature routes.
 * Each route must carry  data: { expectedRoles: ['admin'] }
 * If the user has the right role → allow.
 * Otherwise redirect to their own dashboard (or login if not authenticated).
 */
export const roleGuard: CanMatchFn = (route, _segments) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['expectedRoles'] as string[] | undefined;
  const userRole      = auth.getRole();

  if (auth.isLoggedIn() && userRole && expectedRoles?.includes(userRole)) {
    return true;
  }

  // Redirect to the user's own dashboard or login
  const destination = auth.getDashboardRoute();
  if (destination.length) {
    router.navigate(destination);
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};
