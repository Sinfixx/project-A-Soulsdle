import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return true;
  }

  // Rediriger vers la page de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
