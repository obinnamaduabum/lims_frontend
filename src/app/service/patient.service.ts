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

@Injectable()
export class PatientService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  create(value: any): Observable<any> {
    console.log('value');
    console.log(value);
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/public/default/patient/create`,
      value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
