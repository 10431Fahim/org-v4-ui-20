import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/common/user.service';
import { environment } from '../../environments/environment';

export const userAuthStateGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const isUser = userService.getUserStatus();
  if (!isUser) {
    return true;
  }
  return router.navigate([environment.userBaseUrl]);
};
