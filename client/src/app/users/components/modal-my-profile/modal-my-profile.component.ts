import { Component, OnInit } from '@angular/core';
import { User } from "../../../core/models/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../../core/services/users.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-modal-my-profile',
  templateUrl: './modal-my-profile.component.html',
  styleUrls: ['./modal-my-profile.component.scss']
})
export class ModalMyProfileComponent implements OnInit {
  user: User;
  myProfileForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private usersService: UsersService,
              private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.load();
  }

  initForm(): void {
    this.myProfileForm = this.formBuilder.group({
      id: [ null, Validators.required ],
      userName: [ '', Validators.required ],
      firstName: [ '', Validators.required ],
      lastName: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
      phoneNumber: ['']
    });
  }

  load(): void {
    this.usersService.getUserProfile().subscribe((user: User) => {
      this.user = user;
      this.myProfileForm.patchValue(this.user);
    });
  }

  save(): void {
    if (this.myProfileForm.invalid) {
      return;
    }

    this.usersService.updateUserProfile(this.myProfileForm.value).subscribe({
      next: (user: User) => {
        this.authService.setCurrentUser(user);
        this.activeModal.close('btnSave');
      },
      error: error => {
        this.validationErrors = error;
      }
    });
  }

  close(result: string): void {
    this.activeModal.close(result);
  }

}
