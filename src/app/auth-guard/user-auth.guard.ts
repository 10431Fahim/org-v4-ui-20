import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/common/user.service';
import { environment } from '../../environments/environment';

export const userAuthGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const isUser = userService.getUserStatus();
  if (!isUser) {
    router.navigate([environment.userLoginUrl]);
  }
  return isUser;
};
