import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
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
export class LabTestTemplateService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

   index(page: number, pageSize: number): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab_test_template?page=` + page + '&size=' + pageSize, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  create(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab_test_template/create`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  findByCode(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab_test_template/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  update(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab_test_template/edit`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }



  removeAssignment(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab_test_template/remove-assignment/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

}
