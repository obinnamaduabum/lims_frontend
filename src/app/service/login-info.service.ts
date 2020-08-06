import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LoginInfoModel} from '../models/login-info-model';


@Injectable({
  providedIn: 'root'
})
export class LoginInfoService {

  private loginInfo: BehaviorSubject<LoginInfoModel> = new BehaviorSubject(undefined);
  constructor() { }


  getLoginInfo() {
    return this.loginInfo.asObservable();
  }

  setLoginInfo(value: any) {
    this.loginInfo.next(value);
  }
}
