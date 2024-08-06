import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from "../core/guards/auth.guard";
import { DefaultComponent } from "../layout/components/default/default.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { UserUpsertComponent } from "./components/user-upsert/user-upsert.component";
import { userResolver } from "./resolvers/user.resolver";
import { FormValidGuard } from "../core/guards/form-valid.guard";

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [ authGuard ],
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: UserListComponent,
        data: { roles: [ 'Administrator' ] }
      },
      {
        path: 'add',
        component: UserUpsertComponent,
        resolve: { user: userResolver },
        canDeactivate: [ FormValidGuard ],
        data: { roles: [ 'Administrator' ] }
      },
      {
        path: 'edit/:id',
        component: UserUpsertComponent,
        resolve: { user: userResolver },
        canDeactivate: [ FormValidGuard ],
        data: { roles: [ 'Administrator' ] }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
