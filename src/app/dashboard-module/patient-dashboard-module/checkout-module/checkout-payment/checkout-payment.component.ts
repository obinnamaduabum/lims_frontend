import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {TestModel} from '../../../../models/test-model';
import {MyErrorStateMatcher} from '../../../../models/my-error-state-matcher';
import {PhoneNumberCodes} from '../../../../models/phone-number-codes-model';
import {AdminSettingsModel} from '../../../../models/admin-settings-model';
import {PaymentInfoModel} from '../../../../payment-module/model/payment.info.model';
import {PaymentTransactionModel} from '../../../../payment-module/model/payment-transaction-model';
import {PortalUserModel} from '../../../../models/portal-user-model';
import {AuthenticationService} from '../../../../service/authentication-service';
import {PaymentInfoService} from '../../../../service/payment.info.service';
import {AdminSettingsService} from '../../../../service/admin-settings-service';
import {PaymentMethodsService} from '../../../../payment-module/service/payment-methods-service';
import {MatDialog} from '@angular/material/dialog';
import {PhoneNumberCodeService} from '../../../../service/phone_number_service';
import {UserService} from '../../../../service/user.service';
import {PhoneNumberVerificationService} from '../../../../service/phone-number-verification';
import {ResponseModel} from '../../../../models/response-model';
import {MyCookieService} from '../../../../service/mycookieservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PhoneNumberValidator} from '../../../../validator/phonenumber.validator';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent implements OnInit {

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
  paymentInfoModel: PaymentInfoModel;
  paymentTransactionModel: PaymentTransactionModel;
  portalUserModel: PortalUserModel;
  transactionRef: string;
  isDoneLoading = false;

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
              private paymentInfoService: PaymentInfoService,
              private authenticationService: AuthenticationService,
              private paymentMethodService: PaymentMethodsService) { }

  ngOnInit() {

    this.authenticationService.checkIfUserIsAlreadyLoggedIn().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.portalUserModel = responseModel.data;
      }
    }, error1 => {});
    this.adminSettingsService.getPublicAllAdminSettings().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.isDoneLoading = true;
        this.adminSettingsModel = responseModel.data;
        this.fetchPaymentTransaction();
      }
    }, error1 => {});
    this.myCookieService.getShoppingCartList().subscribe(data => {
      this.itemsInCart = data;
      this.calculateGrandTotal();
    }, error1 => {});
    this.doctorForm();
    this.getPhoneNumberCodes();
    this.patch();
  }
  fetchPaymentTransaction() {
    this.paymentMethodService.generateTransactionRef().subscribe(data => {
      const responseModel: ResponseModel = data;
     // console.log('responseModel' + this.adminSettingsModel.currencyType);
     // console.log(responseModel);
      if (responseModel.success) {
        this.transactionRef = responseModel.data;
        const paymentTransaction = new PaymentTransactionModel();
        paymentTransaction.amount = '' + this.grandTotal;
        paymentTransaction.currency =  this.adminSettingsModel.currencyType;
        paymentTransaction.email = this.portalUserModel.email;
        paymentTransaction.transactionReference = this.transactionRef;
        this.paymentTransactionModel = paymentTransaction;
        this.paymentInfoService.setPaymentTransaction(this.paymentTransactionModel);
      }
    });
  }
  patch() {
    const result = localStorage.getItem('referred_by');
    if (result) {
      const parsed = JSON.parse(result);
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
      const json = JSON.stringify(this.doctorFormGroup.getRawValue());
      this.cookieService.set('referred_by', json, 0.05);
      this.checkIfLoggedIn();
    } else {
      this.showFailed('Kindly fill all required fields');
    }
  }
  checkIfLoggedIn() {
    this.router.navigate(['/dashboard/patient/check-out/payment']);
  }

  showSuccess(message: string) {
    this.toastService.success(message , 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

}
