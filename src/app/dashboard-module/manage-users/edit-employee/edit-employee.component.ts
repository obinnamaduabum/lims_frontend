import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../../models/phone-number-codes-model';
import {PortalUserModel} from '../../../models/portal-user-model';
import {UserService} from '../../../service/user.service';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDialog} from '@angular/material/dialog';
import {PhoneNumberCodeService} from '../../../service/phone_number_service';
import {PhoneNumberVerificationService} from '../../../service/phone-number-verification';
import {RoleService} from '../../../service/role.service';
import {EmployeeService} from '../../../service/employee.service';
import {MyPubSubService} from '../../../service/mypubsub.service';
import {PhoneNumberDialogComponent} from '../../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {EmailNotAlreadyTakenValidator} from '../../../validator/asyn_validator/email.validator';
import {PhoneNumberValidator} from '../../../validator/phonenumber.validator';
import {ResponseModel} from '../../../models/response-model';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  id: any;
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
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredTopics: Observable<any[]>;
  allTopics: any[] = [];
  userSelectedTopics: any[] = [];
  selectedTopic: any;
  portalUserModel: PortalUserModel;
  subscribingToTopic = false;
  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private userService: UserService,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private roleService: RoleService,
              private employeeService: EmployeeService,
              private toastService: ToastrService,
              private route: ActivatedRoute,
              private myPubSub: MyPubSubService) {

    this.filteredTopics = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((topic: string | null) => topic ? this._filter(topic) : this.allTopics.slice()));
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.roleService.fetchAllRoles().subscribe(data => {
      this.fetchingRoles = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.listOfRoles = responseModel.data;
      }
    }, error1 => {
      // this.fetchingRoles = false;
    });
    this.fetchPortalUser();

    this.createEmployeeForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailFormat)], [EmailNotAlreadyTakenValidator(this.userService)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      employeeId: ['', []],
      otherName: ['', []],
      phoneNumber: ['', [Validators.required, PhoneNumberValidator('phoneNumber')]],
      selectedPhoneNumber: ['', []],
      otherPhoneNumber: ['', [PhoneNumberValidator('otherPhoneNumber')]],
      selectedOtherPhoneNumber: ['', []],
      roles: ['', [Validators.required]],
      accountBlockedByAdmin: ['', []]
    });
    this.getPhoneNumberCodes();
    this.getAllTopic();
    this.getAllTopicSubscribedByUser();
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
      this.employeeService.updateEmployeeInfo(this.createEmployeeForm.getRawValue()).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
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

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {

      // console.log('value: ' + event.value);
      // console.log(!this.matAutocomplete.isOpen);
      // console.log('value: ' + this.selectedTopic);
      const input = event.input;
      const value = event.value;


      // console.log('value: ' + event.value);
      // Add our fruit
      if ((value || '').trim()) {
        this.userSelectedTopics.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string, id: any): void {

    const index = this.getIndex(this.userSelectedTopics, id);
    console.log(fruit + ' ' + id);
    console.log(index);
    if (index >= 0) {
      this.removeTopic(id, index);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.viewValue.toLowerCase());
    if (event.option.viewValue.toLowerCase()) {
      const array = this.allTopics.filter(value =>
        value.name.toLowerCase().includes(event.option.viewValue.toLowerCase())
      );
      let i = 0;
      let selectedTopic;
      for (i; i < array.length; i++) {
        selectedTopic = array[i];
        break;
      }
      this.subscribeToTopic(selectedTopic);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const array = this.allTopics.filter(topic =>
      topic.name.toLowerCase().includes(filterValue)
    );
    return array;
  }

  getAllTopic() {
    this.myPubSub.getAllTopics().subscribe(data => {

      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.allTopics = responseModel.data;
      }
    }, error1 => {
    });
  }

  subscribeToTopic(array: any) {
    // console.log('aray');
    // console.log(array);
    this.subscribingToTopic = true;
    this.myPubSub.userSubscribeToTopic(array.name.toLowerCase().trim(), this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.subscribingToTopic = false;
      if (responseModel.success) {
        this.userSelectedTopics.push(responseModel.data);
        this.showSuccess(responseModel.message);
        // this.allTopics = responseModel.data;
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      this.subscribingToTopic = false;
      this.showFailed(error1.error.message);
    });
  }

  getAllTopicSubscribedByUser() {
    this.myPubSub.getAllUserTopicSubscriptions(this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.userSelectedTopics = responseModel.data;
      }
    }, error1 => {
    });
  }

  // user update
  patchPortalUser() {
    console.log(this.portalUserModel);
    if (this.portalUserModel.phoneNumberObj) {
      const array = this.phoneNumberCodesList.filter(value =>
        value.internationalPhoneNumber.toLowerCase().includes(this.portalUserModel.phoneNumberObj.countryCode)
      );
      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.createEmployeeForm.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
    }

    this.createEmployeeForm.patchValue({
      employeeId: this.id,
      email: this.portalUserModel.email,
      firstName: this.portalUserModel.firstName,
      lastName: this.portalUserModel.lastName,
      otherName: this.portalUserModel.otherName,
      phoneNumber: this.portalUserModel.phoneNumber,
      roles: this.portalUserModel.roles,
      accountBlockedByAdmin: this.portalUserModel.accountBlockedByAdmin
    });
  }

  fetchPortalUser() {
    this.employeeService.getEmployeeInfoToUpdate(this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.portalUserModel = responseModel.data;
        // console.log('portalUserModel');
        // console.log(this.portalUserModel);
        this.patchPortalUser();

      } else {
      }
    }, error1 => {
    });
  }


  removeTopic(id: any, index: any) {
    console.log(id + ' ' + index);
    this.subscribingToTopic = true;
    this.myPubSub.userUnSubscribeToTopic(id, this.id).subscribe(data => {
      this.subscribingToTopic = false;
      console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.userSelectedTopics.splice(index, 1);
        this.getAllTopic();
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      this.subscribingToTopic = false;
      this.showFailed(error1.error.message);
    });
  }


  getIndex(topics: any[], id: string) {
    return topics.findIndex(item => item.id === id);
  }
}
