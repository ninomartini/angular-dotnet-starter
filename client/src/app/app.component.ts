import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { User } from "./core/models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    let publicFlag = false;
    const publicUrls = [
      '/auth/',
      '/survey/',
      '/public/'
    ];
    const user: User = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      this.authService.setCurrentUser(user);
    } else {
      const url = window.location.href;

      for (const publicUrl of publicUrls) {
        const urlIndex = url.search(publicUrl);
        if (urlIndex !== -1) {
          publicFlag = true;
          this.router.navigateByUrl(url.substring(urlIndex)).then();
          break;
        }
      }

      if (!publicFlag) {
        this.router.navigateByUrl('auth/login').then();
      }
    }
  }
}
