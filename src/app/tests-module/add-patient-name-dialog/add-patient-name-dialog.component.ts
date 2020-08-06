import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PhoneNumberValidator} from '../../validator/phonenumber.validator';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PhoneNumberDialogComponent} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {AuthenticationService} from '../../service/authentication-service';
import {PhoneNumberCodeService} from '../../service/phone_number_service';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

interface DialogData {
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  selectedPhoneNumber: string;
  fileNumber: string;
}

@Component({
  selector: 'app-add-patient-name-dialog',
  templateUrl: './add-patient-name-dialog.component.html',
  styleUrls: ['./add-patient-name-dialog.component.css']
})
export class AddPatientNameDialogComponent implements OnInit {

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

  addPatientInfo() {
    this.validateAllFormFields(this.addPatientFormGroup);
    if (this.addPatientFormGroup.valid) {
      this.dialogRef.close(this.addPatientFormGroup.getRawValue());
      // console.log(this.addPatientFormGroup.getRawValue());
    } else {
      this.showFailed('Kindly fill all the required fields');
    }
  }


  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }
}
