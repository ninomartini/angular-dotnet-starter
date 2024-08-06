import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPasswordForm') forgotPasswordForm: NgForm;
  credentials = {
    email: ''
  };
  buttonBusy = false;
  forgotPasswordCompleted = false;

  constructor(private authService: AuthService) {
  }

  send() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.buttonBusy = true;

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: () => {
        this.forgotPasswordForm.resetForm();
        this.buttonBusy = false;
        this.forgotPasswordCompleted = true;
      },
      error: () => {
        this.buttonBusy = false;
      }
    });
  }
}
