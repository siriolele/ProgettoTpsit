import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.esci();
        router.navigate(['/accesso']);
      }
      return throwError(() => error);
    })
  );
};