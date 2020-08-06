import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {PaymentTransactionModel} from '../payment-module/model/payment-transaction-model';
import {PaymentInfoModel} from '../payment-module/model/payment.info.model';

@Injectable()
export class PaymentInfoService {
  private paymentInfoModel = new BehaviorSubject<PaymentInfoModel>(undefined);
  private paymentTransactionModel = new BehaviorSubject<PaymentTransactionModel>(undefined);

  setPaymentInfo(value: PaymentInfoModel) {
    this.paymentInfoModel.next(value);
  }
  getPaymentInfo() {
   return this.paymentInfoModel.asObservable();
  }

  setPaymentTransaction(value: PaymentTransactionModel) {
    this.paymentTransactionModel.next(value);
  }
  getPaymentTransaction() {
    return this.paymentTransactionModel.asObservable();
  }
}
