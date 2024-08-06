import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { User } from "../../core/models/user";
import { UsersService } from "../../core/services/users.service";

export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot) => {
  if (route.paramMap.get('id') !== null) {
    return inject(UsersService).getUser(route.paramMap.get('id'));
  } else {
    return null;
  }
}
