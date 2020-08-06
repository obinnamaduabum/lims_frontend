import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FlutterWaveVerifyPayment} from '../model/flutterwave-verification';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class PaymentMethodsService {

  serverAuthenticationApi = '';
  private paymentWasSuccessful = new Subject();

  public flutterWaveVerifyPayment: BehaviorSubject<FlutterWaveVerifyPayment> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient) {


    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    } else {
      this.serverAuthenticationApi = '';
    }
  }

  getOnePaymentMethods(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/payment-methods/` + id, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  editPaymentMethod(value: any, id: string): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/auth/payment-methods/edit/` + id, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  verifyPayment(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/public/auth/payment/verify`, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  updatePaymentTransactionAfterPayment(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/auth/payment-methods/board-booking/update`, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }



  createTransaction(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/payment/transaction/create`, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getAllPaymentMethods(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/payment-methods/`, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getPublicAllPaymentMethods(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/public/auth/payment-methods/`, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  generateTransactionRef(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/payment-methods/transaction-ref`, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getPaymentWasSuccessful() {
    return this.paymentWasSuccessful.asObservable();
  }

  setPaymentWasSuccessful(value: boolean) {
    this.paymentWasSuccessful.next(value);
  }
  getFlutterWaveVerifyPayment(): Observable<any> {
   return this.flutterWaveVerifyPayment.asObservable();
  }
  setFlutterWaveVerifyPayment(value: any) {
    this.flutterWaveVerifyPayment.next(value);
  }
}
