import {AfterContentChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {PaymentMethodModel} from '../../model/payment-method-model';
import {PaymentTransactionModel} from '../../model/payment-transaction-model';
import {PayPalItemModel} from '../../model/paypal.item.model';
import {UnitAmount} from '../../model/unit-amount';
import {PaymentMethodsService} from '../../service/payment-methods-service';
import {PaymentMethodType} from '../../../lh-enum/payment-method-type';

import {Router} from '@angular/router';
import {TransactionTypeConstant} from '../../payment-enum/transaction-status-type';
import {ScriptService} from '../../../service/script-service';
import {TestModel} from '../../../models/test-model';

declare let paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit, AfterContentChecked, AfterViewInit {
  addScript = false;
  payPalLoad = true;
  @Input('paymentMethod') paymentMethod: PaymentMethodModel;
  @Input('paymentTransactionModel') paymentTransactionModel: PaymentTransactionModel;
  @Input('itemsInCart') itemsInCart: TestModel[] = [];
  payPalConfig: any;
  payPalItemsModels: any[] = [];
  isScriptLoaded = false;

  constructor(private paymentMethodsService: PaymentMethodsService,
              private scriptService: ScriptService,
              private router: Router) {
  }

  ngOnInit() {
    // this.getAllPaymentMethods();
    this.setUpPayPalObject();
    if (this.paymentTransactionModel) {
      console.log('paymentTransactionModel')
      console.log(this.paymentTransactionModel);
      this.payPalConfig = {
        style: {
          size: 'responsive'
        },
        env: 'sandbox',
        client: {
          sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
          production: '<your-production-key here>'
        },
        commit: true,
        payment: (data, actions) => {

          return actions.payment.create({
            transactions: [
              {amount: {total: this.paymentTransactionModel.amount, currency: this.paymentTransactionModel.currency}}]
          });
          // return actions.payment.create({
          //   payment: {
          //     details: [],
          //     transactions: [
          //
          //     ]
          //   }
          // });
        },
        onAuthorize: (data, actions) => {
          return actions.payment.execute().then((payment) => {
            console.log(payment);
            // this.paymentMethodsService.updatePaymentTransactionAfterPayment();
            // Do something when payment is successful.
          });
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          // this.showCancel = true;

        },
        onError: err => {
          console.log('OnError', err);
          // this.showError = true;
        },

      };
    }
    // console.log('paymentTransactionModel: ' + this.paymentTransactionModel);
  }

  getAllPaymentMethods() {
    this.scriptService.loadScript('payPalTest').then(value => {
      console.log('paypal loaded');
    }).catch(error => console.log(error));
  }

  ngAfterContentChecked(): void {
    // if (!this.addScript) {
    //   this.scriptService.loadScript('payPalTest').then(value => {
    //     console.log('paypal loaded');
    //     paypal.Button.render(this.payPalConfig, '#paypal-button-container');
    //     this.payPalLoad = false;
    //     this.isScriptLoaded = true;
    //   }).catch(error => {
    //     this.isScriptLoaded = false;
    //     console.log(error);
    //   });
    // }

    // this.addScript = true;
    if (!this.addScript) {
      this.addPayPalScript().then(() => {
        paypal.Button.render(this.payPalConfig, '#paypal-button-container');
        this.payPalLoad = false;
      }).catch(error => {
        //  this.addScript = false;
        console.log(error);
        // return this.scriptService.loadScript('payPalTest');
      });
    }
  }


  setUpPayPalObject() {

    for (const items of this.itemsInCart) {
      const payPalItemModel: PayPalItemModel = new PayPalItemModel();
      payPalItemModel.category = '';
      payPalItemModel.name = '' + items.name;
      payPalItemModel.quantity = '' + items.quantity;

      const unitAmount: UnitAmount = new UnitAmount();
      unitAmount.currency_code = '' + items.currencyCode;
      unitAmount.value = '' + items.price;
      payPalItemModel.unit_amount = unitAmount;
      this.payPalItemsModels.push(payPalItemModel);
    }

  }

  ngAfterViewInit(): void {
  }


  addPayPalScript() {
    this.addScript = true;
    console.log('loading started');
    return this.scriptService.loadScript('payPalTest');
  }
}
