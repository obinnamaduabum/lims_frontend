import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {UserService} from '../../../service/user.service';
import {PasswordMatchValidator} from '../../../validator/password.validator';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordFormGroup: FormGroup;
  checkingRequest = false;
  matcher = new MyErrorStateMatcher();
  passwordMinLength = 5;
  showPassword = false;
  showOldPassword = false;
  showConfirmPassword = false;
  public barLabel = 'Password strength:';
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];
  isOldPasswordValid = 2;
  checkingOldPassword = false;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastrService: ToastrService) { }

  ngOnInit() {
    this.changePasswordForm();

    this.changePasswordFormGroup.get('oldPassword').valueChanges.subscribe(data => {
      if (data) {
        this.checkIfOldPasswordMatches(data);
      }
    });

    this.changePasswordFormGroup.get('password').valueChanges.subscribe(data => {
      this.changePasswordFormGroup.get('confirmPassword').setValue('');
    });
  }
  changePasswordForm() {
    this.changePasswordFormGroup = this.fb.group({
      oldPassword: new FormControl('', [Validators.required]),
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
      confirmPassword: ['', [Validators.required, PasswordMatchValidator, Validators.minLength(this.passwordMinLength)]]
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  checkIfOldPasswordMatches(value) {
    const request = new CheckOldPasswordExistsModel();
    request.oldPassword = value;
    this.checkingOldPassword = true;
    this.userService.checkIfOldPasswordMatches(request).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.checkingOldPassword = false;
      if (responseModel.success) {
        this.isOldPasswordValid = 1;
        this.changePasswordFormGroup.get('oldPassword').setErrors(null);
      } else {
        this.isOldPasswordValid = 0;
        this.changePasswordFormGroup.get('oldPassword').setErrors({incorrect: true});
      }
    }, error1 => {
      this.checkingOldPassword = false;
      this.isOldPasswordValid = 0;
      this.changePasswordFormGroup.get('oldPassword').setErrors({incorrect: true});
    });
  }

  updateUser() {

    this.validateAllFormFields(this.changePasswordFormGroup);
    if (this.changePasswordFormGroup.valid && this.isOldPasswordValid === 1) {
      const changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
      changePasswordModel.oldPassword = this.changePasswordFormGroup.get('oldPassword').value;
      changePasswordModel.newPassword = this.changePasswordFormGroup.get('password').value;
      this.userService.changePassword(changePasswordModel).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        this.showFailed('Server error!');
      });
    } else {
      this.showFailed('Kindly fill all required fields');
    }
  }

  showSuccess(message: string) {
    this.toastrService.success(message, 'Success!');
  }
  showFailed(message: string) {
    this.toastrService.error(message, 'Error!');
  }
}

export class CheckOldPasswordExistsModel {
  oldPassword: string;
}


export class ChangePasswordModel {
  oldPassword: string;
  newPassword: string;
}
