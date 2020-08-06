import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {PhoneNumberModel} from '../models/phone-number-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class PhoneNumberVerificationService {
  serverFilesServer = '';
  constructor(private httpClient: HttpClient) {

    if (environment.production) {
      this.serverFilesServer = environment.serverAuthenticationApi;
    } else {
      this.serverFilesServer = '';
    }
  }

  verifyPhoneNumber(phoneNumber: string): Observable<any> {
    return this.httpClient.get(this.serverFilesServer + `/v1/api/public/auth/phone_number/verify?phoneNumber=` + phoneNumber)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  verifyCode(code: string): Observable<any> {
    return this.httpClient.get(this.serverFilesServer + `/v1/api/public/auth/phone_number/verification/code?code=` + code)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  sendverificationCodeViaEmail(data: any): Observable<any> {
    return this.httpClient.post(this.serverFilesServer + `/v1/api/public/auth/portal-user/email/verification_code`, data)
      .pipe(map((result: any) => {
        return result;
      }));
  }


  doesPhoneNumberAlreadyExist(phoneNumberModel: PhoneNumberModel): Observable<any> {
    return this.httpClient.post(this.serverFilesServer + `/v1/api/public/auth/portal-user/phone_number/exists`, phoneNumberModel)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  doesPhoneNumberAlreadyExistForEmployee(phoneNumberModel: PhoneNumberModel, code: string): Observable<any> {
    return this.httpClient.post(this.serverFilesServer + `/v1/api/public/auth/portal-user/phone_number/exists/` + code, phoneNumberModel)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  sendPhoneNumberVerificationCode(phoneNumber: string): Observable<any> {
    return this.httpClient.get(
      this.serverFilesServer + `/v1/api/public/auth/phone_number/send_verification_code?phoneNumber=` + phoneNumber)
      .pipe(map((data: any) => {
        return data;
      }));
  }

}
