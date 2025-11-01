import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/common/user.service';

export const AuthUserInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const userService = inject(UserService);
  
  const authToken = userService.getUserToken();
  if (authToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next(authRequest);
  } else {
    const authRequest = req.clone();
    return next(authRequest);
  }
};
