import {OrderDetails} from '../payment-module/model/order-details-model';


export class MainPaymentTransactionModel {

  transactionRef: string;

  cashCollected: boolean;

  currencyTypeConstant: string;

  amount: string;

  paymentMethodConstant: string;

  transactionTypeConstant: string;

  listOfTestsSelected: OrderDetails[];
}
