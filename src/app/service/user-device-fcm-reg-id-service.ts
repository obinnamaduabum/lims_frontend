import {Injectable} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
// @ts-ignore
import constants from 'src/assets/json/constants_utils.json';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserDeviceFcmRegIdService {
  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  save(token: string): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/user-device-fcm-reg-id/add/` + token , httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
