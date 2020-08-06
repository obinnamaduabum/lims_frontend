import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaymentMethodType} from '../../lh-enum/payment-method-type';
import {PaymentTransactionModel} from '../model/payment-transaction-model';
import {TransactionTypeConstant} from '../payment-enum/transaction-status-type';
import {Router} from '@angular/router';
import {PaymentMethodModel} from '../model/payment-method-model';
import {PaymentMethodsService} from '../service/payment-methods-service';
import {ToastrService} from 'ngx-toastr';
import {TestModel} from '../../models/test-model';
import {ResponseModel} from '../../models/response-model';
import {MyCookieService} from '../../service/mycookieservice.service';
import {ScriptService} from '../../service/script-service';
import {PaymentInfoService} from '../../service/payment.info.service';
import {OrderDetails} from '../model/order-details-model';
import {MainPaymentTransactionModel} from '../../models/payment-transaction-model';
import {PaymentTransAndReferredByDoesNotExistModel} from '../../models/payment-trans-and-referred-by-does-model';


@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {

  @Input('paymentInfoModel') paymentInfoModel: PaymentMethodModel;
  // @Input('paymentTransactionModel') paymentTransactionModel: PaymentTransactionModel;
  @Input('itemsInCart') itemsInCart: TestModel[] = [];
  publicApiKey: string;
  paymentMethodList: PaymentMethodModel[] = [];
  flutterWavePaymentMethod: PaymentMethodModel;
  paymentMethodEnum: any = PaymentMethodType;
  loading = true;
  transactionType: string;
  paymentMethod: string;
  @Output() emitter: EventEmitter<any[]> = new EventEmitter();
  showSuccess: boolean;
  paymentTransactionModel: PaymentTransactionModel;
  payingWithCash = false;

  constructor(private scriptService: ScriptService,
              private paymentMethodsService: PaymentMethodsService,
              private toastService: ToastrService,
              private paymentInfoService: PaymentInfoService,
              private router: Router,
              private myCookieService: MyCookieService) {}

  ngOnInit() {
    this.getAllPaymentMethods();
  }

  fetchPaymentTransaction() {
    this.paymentInfoService.getPaymentTransaction().subscribe(data => {
      this.paymentTransactionModel = data;
      this.loading = false;
    }, error1 => {});
  }

  getAllPaymentMethods() {

    this.paymentMethodsService.getAllPaymentMethods().subscribe(data => {

      const responseModel: ResponseModel = data;

      if (responseModel.success) {

        this.paymentMethodList = responseModel.data;
        // const paymentMethodModel: PaymentMethodModel = new PaymentMethodModel();
        // paymentMethodModel.paymentMethodName = 'CASH';
        // this.paymentMethodList.push(paymentMethodModel);

        for (const paymentMethod of  this.paymentMethodList) {
          // console.log(this.paymentMethodList[i].paymentMethodName);
          if (paymentMethod.paymentMethodName === PaymentMethodType.FLUTTER_WAVE) {
            this.flutterWavePaymentMethod = paymentMethod;
            if (paymentMethod.liveActive) {
              this.publicApiKey = paymentMethod.livePublicKey;
              this.transactionType = TransactionTypeConstant.LIVE;
              this.scriptService.load('liveFlutterWave').then(value => {
                console.log('live loaded');
              }).catch(error => console.log(error));

            } else {
              this.publicApiKey = paymentMethod.testingPublicKey;
              this.transactionType = TransactionTypeConstant.TESTING;
              this.scriptService.load('testFlutterWave').then(testData => {
                console.log('test loaded');
              }).catch(error => console.log(error));
            }
          }
          this.fetchPaymentTransaction();

          // else if (this.paymentMethodList[i].paymentMethodName === PaymentMethodType.PAY_PAL) {
          //   this.scriptService.load('payPalTest').then(value => {
          //     console.log('paypal loaded');
          //   }).catch(error => console.log(error));
          // }
        }
      }

    }, error2 => {
    });
  }

  setOrdersDetails() {

    const listOfTestsSelected: OrderDetails[] = [];

    // console.log('shitty');
    // console.log(this.itemsInCart);

    for (const item of this.itemsInCart) {
      const ordersDetails = new OrderDetails();
      ordersDetails.id = item.id;
      ordersDetails.name = item.name;
      ordersDetails.price = item.price;
      ordersDetails.quantity = item.quantity;
      ordersDetails.total = item.total;
      ordersDetails.firstName = item.firstName;
      ordersDetails.lastName = item.lastName;
      ordersDetails.otherName = item.otherName;
      ordersDetails.phoneNumber = item.phoneNumber;
      ordersDetails.selectedPhoneNumber = item.selectedPhoneNumber;
      ordersDetails.fileNumber = item.fileNumber;
      listOfTestsSelected.push(ordersDetails);
    }
    return listOfTestsSelected;
  }

  create(value: any) {

    this.payingWithCash = true;

    const listOfTestsSelected = this.setOrdersDetails();

    const paymentMethodModel = new MainPaymentTransactionModel();
    paymentMethodModel.amount = this.paymentTransactionModel.amount;
    paymentMethodModel.currencyTypeConstant = this.paymentTransactionModel.currency;
    paymentMethodModel.transactionRef = this.paymentTransactionModel.transactionReference;
    paymentMethodModel.transactionTypeConstant = this.paymentTransactionModel.transactionTypeConstant;
    paymentMethodModel.listOfTestsSelected = listOfTestsSelected;
    paymentMethodModel.paymentMethodConstant = value;


    this.paymentMethodsService.createTransaction(paymentMethodModel).subscribe(data => {
      this.payingWithCash = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.removeLocalStorage();
        this.showSuccessToast(responseModel.message);
      } else {
        this.showFailedToast(responseModel.message);
      }

    }, error => {
      this.payingWithCash = false;
      console.log(error);
      this.showFailedToast(error.error.message);
    });
  }

  removeLocalStorage() {
    this.myCookieService.clearShoppingCartData();
    localStorage.removeItem('referred_by');
    localStorage.removeItem('items-in-cart');
    this.router.navigateByUrl('/dashboard/patient/main');
  }


  showSuccessToast(message: string) {
    this.toastService.success(message , 'Success!');
  }

  showFailedToast(message: string) {
    this.toastService.error(message, 'Error!');
  }
}
