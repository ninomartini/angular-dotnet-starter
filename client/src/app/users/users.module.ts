import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserUpsertComponent } from './components/user-upsert/user-upsert.component';
import { SharedModule } from "../shared/shared.module";
import { ModalMyProfileComponent } from './components/modal-my-profile/modal-my-profile.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserUpsertComponent,
    ModalMyProfileComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
