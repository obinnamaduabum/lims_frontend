import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {MyNotificationInfoUpdaterService} from './my-notification-info-updater-service';
import {UserDeviceFcmRegIdService} from './user-device-fcm-reg-id-service';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
// @ts-ignore


@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireDB: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              private angularFireMessaging: AngularFireMessaging,
              private cookieService: CookieService,
              private userDeviceFcmRegIdService: UserDeviceFcmRegIdService,
              private myNotificationInfoUpdaterService: MyNotificationInfoUpdaterService) {

    this.angularFireMessaging.messages.subscribe(
      (messaging) => {
        // messaging.onMessage = messaging.onMessage.bind(messaging);
        // messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
      }
    );
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token;
        this.angularFireDB.object('fcmTokens/').update(data);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    // console.log('userid', userId);
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        // this.cookieService.delete(constants['fire-base-cookie-name']);
        // this.cookieService.set(constants['fire-base-cookie-name'], token);
        this.userDeviceFcmRegIdService.save(token).subscribe(data => {
          console.log(data);
        }, error1 => {});
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        // console.log('new message received. ', payload);
        const audio = new Audio();
        audio.src = 'assets/audio/mp3/notification/slack-incoming-call.mp3';
        audio.load();
        audio.play();
        this.myNotificationInfoUpdaterService.setNotificationMessage(payload);
        this.currentMessage.next(payload);
      });
  }
}
