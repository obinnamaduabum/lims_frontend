import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MY_FORMATS} from '../../../signup-module/patient-registration/patient-registration.component';
import {SlideInOutAnimation} from '../../../animations/slidein-out-animation';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../../models/phone-number-codes-model';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../service/user.service';
import {PhoneNumberCodeService} from '../../../service/phone_number_service';
import {RoleService} from '../../../service/role.service';
import {Router} from '@angular/router';
import {ResponseModel} from '../../../models/response-model';
import {PhoneNumberValidator} from '../../../validator/phonenumber.validator';
import {PageEvent} from '@angular/material/paginator';
import {PhoneNumberDialogComponent} from '../../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';


@Component({
  selector: 'app-view-all-users',
  templateUrl: './view-all-users.component.html',
  styleUrls: ['./view-all-users.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
  animations: [SlideInOutAnimation]
})
export class ViewAllUsersComponent implements OnInit {

  searchForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  loadingPageData =  true;
  phoneNumberCodesList: PhoneNumberCodes[];
  filteredCountries: PhoneNumberCodes[] = [];
  animationState = 'out';
  listOfPortalUsers: any[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: any;
  length: any;
  listOfRoles: any[] = [];
  fetchingRoles = true;
  accountTypes: AccountTypes[] = [
    { value: 'ALL', viewValue: 'ALL'},
    { value: 'INSTITUTION', viewValue: 'INSTITUTION'},
    { value: 'LAB', viewValue: 'LAB'},
    { value: 'PATIENT', viewValue: 'PATIENT' }
  ];
  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private userService: UserService,
              private roleService: RoleService,
              private router: Router) { }

  ngOnInit() {

    this.roleService.fetchAllRoles().subscribe(data => {
      this.fetchingRoles = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.listOfRoles = responseModel.data;
        this.fetchListOfUsers();
      }
    }, error1 => {
      // this.fetchingRoles = false;
    });

    this.searchForm = this.fb.group({
      code: ['', []],
      fullName: ['', []],
      phoneNumber: ['', [PhoneNumberValidator('phoneNumber')]],
      startDate: ['', []],
      endDate: ['', []],
      selectedPhoneNumber: ['', []],
      email: ['', []],
      roles: [[], []],
      accountType: ['ALL', []],
    });

    this.getPhoneNumberCodes();


  }

  fetchListOfUsers() {
    this.userService.getAllEmployees(this.searchForm.getRawValue(), 10, 0).subscribe((responseModelx: ResponseModel) => {
      if (responseModelx.success) {
        this.listOfPortalUsers = responseModelx.data.dataList;
        this.length = responseModelx.data.length;
        this.pageSize = responseModelx.data.pageSize;
        console.log('ssss');
        console.log(this.listOfPortalUsers);
      } else {
        this.listOfPortalUsers = [];
        this.length = 0;
        this.pageSize = 0;
      }
    }, error1 => {
      console.log(error1);
    });
  }


  showLessOrMoreToggle() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  clearStartDate() {
    this.searchForm.get('startDate').setValue('');
  }

  clearEndDate() {
    this.searchForm.get('endDate').setValue('');
  }

  search() {
    this.userService.getAllEmployees(this.searchForm.getRawValue(), 10, 0).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.listOfPortalUsers = responseModel.data.dataList;
        this.length = responseModel.data.length;
        this.pageSize = responseModel.data.pageSize;

        console.log(this.listOfPortalUsers);
      } else {
        this.listOfPortalUsers = [];
        this.length = 0;
        this.pageSize = 0;
      }
    }, error1 => {});
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
          this.searchForm.get('selectedPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }

  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.searchForm.get(formName).value) {

    } else {
      this.searchForm.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.searchForm.get(selectedFormName).setValue(result);

        if (this.searchForm.get(formName).value) {
          this.searchForm.get(formName).updateValueAndValidity();
        }
      }
    });
  }

  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
  }

  switchPage(event: PageEvent) {
    this.scrollToTop();
    this.userService.getAllEmployees(this.searchForm.getRawValue(), this.pageSize, event.pageIndex).subscribe(data => {
      console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.listOfPortalUsers = responseModel.data.dataList;
        this.length = responseModel.data.length;
        this.pageSize = responseModel.data.pageSize;
      }
    }, error1 => {});
  }

  scrollToTop() {
    window.scrollTo(0, 0);
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }

  redirectToEdit(id: any, accountType: string) {
    if (accountType === PortalAccountTypeConstant.LAB) {
      this.router.navigate(['/dashboard/lab/manage-users/edit-employee/' + id]);
    } else {
      this.router.navigate(['/dashboard/lab/manage-users/edit-user/' + id]);
    }
  }
}


export interface AccountTypes {
  value: string;
  viewValue: string;
}
