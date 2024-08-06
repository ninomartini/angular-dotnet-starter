import { Component, OnInit } from '@angular/core';
import { User } from "../../../core/models/user";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { take } from "rxjs/operators";

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss']
})
export class ModalChangePasswordComponent implements OnInit {
  user: User;
  changePasswordForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal) {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: User) => {
      this.user = user
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,256})';
    this.changePasswordForm = this.formBuilder.group({
      userName: [ this.user.userName ],
      currentPassword: [ '', [ Validators.required ] ],
      newPassword: [ '', [ Validators.required, Validators.pattern(passwordPattern) ] ],
      confirmPassword: [ '', [ Validators.required, this.matchValues('newPassword') ] ]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true };
    };
  }

  close(result: string): void {
    this.activeModal.close(result);
  }

  save() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.activeModal.close('btnSave');
      },
      error: (err) => {
        this.validationErrors = err;
      }
    });
  }

}
