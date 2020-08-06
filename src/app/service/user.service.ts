import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class UserService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {


    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    } else {
      this.serverAuthenticationApi = '';
    }
  }


  createUser(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/auth/portal-user/create`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  sendContactUsEmail(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/default/contact-us/send`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
  fetchPortalUser(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/profile/update`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  updatePortalUser(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/profile/update`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  updateEmployee(value: any): Observable<any> {
    return this.httpClient.put(this.serverAuthenticationApi +
      `/api/protected/auth/portal_user/employee/update`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  deactivateUser(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/deactivate`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }



  checkIfUserEmailExists(email: string): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/public/auth/portal-user/email/exists?email=` + email, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/public/auth/portal-user/resend-email-verification?email=` + email, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  verifyToken(token: any, userCode: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/public/auth/portal-user/verify-email?token=` + token + `&userCode=`
      + userCode, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  verifyTwoFactorCode(inputData: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/auth/portal-user/two-factor/verify`, inputData, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  updateUserProfile(value: any): Observable<any> {
    return this.httpClient.put(this.serverAuthenticationApi + `/v1/api/protected/auth/portal_user/update`, value, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  postUserProfileImage(fileCode: string, profileImageType: string): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/auth/portal_user/image/update?file_code=`
      + fileCode + `&profile_image_type=` + profileImageType, httpOptions)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  getPortalAccountCode() {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/portal_account/code`).pipe(map((data: any) => {
      return data;
    }));
  }


  getAllEmployees(request: any, size: any, pageNumber: any) {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/employee/view-all?page=` + pageNumber + '&size=' + size, request).pipe(map((data: any) => {
      return data;
    }));
  }


  changePassword(request: any) {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/edit/change_password`, request).pipe(map((data: any) => {
      return data;
    }));
  }


  checkIfOldPasswordMatches(request: any) {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/edit/change_password/matches_old`, request).pipe(map((data: any) => {
      return data;
    }));
  }


  getPortalUserRoles(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/public/default/portal-user/roles`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }



  getPortalUserById(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/auth/portal_user/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

}
