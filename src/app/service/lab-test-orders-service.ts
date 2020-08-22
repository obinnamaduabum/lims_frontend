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
export class LabTestOrdersService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

   index(value: any, page: number, pageSize: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/test-orders?page=` + page + '&size=' + pageSize, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  indexOflabTestsOrdered(value: any, page: number, pageSize: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/orders/lab-tests?page=` + page + '&size=' + pageSize, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  findById(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/test-orders/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  forSpecificUser(value: any, page: number, pageSize: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/test-orders/specific-user?page=`
      + page + '&size=' + pageSize, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  updateSampleCollectionStatus(value: any, id: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/test-orders/` + id, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  updateCashCollectionStatus(id: number): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/test-orders/cash-collected-status/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  ///////////// Results////////

  findAllSamplesCollectedForMedicalLabScientist(value: any, pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab-scientist-result?page=` + pageNumber + '&size=' + pageSize, value, httpOptions)
      .pipe(map((data: any) => {
      return data;
    }));
  }



  // Patient Result
  findAllPatientLoggedInResult(value: any, pageNumber: number, pageSize: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/my-patient-result/list-all?page=` + pageNumber + '&size=' + pageSize, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  createPatientResult(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/my-patient-result/create-result`, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  getPatientResult(id: any, code: any, templateCode: any): Observable<any> {
    console.log('id: ' + id + 'code:' + code + 'template: ' + templateCode );

    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab-scientist-result/` + id + `?code=` + code + `&template_code=` + templateCode, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  getPatientResultForPatient(id: any, code: any, templateCode: any): Observable<any> {
    console.log('id: ' + id + 'code:' + code + 'template: ' + templateCode );

    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/my-patient-result/` + id + `?code=` + code + `&template_code=` + templateCode, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }
  ////// Results ///////////////////

}
