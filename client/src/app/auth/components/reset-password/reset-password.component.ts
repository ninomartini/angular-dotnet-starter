import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  credentials = {
    email: '',
    token: '',
    password: '',
    confirmPassword: ''
  };
  resetPasswordForm: FormGroup;
  validationErrors: string[] = [];
  buttonBusy = false;

  constructor(              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,256})';
    this.resetPasswordForm = this.fb.group({
      password: [ '', [ Validators.required, Validators.pattern(passwordPattern) ] ],
      confirmPassword: [ '', [ Validators.required, this.matchValues('password') ] ]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true };
    };
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.buttonBusy = true;

    this.credentials = this.resetPasswordForm.value;
    this.credentials.email = this.route.snapshot.queryParams.email;
    this.credentials.token = this.route.snapshot.queryParams.token;

    this.authService.resetPassword(this.credentials).subscribe({
      next: () => {
        this.toastr.success('Password reset');
        this.router.navigateByUrl('/auth/login').then();
        this.buttonBusy = false;
      },
      error: (err) => {
        this.buttonBusy = false;
        this.validationErrors = err;
      }
    });
  }

}
