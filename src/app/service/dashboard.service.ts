import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
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
export class DashboardService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  fetchLabAccountDashboardInfo(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/dashboard/lab`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }



  fetchPatientInfoDashboardInfo(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/dashboard/patient`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
