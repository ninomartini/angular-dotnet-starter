import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  validationErrors: string[] = [];
  buttonBusy = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,256})';
    this.registerForm = this.formBuilder.group({
      firstName: [ '', Validators.required ],
      lastName: [ '', Validators.required ],
      userName: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ] ],
      phoneNumber: [ '', Validators.required ],
      password: [ '', [ Validators.required, Validators.pattern(passwordPattern) ] ],
      confirmPassword: [ '', [ Validators.required, this.matchValues('password') ] ],
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true };
    };
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.buttonBusy = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.buttonBusy = false;
        this.router.navigateByUrl('/').then();
      },
      error: (err) => {
        this.buttonBusy = false;
        this.validationErrors = err;
      }
    });
  }

}
