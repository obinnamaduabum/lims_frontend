import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {environment} from '../../environments/environment';
import {PhoneNumberCodes} from '../models/phone-number-codes-model';
import {PhoneNumberModel} from '../models/phone-number-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class PhoneNumberCodeService {

  private phoneNumbers: PhoneNumberCodes[];
  url = './assets/json/phone_number.json';
  serverAuthenticationApi = '';
  private listOfPhoneCodes: BehaviorSubject<PhoneNumberCodes[]> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }

    this.httpClient.get(this.url).subscribe(
      data => {
        this.phoneNumbers = data as PhoneNumberCodes[];
      },
      (err: HttpErrorResponse) => {
      }
    );
  }

  // getPhoneNumberCodes(): Observable<any> {
  //   return this.httpClient.get(this.serverAuthenticationApi + `/api/public/auth/phone_codes/`, httpOptions).pipe(map((data: any) => {
  //
  //     // console.log(data);
  //     const responseModel: ResponseModel = data;
  //     const phoneCodes: PhoneNumberCodes[] = responseModel.data;
  //     this.listOfPhoneCodes.next(phoneCodes);
  //     return data;
  //   }));
  // }

  getPhoneNumberVerification(phoneNumber: string, alpha2: string): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/public/auth/phone_number/verify` + '?phoneNumber=' + phoneNumber + '&alpha2=' + alpha2, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  verifyPhoneNumberVerification(phoneNumberModel: PhoneNumberModel): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/auth/phone_number/verify`, phoneNumberModel, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  getListOfPhoneCodes() {
    if (this.phoneNumbers != null) {
      return of(this.phoneNumbers);
    } else {
      return this.httpClient.get(this.url).pipe(map((data: any) => {
        this.phoneNumbers = data as PhoneNumberCodes[];
        return this.phoneNumbers;
      }));
    }
  }
}
