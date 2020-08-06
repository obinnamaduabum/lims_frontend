import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PhoneNumberDialogComponent} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {PhoneNumberValidator} from '../../validator/phonenumber.validator';
import {PhoneNumberAsynValidator} from '../../validator/asyn_validator/phone.asynvalidator';
import {PasswordMatchValidator} from '../../validator/password.validator';
import {RegistrationSuccessfulComponent} from '../registration-successful/registration-successful.component';
import {RegistrationSuccessfulWithStepsComponent} from '../registration-successful-with-steps/registration-successful-with-steps.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {PhoneNumberCodeService} from '../../service/phone_number_service';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {UserService} from '../../service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {PatientModel} from '../../models/patient-model';
import {GenderModel} from '../../models/gender.model';
import {AuthenticationService} from '../../service/authentication-service';
import {PatientService} from '../../service/patient.service';
import {ResponseModel} from '../../models/response-model';
import {PhoneNumberModel} from '../../models/phone-number-model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    ]
})
export class PatientRegistrationComponent implements OnInit {

  checkingEmailValidity = false;
  signUpFormGroup: FormGroup;
  signUpFormGroupStepTwo: FormGroup;
  patientModel: PatientModel = new PatientModel();
  showPassword = false;
  showConfirmPassword = false;
  loadingPreloader = false;
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  matcher = new MyErrorStateMatcher();
  loadingPageData = true;
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  phoneNumberCodesList: PhoneNumberCodes[];
  maxDate: any;
  genderArray: GenderModel[] = [
    {value: 'MALE', viewValue: 'Male'},
    {value: 'FEMALE', viewValue: 'Female'},
    {value: 'OTHERS', viewValue: 'Others'}
  ];
  filteredCountries: PhoneNumberCodes[] = [];
  isLinear = true;
  loadingStepTwo = false;
  public barLabel = 'Password strength:';
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];
  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private userService: UserService,
              private toastService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private patientService: PatientService) {
  }

  ngOnInit() {

    this.signUpForm();
    this.getPhoneNumberCodes();
    this.maxDate = new Date();
    this.signUpFormGroup.get('password').valueChanges.subscribe(data => {
      this.signUpFormGroup.get('confirmPassword').setValue('');
    });

    this.signUpFormGroupStepTwo.get('countryFiltered').valueChanges.subscribe(data => {

      const searchName = data;

      if (searchName) {
        this.filteredCountries = this.phoneNumberCodesList.filter(value =>
          (value.name.toLowerCase().includes(searchName.toString().toLowerCase()))
        );
      } else {
        this.filteredCountries = this.phoneNumberCodesList;
      }
    });
    this.signUpFormGroup.get('email').valueChanges.subscribe(value => {
      if (this.validateEmailPattern(value)) {
        console.log('valid');
        this.checkingEmailValidity = true;
        this.userService.checkIfUserEmailExists(value).subscribe(data => {
          const responseModel: ResponseModel = data;
          // console.log(responseModel);
          this.checkingEmailValidity = false;
          if (responseModel.success) {
            this.signUpFormGroup.get('email').setErrors({emailDoesExist: true});
          } else {
            this.signUpFormGroup.get('email').setErrors(null);
          }
        }, error1 => {
          this.signUpFormGroup.get('email').setErrors(null);
        });
      } else {
        console.log('invalid');
      }
    });
  }

  validateEmailPattern(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  signUpForm() {

    this.signUpFormGroup = this.fb.group({
      email: ['', [Validators.pattern(this.emailFormat)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      otherName: ['', []],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, PasswordMatchValidator]],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator('phoneNumber')],
        [PhoneNumberAsynValidator(this.phoneNumberVerificationService, 'phoneNumber').bind(this)]],
      selectedPhoneNumber: ['', []],
      otherPhoneNumber: ['', [PhoneNumberValidator('otherPhoneNumber')]],
      selectedOtherPhoneNumber: ['', []]
    });


    this.signUpFormGroupStepTwo = this.fb.group({
      twoFactor: ['', []],
      dob: ['', [
        Validators.required
      ]],
      gender: ['', [
        Validators.required]
      ],
      address: ['', [
        Validators.required
      ]],
      countryFiltered: ['', []],
      country: ['', [
        Validators.required
      ]],
      nextOfKinFirstName: ['', [
        Validators.required
      ]],
      nextOfKinLastName: ['', [
        Validators.required
      ]],
      nextOfKinSelectedPhoneNumber: ['', []],
      nextOfKinPhoneNumber: ['', [
        Validators.required, PhoneNumberValidator('nextOfKinPhoneNumber')]]
    });
  }

  getPhoneNumberCodes() {
    this.loadingPageData = true;
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {

      this.phoneNumberCodesList = data;
      this.filteredCountries = this.phoneNumberCodesList;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      console.log(array);

      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.signUpFormGroupStepTwo.get('nextOfKinSelectedPhoneNumber').setValue(array[i]);
          this.signUpFormGroup.get('selectedPhoneNumber').setValue(array[i]);
          this.signUpFormGroup.get('selectedOtherPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }

  toggleShowPassword(formControlName: string) {
    if (formControlName === 'password') {
      this.showPassword = !this.showPassword;
    } else if (formControlName === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
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


  findInvalidControls(formGroup: FormGroup) {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.signUpFormGroup.get(formName).value) {

    } else {
      this.signUpFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.signUpFormGroup.get(selectedFormName).setValue(result);

        if (this.signUpFormGroup.get(formName).value) {
          this.signUpFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
  }


  getLocalCountryImageUrl(b: string) {

    if (b) {
      return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
    }

    return '';

  }


  openPhoneNumberDialogStepTwo(formName: string, selectedFormName: string) {

    if (this.signUpFormGroupStepTwo.get(formName).value) {

    } else {
      this.signUpFormGroupStepTwo.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.signUpFormGroupStepTwo.get(selectedFormName).setValue(result);

        if (this.signUpFormGroupStepTwo.get(formName).value) {
          this.signUpFormGroupStepTwo.get(formName).updateValueAndValidity();
        }
      }
    });
  }


  gotoStep2() {

    //  console.log(this.findInvalidControls(this.signUpFormGroup));

    this.validateAllFormFields(this.signUpFormGroup);

    if (this.signUpFormGroup.valid) {
      this.patientModel.email = this.signUpFormGroup.get('email').value;
      this.patientModel.password = this.signUpFormGroup.get('password').value;
      this.patientModel.firstName = this.signUpFormGroup.get('firstName').value;
      this.patientModel.lastName = this.signUpFormGroup.get('lastName').value;
      this.patientModel.otherName = this.signUpFormGroup.get('otherName').value;
      const selectedPhoneNumber: PhoneNumberCodes = this.signUpFormGroup.get('selectedPhoneNumber').value;
      this.patientModel.phoneNumber = selectedPhoneNumber.internationalPhoneNumber + this.signUpFormGroup.get('phoneNumber').value;
      this.patientModel.phoneNumberObj = this.signUpFormGroup.get('selectedPhoneNumber').value;
      const selectedOtherPhoneNumber: PhoneNumberCodes = this.signUpFormGroup.get('selectedOtherPhoneNumber').value;
      if (this.signUpFormGroup.get('otherPhoneNumber').value) {
        this.patientModel.otherPhoneNumber =
          selectedOtherPhoneNumber.internationalPhoneNumber + this.signUpFormGroup.get('otherPhoneNumber').value;
      }
      this.patientModel.otherPhoneNumberObj = this.signUpFormGroup.get('selectedOtherPhoneNumber').value;
      this.nextStep();
    } else {
      console.log('invalid');
      this.showFailed('Kindly fill all the required fields');
    }
  }


  registerPatient() {
    // console.log(this.findInvalidControls(this.signUpFormGroupStepTwo));
    this.validateAllFormFields(this.signUpFormGroupStepTwo);
    if (this.signUpFormGroupStepTwo.valid) {
      this.loadingPreloader = true;
      this.loadingStepTwo = true;
      this.patientModel.dob = this.signUpFormGroupStepTwo.get('dob').value;
      this.patientModel.gender = this.signUpFormGroupStepTwo.get('gender').value;
      this.patientModel.address = this.signUpFormGroupStepTwo.get('address').value;
      this.patientModel.nextOFKinFirstName = this.signUpFormGroupStepTwo.get('nextOfKinFirstName').value;
      this.patientModel.nextOFKinLastName = this.signUpFormGroupStepTwo.get('nextOfKinLastName').value;
      const nextOfKinSelectedPhoneNumber: PhoneNumberCodes = this.signUpFormGroupStepTwo.get('nextOfKinSelectedPhoneNumber').value;
      this.patientModel.nextOFKinPhoneNumber = nextOfKinSelectedPhoneNumber.internationalPhoneNumber +
        this.signUpFormGroupStepTwo.get('nextOfKinPhoneNumber').value;
      this.patientModel.nextOFKinPhoneNumberObj = this.signUpFormGroupStepTwo.get('nextOfKinSelectedPhoneNumber').value;
      this.patientModel.twoFactor = this.signUpFormGroupStepTwo.get('twoFactor').value;


      console.log(this.patientModel);

      this.patientService.create(this.patientModel).subscribe(data => {
        const responseModel: ResponseModel = data;

        console.log(responseModel);


        if (responseModel.success) {
          const phoneNumberModel: PhoneNumberModel = new PhoneNumberModel();
          const selectedPhoneNumber: PhoneNumberCodes = this.patientModel.phoneNumberObj;
          phoneNumberModel.alpha2 = selectedPhoneNumber.alpha2;
          phoneNumberModel.alpha3 = selectedPhoneNumber.alpha3;
          phoneNumberModel.code = selectedPhoneNumber.alpha2;
          phoneNumberModel.phoneNumber = this.signUpFormGroup.get('phoneNumber').value;
          console.log(phoneNumberModel);
          this.phoneNumberCodeService.verifyPhoneNumberVerification(phoneNumberModel).subscribe(newData => {
            console.log(newData);
            const newResponseModel: ResponseModel = newData;
            this.loadingStepTwo = false;
            if (newResponseModel.success) {
              this.openRegistrationWithStepsDialog(this.patientModel.email, newResponseModel.data.formattedNumber, responseModel.data);
            } else {
              console.log('errorxxxxxx222');
            }
          }, error1 => {
            console.log('error222');
          });
          console.log(responseModel);
        } else {
          // console.log(responseModel);
        }
      }, error1 => {
      });
    } else {
      console.log('invalid');
      this.loadingPreloader = false;
      this.showFailed('Kindly fill all the required fields');
    }
  }

  selectionChange(event: any) {
    if (event.selectedIndex === 2) {
      // this.scrollToTop();
      // this._formWizardService.setStep1Header(false);
      // this._formWizardService.setStep2Header(false);
    }

    if (event.selectedIndex === 1) {
      // this.scrollToTop();
      // console.log('time out');

    }


    if (event.selectedIndex === 3) {
    }
  }


  openRegistrationSuccessfulDialog(userEmail: string) {
    const dialogRef = this.dialog.open(RegistrationSuccessfulComponent, {
      panelClass: 'registration-successful',
      width: '550px',
      disableClose: true,
      data: {
        email: userEmail
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
      }
    });
  }


  openRegistrationWithStepsDialog(userEmail: string, userPhoneNumber: string, twoFactorImage?: string) {

    let base64Image = '';
    if (twoFactorImage) {
      base64Image = twoFactorImage;
    }
    const dialogRef = this.dialog.open(RegistrationSuccessfulWithStepsComponent, {
      panelClass: 'registration-successful',
      width: '550px',
      disableClose: true,
      data: {
        email: userEmail,
        phoneNumber: userPhoneNumber,
        twoFactorImageBase64: base64Image
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
      }
    });
  }

  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  nextStep() {
    // this.validateAllFormFields(this.signUpFormGroup);
    // if (this.signUpFormGroup.valid) {
    this.stepper.next();
    // } else {
    //   this.showFailed('Kindly fill all required feilds');
    // }
  }

  previousStep() {
    this.stepper.previous();
  }
}
