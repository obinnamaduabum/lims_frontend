import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../../models/phone-number-codes-model';
import {PortalUserModel} from '../../../models/portal-user-model';
import {PhoneNumberCodeService} from '../../../service/phone_number_service';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../service/user.service';
import {PasswordMatchValidator} from '../../../validator/password.validator';
import {PhoneNumberValidator} from '../../../validator/phonenumber.validator';
import {ResponseModel} from '../../../models/response-model';
import {PhoneNumberDialogComponent} from '../../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';


@Component({
  selector: 'app-update-user-account',
  templateUrl: './update-user-account.component.html',
  styleUrls: ['./update-user-account.component.css']
})
export class UpdateUserAccountComponent implements OnInit {

  editProfileFormGroup: FormGroup;
  matcher = new MyErrorStateMatcher();
  loadingPageData = true;
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  phoneNumberCodesList: PhoneNumberCodes[];
  filteredCountries: PhoneNumberCodes[] = [];
  portalUserModel: PortalUserModel;
  constructor(private fb: FormBuilder,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private dialog: MatDialog,
              private userService: UserService) { }

  ngOnInit() {
    this.editProfileFormGroup = this.fb.group({
      email: ['', []],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      otherName: ['', []],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, PasswordMatchValidator]],
      phoneNumber: ['', []],
      selectedPhoneNumber: ['', []],
      otherPhoneNumber: ['', [PhoneNumberValidator('otherPhoneNumber')]],
      selectedOtherPhoneNumber: ['', []],
      nextOfKinSelectedPhoneNumber: ['', [] ]
    });

    this.getPhoneNumberCodes();
    this.fetchPortalUser();
  }
  patchPortalUser() {
    console.log(this.portalUserModel);
    if (this.portalUserModel.phoneNumberObj) {
      const array = this.phoneNumberCodesList.filter(value =>
        value.internationalPhoneNumber.toLowerCase().includes(this.portalUserModel.phoneNumberObj.countryCode)
      );
      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.editProfileFormGroup.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
    }
    this.editProfileFormGroup.patchValue({
      email: this.portalUserModel.email,
      firstName: this.portalUserModel.firstName,
      lastName: this.portalUserModel.lastName,
      otherName: this.portalUserModel.otherName,
      phoneNumber: this.portalUserModel.phoneNumberObj.nationalNumber
    });
  }
  fetchPortalUser() {
    this.userService.fetchPortalUser().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.portalUserModel = responseModel.data;
        this.patchPortalUser();
        // console.log(this.portalUserModel);
      } else {
      }
    }, error1 => {});
  }

  getPhoneNumberCodes() {
    this.loadingPageData = true;
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {

      this.phoneNumberCodesList = data;
      this.filteredCountries = this.phoneNumberCodesList;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          // this.editProfileFormGroup.get('nextOfKinSelectedPhoneNumber').setValue(array[i]);
          this.editProfileFormGroup.get('selectedPhoneNumber').setValue(array[i]);
          this.editProfileFormGroup.get('selectedOtherPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
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



  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.editProfileFormGroup.get(formName).value) {

    } else {
      this.editProfileFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.editProfileFormGroup.get(selectedFormName).setValue(result);

        if (this.editProfileFormGroup.get(formName).value) {
          this.editProfileFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
  }

  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
  }


  openPhoneNumberDialogStepTwo(formName: string, selectedFormName: string) {

    if (this.editProfileFormGroup.get(formName).value) {

    } else {
      this.editProfileFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.editProfileFormGroup.get(selectedFormName).setValue(result);

        if (this.editProfileFormGroup.get(formName).value) {
          this.editProfileFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
  }

}
