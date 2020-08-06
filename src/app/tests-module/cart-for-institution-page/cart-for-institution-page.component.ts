import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PhoneNumberValidator} from '../../validator/phonenumber.validator';
import {PhoneNumberDialogComponent} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {EditPatientNameDialogComponent} from '../edit-patient-name-dialog/edit-patient-name-dialog.component';
import {TestModel} from '../../models/test-model';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../models/phone-number-codes-model';
import {AdminSettingsModel} from '../../models/admin-settings-model';
import {MyCookieService} from '../../service/mycookieservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {UserService} from '../../service/user.service';
import {PhoneNumberCodeService} from '../../service/phone_number_service';
import {MatDialog} from '@angular/material/dialog';
import {ResponseModel} from '../../models/response-model';
import {AdminSettingsService} from '../../service/admin-settings-service';
import {CookieService} from 'ngx-cookie-service';
import {PaymentInfoService} from '../../service/payment.info.service';
import {PaymentInfoModel} from '../../payment-module/model/payment.info.model';

@Component({
  selector: 'app-cart-for-institution-page',
  templateUrl: './cart-for-institution-page.component.html',
  styleUrls: ['./cart-for-institution-page.component.css']
})
export class CartForInstitutionPageComponent implements OnInit {

  itemsInCart: TestModel[] = [];
  grandTotal = 0.00;
  doctorFormGroup: FormGroup;
  emailFormat = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  matcher = new MyErrorStateMatcher();
  phoneNumberCodesList: PhoneNumberCodes[];
  loadingPageData = true;
  adminSettingsModel: AdminSettingsModel;

  constructor(private myCookieService: MyCookieService,
              private snackBar: MatSnackBar,
              private router: Router,
              private fb: FormBuilder,
              private phoneNumberVerificationService: PhoneNumberVerificationService,
              private userService: UserService,
              private phoneNumberCodeService: PhoneNumberCodeService,
              private dialog: MatDialog,
              private toastService: ToastrService,
              private cookieService: CookieService,
              private adminSettingsService: AdminSettingsService,
              private paymentInfoService: PaymentInfoService) {}

  ngOnInit() {

    this.adminSettingsService.getPublicAllAdminSettings().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.adminSettingsModel = responseModel.data;
        console.log(this.adminSettingsModel);
      }
    }, error1 => {});
    this.doctorForm();
    this.getPhoneNumberCodes();
    this.myCookieService.getShoppingCartList().subscribe(data => {
      this.itemsInCart = data;
      this.rearrange(data);
      this.calculateGrandTotal();
    }, error1 => {
    });
    this.patch();
    this.checkIfPatientInfoExists();
  }
  rearrange(array: TestModel[]) {
    let i;
    for (i = 0; i < array.length; i++) {
      if (array[i].quantity > 1) {
        const quantity = array[i].quantity;
        console.log(quantity);
        let q;
        for (q = 0; q < quantity; q++) {
          const item = array[i];
          item.quantity = 1;
          item.randomCode = Math.random().toString(36).replace('0.', '');
          console.log(item.randomCode);
          // this.itemsInCart.push(item);
          this.myCookieService.setShoppingCartDataForInstitution(item);
        }
        this.myCookieService.removeItem(array[i]);
      }
    }
  }

  patch() {
    const result = localStorage.getItem('referred_by');
    if (result) {
      const parsed = JSON.parse(result);
      console.log(parsed);

      this.doctorFormGroup.patchValue({
        email: parsed.email,
        address: parsed.address,
        fullName: parsed.fullName,
        selectedPhoneNumber: parsed.selectedPhoneNumber,
        selectedOtherPhoneNumber: parsed.selectedOtherPhoneNumber,
        phoneNumber: parsed.phoneNumber,
        otherPhoneNumber: parsed.otherPhoneNumber
      });
    }
  }

  doctorForm() {

    this.doctorFormGroup = this.fb.group({
      email: ['', [Validators.pattern(this.emailFormat)]],
      fullName: ['', []],
      phoneNumber: ['', [PhoneNumberValidator('phoneNumber')]],
      selectedPhoneNumber: ['', []],
      otherPhoneNumber: ['', [PhoneNumberValidator('otherPhoneNumber')]],
      selectedOtherPhoneNumber: ['', []],
      address: ['', []]
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


  getPhoneNumberCodes() {
    this.loadingPageData = true;
    this.phoneNumberCodeService.getListOfPhoneCodes().subscribe(data => {
      this.phoneNumberCodesList = data;
      const array = this.phoneNumberCodesList.filter(value =>
        value.alpha2.toLowerCase().includes('ng')
      );

      for (let i = 0; i < array.length; i++) {
        if (i < 1) {
          this.doctorFormGroup.get('selectedPhoneNumber').setValue(array[i]);
          this.doctorFormGroup.get('selectedOtherPhoneNumber').setValue(array[i]);
        }
      }
      this.loadingPageData = false;
    }, error2 => {
    });
  }

  getLocalCountryImageUrl(b: string) {
    return this.imagePath + b.toLocaleLowerCase() + this.imageExtension;
  }


  openPhoneNumberDialog(formName: string, selectedFormName: string) {

    if (this.doctorFormGroup.get(formName).value) {

    } else {
      this.doctorFormGroup.get(formName).setErrors(null);
    }

    const dialogRef = this.dialog.open(PhoneNumberDialogComponent, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {
        this.doctorFormGroup.get(selectedFormName).setValue(result);

        if (this.doctorFormGroup.get(formName).value) {
          this.doctorFormGroup.get(formName).updateValueAndValidity();
        }
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      panelClass: ['red-snackbar']
    });
  }


  removeItem(test: TestModel) {
    this.myCookieService.removeItem(test);
    this.openSnackBar('Item Removed', '');
  }

  increaseQuantity(test: TestModel) {
    this.myCookieService.increaseItemQuantity(test);
  }

  reduceQuantity(test: TestModel) {
    if (test.quantity > 1) {
      this.myCookieService.decreaseItemQuantity(test);
    }
  }

  calculateGrandTotal() {
    this.grandTotal = 0.00;
    let i;
    for (i = 0; i < this.itemsInCart.length; i++) {
      this.grandTotal += this.itemsInCart[i].total;
    }
    return this.grandTotal;
  }
  checkOut() {
    this.validateAllFormFields(this.doctorFormGroup);
    if (this.doctorFormGroup.valid) {
      if (!this.checkIfPatientInfoExists()) {

        const json = JSON.stringify(this.doctorFormGroup.getRawValue());
        localStorage.setItem('referred_by', json);
        // this.cookieService.set('referred_by', json, 1);
        const paymentInfoModel = new PaymentInfoModel();
        paymentInfoModel.amount = '' + this.grandTotal;
        paymentInfoModel.currency = this.adminSettingsModel.currencyType;
        this.paymentInfoService.setPaymentInfo(paymentInfoModel);
        this.checkIfLoggedIn();
      } else {
        this.scrollToTop();
        this.showFailed('Kindly enter patient information');
      }
    } else {
      this.showFailed('Kindly fill all required fields');
    }
  }
  checkIfPatientInfoExists() {
    let i;
    let anErrorOccurred: boolean;
    for (i = 0; i < this.itemsInCart.length; i++) {
      const item = this.itemsInCart[i];
      if (!this.itemsInCart[i].firstName) {
        item.isInValid = true;
        anErrorOccurred = true;
      }
      // if (item.isInValid) {
      //
      // }
      // this.itemsInCart.push();
      // this.grandTotal += this.itemsInCart[i].total;
    }
    return anErrorOccurred;
  }
  checkIfLoggedIn() {
    this.router.navigate(['/dashboard/institution/check-out/payment']);
  }

  showSuccess(message: string) {
    this.toastService.success(message , 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  editPatientInfo(testModel: TestModel) {
    console.log(testModel);
    this.openEditPatientInfo(testModel);
  }


  openEditPatientInfo(testModel: TestModel) {

    const dialogRef = this.dialog.open(EditPatientNameDialogComponent, {
      width: '550px',
      data: {testModel},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result instanceof Object) {

        // this.myCookieService.removeItemForInstitution(testModel);
        console.log('open edit');
        console.log(result);
        testModel.selectedPhoneNumber = result.selectedPhoneNumber;
        testModel.fileNumber = result.fileNumber;
        testModel.firstName = result.firstName;
        testModel.lastName = result.lastName;
        testModel.otherName = result.otherName;
        testModel.phoneNumber = result.phoneNumber;
        testModel.isInValid = result.isInvalid;

        console.log('testModel');
        console.log(testModel);
        this.myCookieService.updateShoppingCartDataForInstitution(testModel);
        // this.doctorFormGroup.get(selectedFormName).setValue(result);
        //
        // if (this.doctorFormGroup.get(formName).value) {
        //   this.doctorFormGroup.get(formName).updateValueAndValidity();
        // }
      }
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }

}
