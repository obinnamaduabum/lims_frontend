import {Component, Input, OnInit} from '@angular/core';
import {FlutterWaveVerifyPayment} from '../../model/flutterwave-verification';
import {PaymentTransactionUpdate} from '../../model/payment-update';
import {PaymentMethodModel} from '../../model/payment-method-model';
import {PaymentTransactionModel} from '../../model/payment-transaction-model';

import {PaymentMethodsService} from '../../service/payment-methods-service';
import {PaymentMethodType} from '../../../lh-enum/payment-method-type';
import {TestModel} from '../../../models/test-model';
declare const getpaidSetup: any;
declare var me: any;

@Component({
  selector: 'app-rave',
  templateUrl: './rave.component.html',
  styleUrls: ['./rave.component.css']
})
export class RaveComponent implements OnInit {

  @Input('paymentInfoModel') paymentInfoModel: PaymentMethodModel;
  @Input('paymentTransactionModel') paymentTransactionModel: PaymentTransactionModel;
  @Input('itemsInCart') itemsInCart: TestModel[] = [];
  @Input('paymentMethod') paymentMethod: PaymentMethodModel;
  publicApiKey: any;
  constructor(private paymentMethodService: PaymentMethodsService) { }

  ngOnInit() {
    me = this;
    if (this.paymentMethod.liveActive) {
      this.publicApiKey = this.paymentMethod.livePublicKey;
    } else {
      this.publicApiKey = this.paymentMethod.testingPublicKey;
    }
  }

  payWithRave() {

    console.log(this.publicApiKey);

    console.log(this.paymentTransactionModel);

    // this.paymentMethod = 'FLUTTER_WAVE';
    // if (this.fetchingData) {
    const x = getpaidSetup({
      PBFPubKey: this.publicApiKey,
      customer_email: this.paymentTransactionModel.email,
      amount: this.paymentTransactionModel.amount,
      currency: this.paymentTransactionModel.currency,
      payment_method: 'both',
      txref: this.paymentTransactionModel.transactionReference,
      meta: [{
        metaname: 'flightID',
        metavalue: 'AP1234'
      }],
      onclose: () => {
      },
      callback: response => {
        const txref = response.tx.txRef; // collect flwRef returned and pass to a server page to complete status check.
        console.log('This is the response returned after a charge', response);
        if (
          response.tx.chargeResponseCode === '00' ||
          response.tx.chargeResponseCode === '0'
        ) {
          setTimeout(() => {
            // me.gotoSuccess();
            x.close();
            me.updatePaymentRecord();
          }, 1000);
          // return 'success';

          // redirect to a success page
        } else {

          setTimeout(() => {
            x.close();
          }, 3000);
          // return 'failed';
          // redirect to a failure page.
        }

        // x.close(); // use this to close the modal immediately after payment.
      }
    });
    // }
  }

  updatePaymentRecord() {

    const flutterWave = new FlutterWaveVerifyPayment();
    flutterWave.amount = this.paymentTransactionModel.amount;
    flutterWave.transactionRef = this.paymentTransactionModel.transactionReference;
    flutterWave.wasPaymentSuccessful = true;


    const paymentTransactionUpdate = new PaymentTransactionUpdate();
    paymentTransactionUpdate.transactionReference = this.paymentTransactionModel.transactionReference;
    paymentTransactionUpdate.paymentStatus = true;
    paymentTransactionUpdate.transactionType = PaymentMethodType.FLUTTER_WAVE;
   // paymentTransactionUpdate.paymentMethod = this.paymentMethod;

    // const myDataToEmit: DataToEmit = new DataToEmit();
    // myDataToEmit.paymentUpdate = paymentTransactionUpdate;
    // myDataToEmit.flutterWaveInfo = flutterWave;

    // this.paymentMethodService.updatePaymentTransactionAfterPayment().subscribe(data => {
    //
    //
    // }, error1 => {});

    // this.dataToEmit = myDataToEmit;
    // this.emitter.emit(this.dataToEmit);
  }

}
