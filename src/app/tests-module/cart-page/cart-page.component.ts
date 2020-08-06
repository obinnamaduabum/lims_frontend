import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PhoneNumberValidator} from '../../validator/phonenumber.validator';
import {PhoneNumberDialogComponent} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue-component';
import {ToastrService} from 'ngx-toastr';
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
import {AdminSettingsService} from '../../service/admin-settings-service';
import {ResponseModel} from '../../models/response-model';
import {CookieService} from 'ngx-cookie-service';
import {PaymentInfoModel} from '../../payment-module/model/payment.info.model';
import {PaymentInfoService} from '../../service/payment.info.service';
import {AuthenticationService} from '../../service/authentication-service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  itemsInCart: TestModel[] = [];
  grandTotal = 0.00;
  doctorFormGroup: FormGroup;
  imagePath = '../assets/country/svg/';
  imageExtension = '.svg';
  matcher = new MyErrorStateMatcher();
  phoneNumberCodesList: PhoneNumberCodes[];
  loadingPageData = true;
  adminSettingsModel: AdminSettingsModel;
  isUserLoggedIn = false;



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
              private authentication: AuthenticationService,
              private paymentInfoService: PaymentInfoService) {}

  ngOnInit() {

    this.adminSettingsService.getPublicAllAdminSettings().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.adminSettingsModel = responseModel.data;
        console.log(this.adminSettingsModel);
      }
    }, error1 => {});

    this.myCookieService.getShoppingCartList().subscribe(data => {
      this.itemsInCart = data;
      this.calculateGrandTotal();
    }, error1 => {
    });
    // this.getPhoneNumberCodes();
    this.patch();

    this.authentication.fetchUser().subscribe((data) => {
      console.log(data);
      this.isUserLoggedIn = true;
    }, error1 => {
      this.isUserLoggedIn = false;
      console.log(error1);
    });
  }

  patch() {
    const result = localStorage.getItem('referred_by');
    if (result) {
      const parsed = JSON.parse(result);
     // console.log(parsed);
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

    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login']);
    }

    const paymentInfoModel = new PaymentInfoModel();
    paymentInfoModel.amount = '' + this.grandTotal;
    paymentInfoModel.currency = this.adminSettingsModel.currencyType;
    this.paymentInfoService.setPaymentInfo(paymentInfoModel);
    this.checkIfLoggedIn();
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
