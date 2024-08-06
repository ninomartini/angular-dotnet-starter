import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs/operators";
import { StandardParams } from "../models/params";
import { getPaginatedResult, getPaginationHeaders } from "../helpers/pagination-helper";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private authService: AuthService,
              private http: HttpClient) {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: User) => this.user = user);
  }

  getUsers(standardParams: StandardParams) {
    let params = getPaginationHeaders(standardParams.pageNumber, standardParams.pageSize);

    if (standardParams.sortKey !== undefined) {
      params = params.append('sortKey', standardParams.sortKey);
    }

    if (standardParams.sortDesc !== undefined) {
      params = params.append('sortDesc', standardParams.sortDesc ? 'true' : 'false');
    }

    if (standardParams.filter !== undefined) {
      params = params.append('filter', standardParams.filter);
    }

    return getPaginatedResult<User[]>(this.baseUrl + 'users', params, this.http);
  }

  getUser(id: string) {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  getUserProfile() {
    return this.http.get<User>(this.baseUrl + 'users/profile');
  }

  createUser(user: User) {
    return this.http.post(this.baseUrl + 'users', user);
  }

  updateUser(user: User) {
    return this.http.put(this.baseUrl + 'users', user);
  }

  updateUserProfile(user: User) {
    return this.http.post(this.baseUrl + 'users/profile', user);
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + 'users/' + id);
  }

  getRolesArray(user): any[] {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles = [];

    availableRoles.push({ name: 'Administrator', value: 'Administrator' });
    availableRoles.push({ name: 'Guest', value: 'Guest' });

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.value === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });

    return roles;
  }
}
