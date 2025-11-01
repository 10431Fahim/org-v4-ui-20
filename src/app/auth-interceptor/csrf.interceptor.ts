import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfTokenService } from '../services/core/csrf-token.service';

export const CsrfInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const csrfTokenService = inject(CsrfTokenService);
  
  const token = csrfTokenService.getToken();

  // শুধু unsafe method (POST/PUT/DELETE) এ token attach করব
  const isUnsafeMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);

  if (token && isUnsafeMethod) {
    const cloned = req.clone({
      withCredentials: true,
      setHeaders: {
        'X-CSRF-Token': token
      }
    });
    return next(cloned);
  }

  return next(req);
};
