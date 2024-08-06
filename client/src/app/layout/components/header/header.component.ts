import { Component } from '@angular/core';
import { User } from "../../../core/models/user";
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs/operators";
import {
  ModalChangePasswordComponent
} from "../../../auth/components/modal-change-password/modal-change-password.component";
import { ModalMyProfileComponent } from "../../../users/components/modal-my-profile/modal-my-profile.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user: User;

  constructor(public authService: AuthService,
              public router: Router,
              private modalService: NgbModal,
              private toastrService: ToastrService) {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: User) => {
      this.user = user
    });
  }

  myProfile() {
    const options: NgbModalOptions = {
      backdrop: 'static',
      centered: false
    }

    const modalRef = this.modalService.open(ModalMyProfileComponent, options);

    modalRef.result.then(
      (result) => {
        if (result === 'btnSave') {
          this.authService.currentUser$.pipe(take(1)).subscribe((user: User) => {
            this.user = user
          });
          this.toastrService.success('Updated user profile');
        }
      },
      (reason) => {
      }
    );
  }

  changePassword() {
    const options: NgbModalOptions = {
      backdrop: 'static',
      centered: false
    }

    const modalRef = this.modalService.open(ModalChangePasswordComponent, options);

    modalRef.result.then(
      (result) => {
        if (result === 'btnSave') {
          this.toastrService.success('Successfully updated the password');
        }
      },
      (reason) => {
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('auth/login').then();
  }
}
