import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class MyNotificationInfoUpdaterService {
  private notificationMessage: BehaviorSubject<any[]> = new BehaviorSubject(undefined);
  private notificationCount: BehaviorSubject<any> = new BehaviorSubject(undefined);

  getNotificationMessage() {
    return this.notificationMessage.asObservable();
  }

  setNotificationMessage(value: any) {
    this.notificationMessage.next(value);
  }

  getNotificationCount() {
    return this.notificationCount.asObservable();
  }

  setNotificationCount(value: any) {
    this.notificationCount = value;
  }
}
