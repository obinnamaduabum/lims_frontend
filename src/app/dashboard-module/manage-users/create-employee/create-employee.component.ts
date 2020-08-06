import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../../models/phone-number-codes-model';
import {MatDialog} from '@angular/material/dialog';
import {PhoneNumberCodeService} from '../../../service/phone_number_service';
import {EmailNotAlreadyTakenValidator} from '../../../validator/asyn_validator/email.validator';
import {PhoneNumberAsynValidator} from '../../../validator/asyn_validator/phone.asynvalidator';
import {PhoneNumberValidator} from '../../../validator/phonenumber.validator';
import {PhoneNumberDialogComponent} from '../../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {ResponseModel} from '../../../models/response-model';
import {UserService} from '../../../service/user.service';
import {PhoneNumberVerificationService} from '../../../service/phone-number-verification';
import {RoleService} from '../../../service/role.service';
import {EmployeeService} from '../../../service/employee.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  createEmployeeForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  phoneNumberCodesList: PhoneNumberCodes[];
  filteredCountries: PhoneNumberCodes[] = [];
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  loadingPageData = true;
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  listOfRoles: any[] = [];
  fetchingRoles = true;
  creatingEmployee = false;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private userService: UserService,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private roleService: RoleService,
              private employeeService: EmployeeService,
              private toastService: ToastrService) {}

  ngOnInit() {
    this.roleService.fetchAllRoles().subscribe(data => {
      this.fetchingRoles = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        console.log(responseModel.data);
        this.listOfRoles = responseModel.data;
      }
    }, error1 => {
      // this.fetchingRoles = false;
    });

    this.createEmployeeForm = this.fb.group({

      email: ['', [Validators.required, Validators.pattern(this.emailFormat)], [EmailNotAlreadyTakenValidator(this.userService)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      otherName: ['', []],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator('phoneNumber')],
        [PhoneNumberAsynValidator(this.phoneNumberVerificationService, 'phoneNumber').bind(this)]],
      selectedPhoneNumber: ['', []],
      otherPhoneNumber: ['', [PhoneNumberValidator('otherPhoneNumber')]],
      selectedOtherPhoneNumber: ['', []],
      roles: ['', [Validators.required]],
    });
    this.getPhoneNumberCodes();
  }


  getPhoneNumberCodes() {
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {
      this.phoneNumberCodesList = data;
      this.filteredCountries = this.phoneNumberCodesList;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.createEmployeeForm.get('selectedPhoneNumber').setValue(array[i]);
          this.createEmployeeForm.get('selectedOtherPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }

  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.createEmployeeForm.get(formName).value) {

    } else {
      this.createEmployeeForm.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.createEmployeeForm.get(selectedFormName).setValue(result);

        if (this.createEmployeeForm.get(formName).value) {
          this.createEmployeeForm.get(formName).updateValueAndValidity();
        }
      }
    });
  }

  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
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

  registerEmployee() {

    this.validateAllFormFields(this.createEmployeeForm);
    if (this.createEmployeeForm.valid) {
      this.creatingEmployee = true;
      this.employeeService.create(this.createEmployeeForm.getRawValue()).subscribe(data => {
        this.creatingEmployee = false;
        console.log(data);
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        this.creatingEmployee = false;
      });
    } else {
      this.showFailed('Kindly fill all required fields');
    }
  }


  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

}
