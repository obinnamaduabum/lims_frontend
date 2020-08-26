import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {PasswordRestModel} from '../models/password-rest-model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class PasswordResetService {

  serverRestfulApi = '';

  constructor(private httpClient: HttpClient) {

    if (environment.production) {
      this.serverRestfulApi = environment.serverAuthenticationApi;
    }
  }

  createToken(email: string): Observable<any> {
    return this.httpClient.get(this.serverRestfulApi +
      `/v1/api/public/auth/password-rest/create?email=` + email, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  verifyToken(token: any, userCode: any): Observable<any> {
    return this.httpClient.get(this.serverRestfulApi +
      `/v1/api/public/auth/password-rest/verify?token=` + token + `&userCode=` + userCode, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  changePassword(value: PasswordRestModel): Observable<any> {
    return this.httpClient.post(this.serverRestfulApi +
      `/v1/api/public/auth/password-rest/change-password`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
