import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { User } from "../../../core/models/user";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "../../../core/services/users.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: [ './user-upsert.component.scss' ]
})
export class UserUpsertComponent implements OnInit {
  form: FormGroup;
  validationErrors: string[] = [];
  roles: any[];

  user: User = { email: "", firstName: "", id: "", lastName: "", phoneNumber: "", roles: [], token: "", userName: "" }

  isFormSubmitted = false;
  isFormValid = () => this.isFormSubmitted || !this.form?.dirty;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.user !== null) {
        this.user = data.user;
      }
      this.initForm();
    });
  }

  initForm() {
    this.roles = this.usersService.getRolesArray(this.user);

    if (this.user.id === '') {
      const passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,256})';
      this.form = this.formBuilder.group({
        id: [this.user.id],
        userName: [this.user.userName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneNumber: [this.user.phoneNumber],
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
        confirmPassword: ['', [Validators.required, this.matchValues('password')]],
        roles: ['']
      });
    } else {
      this.form = this.formBuilder.group({
        id: [this.user.id],
        userName: [this.user.userName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneNumber: [this.user.phoneNumber],
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        roles: ['']
      });
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true};
    };
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.isFormSubmitted = true;

    const rolesToUpdate = {
      roles: [...this.roles.filter(el => el.checked === true).map(el => el.value)]
    };

    this.form.value.roles = rolesToUpdate.roles.toString();
    if (this.form.value.roles === '') {
      this.toastrService.warning('The user must have at least one role');
      return;
    }

    if (this.user.id === '') {
      this.usersService.createUser(this.form.value).subscribe({
        next: () => {
          this.toastrService.success('Successfully added the user');
          this.user = this.form.value;
          this.form.reset(this.user);
          this.router.navigateByUrl('/admin/users').then();
        },
        error: (err) => {
          this.validationErrors = err;
        }
      });
    } else {
      this.usersService.updateUser(this.form.value).subscribe({
        next: () => {
          this.toastrService.success('Successfully updated the user');
          this.user = this.form.value;
          this.form.reset(this.user);
          this.router.navigateByUrl('/admin/users').then();
        },
        error: (err) => {
          this.validationErrors = err;
        }
      });
    }
  }

  cancel() {
    this.form.reset(this.user);
    this.router.navigateByUrl('/admin/users').then();
  }

}
