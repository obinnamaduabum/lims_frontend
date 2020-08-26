import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../service/user.service';
import {ResponseModel} from '../../models/response-model';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {DoesEmailExistValidator} from '../../validator/asyn_validator/does-email-exists.validator';
import {PasswordResetService} from '../../service/password-reset-service';
// import {UserService} from '../services/user.service';
// import {ResponseModel} from '../model/response-model';
// import {MyErrorStateMatcher} from '../model/my-error-state-matcher';
// import {PasswordResetService} from '../services/password-reset-service';
// import {DoesEmailExistValidator} from '../validator/asyn_validator/does-email-exists.validator';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css']
})
export class ForgotPasswordPageComponent implements OnInit {

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private passwordRestToken: PasswordResetService,
              private toastrService: ToastrService) {}

  checkingRequest: boolean;
  checkingEmail: boolean;
  emailFormGroup: FormGroup;
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  @ViewChild('email', {static: false}) email: ElementRef;
  serverResponseObject: ResponseModel;
  color = 'blue';
  mode = 'indeterminate';
  value = 10;

  matcher = new MyErrorStateMatcher();
  reactJsApp: any;

  ngOnInit() {
    this.setEmailFormGroup();
  }

  setEmailFormGroup() {
    this.emailFormGroup = this.fb.group({
      email: new FormControl('', [
        Validators.required, Validators.pattern(this.emailFormat)
      ], [DoesEmailExistValidator(this.userService)])
    });
  }

  sendToken() {

    if (this.emailFormGroup.valid) {
      this.checkingRequest = true;

      this.passwordRestToken.createToken(this.emailFormGroup.get('email').value).subscribe(data => {

        this.serverResponseObject = data;

        if (this.serverResponseObject.success) {

          this.checkingRequest = false;
          this.showSuccess(this.serverResponseObject.message);
        } else {
          this.showFailed(this.serverResponseObject.message);
          this.checkingRequest = false;
          // this.closeAlert();
        }
      }, error1 => {
        this.showFailed('failed');
        this.checkingRequest = false;
        // this.closeAlert();
      });
    } else {
      this.validateAllFormFields(this.emailFormGroup);
      this.showFailed('Email invalid');
    }
  }

  showSuccess(message: string) {
    this.toastrService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastrService.error(message, 'Error!');
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
}
