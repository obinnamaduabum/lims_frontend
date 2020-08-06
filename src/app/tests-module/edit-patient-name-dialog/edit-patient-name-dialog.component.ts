import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {PhoneNumberDialogComponent} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {PhoneNumberValidator} from '../../validator/phonenumber.validator';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication-service';
import {PhoneNumberCodeService} from '../../service/phone_number_service';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TestModel} from '../../models/test-model';


interface DialogData {
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  selectedPhoneNumber: string;
  fileNumber: string;
}

@Component({
  selector: 'app-edit-patient-name-dialog',
  templateUrl: './edit-patient-name-dialog.component.html',
  styleUrls: ['./edit-patient-name-dialog.component.css']
})
export class EditPatientNameDialogComponent implements OnInit {

  addPatientFormGroup: FormGroup;
  matcher = new MyErrorStateMatcher();
  checkingEmailValidity = false;
  signUpFormGroup: FormGroup;
  signUpFormGroupStepTwo: FormGroup;
  loadingPageData = true;
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  phoneNumberCodesList: PhoneNumberCodes[];
  filteredCountries: PhoneNumberCodes[] = [];
  isLinear = true;
  loadingStepTwo = false;


  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private userService: UserService,
              private toastService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<PhoneNumberDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
    this.addPatientFormGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      otherName: ['', []],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator('phoneNumber')]],
      selectedPhoneNumber: ['', []],
      fileNumber: ['', []],
    });
    this.getPhoneNumberCodes();
    console.log('shit cum');
    console.log(this.data);
    this.patchData(this.data);
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

  patchData(value: any) {
    const data = value.testModel;

    console.log(data);
    if (data.firstName || data.selectedPhoneNumber) {
      console.log('patch');
      console.log(data.firstName);
      console.log(data.lastName);
      this.addPatientFormGroup.patchValue(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          otherName: data.otherName,
          fileNumber: data.fileNumber
        }
      );

      const array = this.phoneNumberCodesList.filter(phoneNumberObj =>
        phoneNumberObj.alpha2.toLowerCase().includes(data.selectedPhoneNumber.alpha2.toLowerCase())
      );

      // console.log(array);
      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.addPatientFormGroup.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
    }
  }

  getPhoneNumberCodes() {
    this.loadingPageData = true;
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {

      this.phoneNumberCodesList = data;
      // console.log(this.phoneNumberCodesList);
      this.filteredCountries = this.phoneNumberCodesList;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      // console.log(array);
      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.addPatientFormGroup.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }


  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    console.log(formName);
    if (this.addPatientFormGroup.get(formName).value) {

    } else {
      this.addPatientFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.addPatientFormGroup.get(selectedFormName).setValue(result);
        if (this.addPatientFormGroup.get(formName).value) {
          this.addPatientFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
  }

  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
  }

  editPatientInfo() {
    this.validateAllFormFields(this.addPatientFormGroup);
    if (this.addPatientFormGroup.valid) {
      const testModel: TestModel = this.addPatientFormGroup.getRawValue();
      testModel.isInValid = false;
      this.dialogRef.close(testModel);
      // console.log(this.addPatientFormGroup.getRawValue());
    } else {
      this.showFailed('Kindly fill all the required fields');
    }
  }


  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

}
