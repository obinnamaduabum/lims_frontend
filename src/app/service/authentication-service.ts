import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ResponseModel} from '../models/response-model';
declare const gapi: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};


@Injectable()
export class AuthenticationService {

  serverAuthenticationApi = '';
  private user: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private ongoingFetch: Observable<any>;
  private initialized: boolean;
  private portalUser: BehaviorSubject<any> = new BehaviorSubject(undefined);
  // setPortalUser(data: any) {
  //   // if (data) {
  //   //   this.user.next(data);
  //   this.portalUser.next(data);
  //   //   this.initialized = true;
  //   // } else {
  //   //  this.clearStaleSession();
  //   // }
  // }

  getUserInfo() {
    return this.portalUser.asObservable();
  }

  // getUserInfoIfNullCheckServer(): Observable<any> {
  //   if (this.portalUser.getValue()) {
  //     return this.portalUser.asObservable();
  //   }
  //   return this.me();
  // }
  //
  // emitPortalUser(data: any) {
  //   this.setPortalUser(data);
  //   this.portalUser.next(data);
  // }

  constructor(private httpClient: HttpClient) {

    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    } else {
      this.serverAuthenticationApi = '';
    }

    this.fetch().subscribe((res => {
      this.initialized = true;
    }), (res => {
      this.initialized = false;
    }));
  }

  clearStaleSession() {
    this.initialized = false;
    this.user.next(null);
    this.portalUser.next(null);
  }

  setUserInfo(data: any) {
    console.log(data);
    this.initialized = true;
    this.user.next(data);
    this.portalUser.next(data);
    // console.log(this.currentWidth);
  }

  logout() {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/logout`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  login(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/public/auth/login`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  partialLogin(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi
      + `/v1/api/public/auth/partial-login`, value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  me(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/me`, httpOptions).pipe(map((data: any) => {
      this.setUserInfo(data);
      return data;
    }));
  }

  fetchUser(): Observable<any> {

    // if (this.getCookie('merlinLabsAuthToken')) {
      if (this.initialized) {
        return this.user.asObservable();
      }

      return this.fetch();
    // }
    //
    // return of(null);
  }


  checkIfUserIsAlreadyLoggedIn(): Observable<any> {

    // console.log('bbbb');
    // if (this.getCookie('merlinLabsAuthToken')) {
      if (this.initialized) {
        return this.user.asObservable();
      }
      return this.fetch();
    // }
    // return of(null);
  }



  // fetchLoggedInUserOnce(): Observable<any> {
  //     return this.user.asObservable();
  // }

  // private getCookie(name: string) {
  //   const ca: Array<string> = document.cookie.split(';');
  //   const caLen: number = ca.length;
  //   const cookieName = `${name}=`;
  //   let c = '';
  //
  //   for (let i = 0; i < caLen; i += 1) {
  //     c = ca[i].replace(/^\s+/g, '');
  //     if (c.indexOf(cookieName) === 0) {
  //       return c.substring(cookieName.length, c.length);
  //     }
  //   }
  //   return '';
  // }

  public fetch() {
    if (!this.ongoingFetch) {

      this.ongoingFetch = this.httpClient.get(this.serverAuthenticationApi + `/v1/api/protected/auth/me`, httpOptions);

      this.ongoingFetch.subscribe((data: ResponseModel) => {
        this.ongoingFetch = null;
        this.user.next(data);
        this.portalUser.next(data);
        this.initialized = true;
      }, (err: any) => {
        this.user.next(null);
        this.portalUser.next(null);
      });

    } else {
      console.log('fetching user ongoing...');
    }

    return this.ongoingFetch;
  }


  // socialLogin(value: LoginModel): Observable<any> {
  //   return this.httpClient.post(this.serverAuthenticationApi + `/api/public/auth/login`, value, httpOptions)
  //     .pipe(map((data: any) => {
  //       return data;
  //     }));
  // }

  logoutOfGoogle() {
    // const googleAuth = gapi.auth2.getAuthInstance();
    // googleAuth.signOut().then(function () {
    // });
    //
    // googleAuth.disconnect();
  }

  // googleLogin(newData: any): Observable<any> {
  //   return this.httpClient.post(
  //   this.serverAuthenticationApi + `/api/public/auth/connect/login/google`, newData, httpOptions).pipe(map((data: any) => {
  //     return data;
  //   }));
  // }
  //
  //
  // loginWithInstagram(newData: any): Observable<any> {
  //   return this.httpClient.post(
  //   this.serverAuthenticationApi + `/api/public/auth/connect/login/instagram`, newData, httpOptions).pipe(map((data: any) => {
  //     return data;
  //   }));
  // }
  //
  // facebookLogin(newData: any): Observable<any> {
  //   return this.httpClient.post(
  //   this.serverAuthenticationApi + `/api/public/auth/connect/login/facebook`, newData, httpOptions).pipe(map((data: any) => {
  //     return data;
  //   }));
  // }

}
