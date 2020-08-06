import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {AdminSettingsModel} from '../models/admin-settings-model';
import {ResponseModel} from '../models/response-model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class AdminSettingsService {

  serverRestfulApi = '';
  public adminSettingsModel: BehaviorSubject<AdminSettingsModel> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverRestfulApi = environment.serverAuthenticationApi;
    }
    // this.getAllAdminSettings();
  }

  getAllAdminSettings(): Observable<any> {
    return this.httpClient.get(this.serverRestfulApi + `/v1/api/protected/auth/setting/admin`, httpOptions).pipe(map((data: any) => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.adminSettingsModel.next(responseModel.data);
      }
      return data;
    }));
  }


  getPublicAllAdminSettings(): Observable<any> {
    return this.httpClient.get(this.serverRestfulApi + `/v1/api/public/auth/setting/admin`, httpOptions).pipe(map((data: any) => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.adminSettingsModel.next(responseModel.data);
      }
      return data;
    }));
  }

  updateAnAdminSettings(data: any): Observable<any> {
    return this.httpClient.put(this.serverRestfulApi + `/v1/api/protected/auth/setting/admin/update`, data , httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
