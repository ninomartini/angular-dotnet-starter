import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from "../services/auth.service";

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let roles = next.firstChild.data.roles as Array<string>;

  return authService.currentUser$.pipe(
    map(user => {
      if (roles) {
        if (roleMatch(user.roles, roles)) {
          return true;
        } else {
          router.navigateByUrl('/').then();
        }
      }

      if (user) {
        return true;
      }

      router.navigateByUrl('/auth/login').then();
      return false;
    })
  );

  function roleMatch(userRoles: any, allowedRoles: any) {
    let isMatch = false;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });

    return isMatch;
  }

}

