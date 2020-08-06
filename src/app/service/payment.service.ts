import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  index(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/auth/payment-methods/`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  create(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/auth/payment-methods/`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
