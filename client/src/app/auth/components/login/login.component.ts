import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../../core/services/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  credentials = {
    userName: '',
    password: '',
    rememberMe: false
  };
  buttonBusy = false;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('rememberMe')) === true) {
      this.credentials.userName = localStorage.getItem('user');
      this.credentials.rememberMe = true;
    }
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.buttonBusy = true;

    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    if (this.credentials.rememberMe) {
      localStorage.setItem('user', this.credentials.userName);
      localStorage.setItem('rememberMe', JSON.stringify(this.credentials.rememberMe));
    }

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.buttonBusy = false;
        this.router.navigateByUrl('/').then();
      },
      error: () => {
        this.buttonBusy = false;
      }
    });
  }
}
