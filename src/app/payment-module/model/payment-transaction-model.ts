import {TransactionTypeConstant} from '../payment-enum/transaction-status-type';

export class PaymentTransactionModel {

  transactionReference: string;

  currency: string;

  paymentMethod: string;

  email: string;

  amount: string;

  transactionTypeConstant: TransactionTypeConstant ;
}
