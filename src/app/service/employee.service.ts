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
export class EmployeeService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  create(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/default/employee/create`,
      value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  updateEmployeeInfo(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/default/employee/update`,
      value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  updatePatientInfo(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/default/patient/update`,
      value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }



  getEmployeeInfoToUpdate(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/default/employee/update/`
      + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
