import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NotificationSetAsReadModel} from '../models/notification-set-to-read-model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MyPubSubService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  createTopic(value: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/topic/create?topic-name=` + value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
  getAllTopics(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/topic`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  getAllUserTopicSubscriptions(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/topic/user/` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  userSubscribeToTopic(value: any, id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/subscribe/` + value + `?user-id=` + id, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  userUnSubscribeToTopic(id: any, userId: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/unsubscribe/` + id + `?user-id=` + userId, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  deleteTopic(value: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/topic/delete/` + value, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
  consume() {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/shila/consumer`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  changeNotificationStatusToRead(code: string, notificationSetAsReadModel: NotificationSetAsReadModel) {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/notification/status/` + code, notificationSetAsReadModel, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }


  getNotificationCount() {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/notification/count`, httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }
}
