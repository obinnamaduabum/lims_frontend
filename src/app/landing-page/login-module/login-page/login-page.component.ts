import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PhoneNumberCodeService} from '../../../service/phone_number_service';
import {MatStepper} from '@angular/material/stepper';
import {PhoneNumberAndEmailValidator} from '../../../validator/phonenumber-email.validator';
import {AsyncPhoneNumberAndEmailValidator} from '../../../validator/asyn_validator/asyn-phonenumber-email.validator';
import {PhoneNumberVerificationService} from '../../../service/phone-number-verification';
import {UserService} from '../../../service/user.service';
import {ToastrService} from 'ngx-toastr';
import {PhoneNumberDialogComponent} from '../../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {MatDialog} from '@angular/material/dialog';
import {PhoneNumberCodes} from '../../../models/phone-number-codes-model';
import {LoginInfoService} from '../../../service/login-info.service';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LoginInfoModel} from '../../../models/login-info-model';
import {LoginModel} from '../../../models/login-model';
import {ResponseModel} from '../../../models/response-model';
import {AuthenticationService} from '../../../service/authentication-service';
import {ActivatedRoute, Router} from '@angular/router';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';
import {Subscription} from 'rxjs';
import {PortalUserModel} from '../../../models/portal-user-model';
import {UserRoleTypeConstant} from '../../../lh-enum/user-roles';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  isLinear = true;
  matcher = new MyErrorStateMatcher();
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  twoFactorFormGroup: FormGroup;
  loadingPageData = false;
  isNumber = false;
  isNumberAnimateValue = 'inactive';
  phoneNumberCodesList: PhoneNumberCodes[];
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  isTwoFactorEnabled = false;
  loadingPreloader = false;
  loginInfoSubscription: Subscription;
  private returnUrl: string;

  constructor(private fb: FormBuilder,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private userService: UserService,
              private dialog: MatDialog,
              private toastService: ToastrService,
              private loginInfoService: LoginInfoService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.emailFormGroup = this.fb.group({
      email: ['', [ PhoneNumberAndEmailValidator('phoneNumber'), Validators.required ],
        [ AsyncPhoneNumberAndEmailValidator(
          this.userService,
          this.phoneNumberVerificationService,
          this.loginInfoService, 'phoneNumber')]
      ],
      selectedPhoneNumber: ['', []]
      });

    this.passwordFormGroup = this.fb.group({
      password: ['', Validators.required]
    });

    // [ AsyncTwoFactorCodeVerificationValidator(this.userService, this.loginInfoService) ]
    this.twoFactorFormGroup = this.fb.group({
      twoFactorCode: ['', [Validators.required,
                           Validators.minLength(6),
                           Validators.maxLength(8)]
      ]
    });

    const returnUrl = 'returnUrl';
    this.returnUrl = this.activatedRoute.snapshot.queryParams[returnUrl];

    this.loginInfoSubscription = this.loginInfoService.getLoginInfo().subscribe(data => {

      const loginInfo: LoginInfoModel = data;

      console.log(loginInfo);

      if (loginInfo?.twoFactorEnabled) {
        this.isTwoFactorEnabled = loginInfo.twoFactorEnabled;
      }

    });

    this.getPhoneNumberCodes();
    const phoneNumberRegex = /^\+?\d+$/;
    this.emailFormGroup.get('email').valueChanges.subscribe(data => {
      if (data) {
        if (data.toString().length > 2) {
          if (phoneNumberRegex.test(data)) {
            this.isNumber = true;
            this.isNumberAnimateValue = 'active';
          } else {
            this.isNumberAnimateValue = 'inactive';
          }
        } else {
          this.isNumber = false;
          this.isNumberAnimateValue = 'inactive';
        }
      } else {
        this.isNumber = false;
        this.isNumberAnimateValue = 'inactive';
      }
    });

    // this.twoFactorFormGroup.get('twoFactorCode').valueChanges.subscribe(data => {
    //   if (data) {
    //     const inputString: string = data;
    //     if (inputString.length >= 6) {
    //       this.loginWithTwoFactor();
    //     }
    //   } else {
    //
    //   }
    // });

  }

  nextStep() {
    this.validateAllFormFields(this.emailFormGroup);
    if (this.emailFormGroup.valid) {
      this.stepper.next();
    }
  }


  gotoNextPageForPassword() {
    if (this.isTwoFactorEnabled) {
      this.validateAllFormFields(this.passwordFormGroup);
      if (this.passwordFormGroup.valid) {
        const inputData = {
          email: this.emailFormGroup.get('email').value,
          password: this.passwordFormGroup.get('password').value,
          signUpTypeConstant: 'WEB'
        };
        this.authenticationService.partialLogin(inputData).subscribe((data: ResponseModel) => {
          console.log(data);
          if (data.success){
            this.stepper.next();
          }
        });

      } else {
        this.showFailed('Kindly fill required fields');
      }
    } else {
      this.validateAllFormFields(this.passwordFormGroup);
      if (this.passwordFormGroup.valid) {
        this.login(true);
      }
    }
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }


  login(secondForm: boolean) {
    if (this.passwordFormGroup.valid && secondForm) {
      this.loadingPreloader = true;
      const loginModelData: LoginModel = new LoginModel();
      loginModelData.email =  this.emailFormGroup.get('email').value;
      loginModelData.password = this.passwordFormGroup.get('password').value;
      this.authenticationService.login(loginModelData).subscribe((loginDataResponse: ResponseModel) => {
        this.authenticationService.me().subscribe(value => {

          this.loginInfoSubscription.unsubscribe();
          this.loadingPreloader = false;
          if (value) {
            const responseModel: ResponseModel = value;
            console.log(responseModel);
            // this.successMessage(this.serverResponseObject.message);
            const portalUser: PortalUserModel = responseModel.data;

            this.authenticationService.setUserInfo(value);

            const result = this.checkUserRoles(this.checkIfAdmin(portalUser));

            console.log(this.returnUrl);
            if (this.returnUrl) {
              this.redirect(this.returnUrl);
            } else if (result === PortalAccountTypeConstant.LAB.toString()) {
              this.redirect('/dashboard/lab');
              // this.router.navigate(['/admin']);
            } else if (result === PortalAccountTypeConstant.PATIENT.toString()) {
              this.redirect('/dashboard/patient/main');
              // this.router.navigateByUrl('/dashboard/patient');
            }
            // this._router.navigate(['/dashboard']);
          }
        }, error1 => {
          this.loadingPreloader = false;
          this.showFailed('Login failed, invalid email or password');
        });
      }, error => {
        this.loadingPreloader = false;
        console.log(error);
        this.showFailed(error.error.message);
      });

    } else {
      this.loadingPreloader = false;
      this.showFailed('Login failed, email or password required');
    }
  }


  loginWithTwoFactor() {
    if (this.twoFactorFormGroup.valid) {
      const loginModelData: LoginModel = new LoginModel();
      loginModelData.email =  this.emailFormGroup.get('email').value;
      loginModelData.password = this.passwordFormGroup.get('password').value;
      loginModelData.signUpTypeConstant = 'WEB';
      loginModelData.twoFactorCode = this.twoFactorFormGroup.get('twoFactorCode').value;

      this.authenticationService.login(loginModelData).subscribe((loginDataResponse: ResponseModel) => {
        this.authenticationService.me().subscribe(value => {

          this.loginInfoSubscription.unsubscribe();
          this.loadingPreloader = false;
          if (value) {
            const responseModel: ResponseModel = value;
            console.log(responseModel);
            // this.successMessage(this.serverResponseObject.message);
            const portalUser: PortalUserModel = responseModel.data;

            this.authenticationService.setUserInfo(value);

            const result = this.checkUserRoles(this.checkIfAdmin(portalUser));
            if (this.returnUrl) {
              this.redirect(this.returnUrl);
            } else if (result === PortalAccountTypeConstant.LAB.toString()) {
              this.redirect('/dashboard/lab');
              // this.router.navigate(['/admin']);
            } else if (result === PortalAccountTypeConstant.PATIENT.toString()) {
              this.redirect('/dashboard/patient/main');
              // this.router.navigateByUrl('/dashboard/patient');
            }
            // this._router.navigate(['/dashboard']);
          }
        }, error1 => {
          this.loadingPreloader = false;
          this.showFailed('Login failed, invalid email or password');
        });
      }, error => {
        this.loadingPreloader = false;
        console.log(error);
        this.showFailed(error.error.message);
      });

    } else {
      this.showFailed('Login failed, email or password required');
    }
  }

  getPhoneNumberCodes() {
    this.loadingPageData = true;
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {

      this.phoneNumberCodesList = data;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.emailFormGroup.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }

  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.emailFormGroup.get(formName).value) {

    } else {
      this.emailFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.emailFormGroup.get(selectedFormName).setValue(result);

        if (this.emailFormGroup.get(formName).value) {
          this.emailFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
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

  getLocalCountryImageUrl(b: string) {
    if (b) {
      return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
    }
    return '';
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  checkUserRoles(input) {
    const result = input.roleName.filter(value => value === UserRoleTypeConstant.SUPER_ADMIN || UserRoleTypeConstant.ADMIN);
    return input.portalAccountTypeConstant;
  }

  checkIfAdmin(portalUser: PortalUserModel) {
    let userData: any;
    const result = portalUser.portalAccountDescriptionDtoList.filter(value => {
      if (value.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
        userData = value;
      } else if (value.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
        userData = value;
      }
    });
    if (userData) {
      return userData;
    }
    return null;
  }
}
