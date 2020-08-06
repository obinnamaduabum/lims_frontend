import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
// @ts-ignore
import constants from 'src/assets/json/constants_utils.json';
import {CookieService} from 'ngx-cookie-service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatMenuTrigger} from '@angular/material/menu';
import {LabLeftSidebarService} from '../../../service/lab-left-sidebar.service';
import {PortalUserModel} from '../../../models/portal-user-model';
import {AuthenticationService} from '../../../service/authentication-service';
import {MyPubSubService} from '../../../service/mypubsub.service';
import {FirebaseMessagingService} from '../../../service/firebase-messaging-service';
import {MyNotificationInfoUpdaterService} from '../../../service/my-notification-info-updater-service';
import {ResponseModel} from '../../../models/response-model';
import {NotificationSetAsReadModel} from '../../../models/notification-set-to-read-model';


@Component({
  selector: 'app-lab-header',
  templateUrl: './lab-header.component.html',
  styleUrls: ['./lab-header.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class LabHeaderComponent implements OnInit {

  @ViewChild(MatMenuTrigger, {static: true}) trigger: MatMenuTrigger;
  openSrc = 'assets/img/svg/up.svg';
  closeSrc = 'assets/img/svg/down.svg';
  @ViewChild('hamburgerIcon', {static: true})
  hamburgerIcon: ElementRef;
  portalUser: PortalUserModel;
  message;
  notifications: any[] = [];
  count: any = 0;
  fetchingNotification = 0;

  constructor(private labLeftSidebarService: LabLeftSidebarService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private cookieService: CookieService,
              private myPubSubService: MyPubSubService,
              private messagingService: FirebaseMessagingService,
              private myNotificationInfoUpdaterService: MyNotificationInfoUpdaterService) {}

  ngOnInit() {
    // const token = this.cookieService.get('fcm-token-cookie-name');
    // console.log(token);
    // if (token) {
    //   firebase.auth().signInWithCustomToken(token).then((result) => {
    //     if (firebase.auth().currentUser !== null) {
    //       console.log('user xxxxxxxxxxxxxxxxxx id: ' + firebase.auth().currentUser.uid);
    //     }
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     // var errorCode = error.code;
    //     // var errorMessage = error.message;
    //     console.log(error);
    //   });
    // }
    ///
    this.labLeftSidebarService.getSidebarStatus().subscribe(data => {
      if (!data) {
        this.hamburgerIcon.nativeElement.classList.remove('is-active');
      }
    }, error1 => {
    });

    this.authenticationService.checkIfUserIsAlreadyLoggedIn().subscribe(data => {
      // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel) {
        this.portalUser = responseModel.data;
        this.messagingService.requestPermission(this.portalUser.code);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
      }
    }, error1 => {
    });

    this.checkForMessages();
    this.myNotificationInfoUpdaterService.getNotificationMessage().subscribe(responseData => {
      if (responseData) {
        const notification = 'notification';
        const title = 'title';
        const body = 'body';
        const dateCreated = 'dateCreated';
        const dateUpdated = 'dateUpdated';
        const url = 'url';
        const data = 'data';
        const code = 'code';
        console.log(responseData);
        const newNotification = {
          title: responseData[notification][title],
          message: responseData[notification][body],
          url: responseData[data][url],
          code: responseData[data][code],
          dateCreated: responseData[data][dateCreated],
          dateUpdated: responseData[data][dateUpdated]
        };
        this.notifications.unshift(newNotification);
        // console.log('cum shooter data');
        this.count = this.count + 1;
      }
    });
  }

  hamburgerIconClick() {
    if (this.hamburgerIcon.nativeElement.classList) {
      if (this.hamburgerIcon.nativeElement.classList.contains('is-active')) {
        this.labLeftSidebarService.close();
        this.hamburgerIcon.nativeElement.classList.remove('is-active');
      } else {
        this.labLeftSidebarService.open();
        this.hamburgerIcon.nativeElement.classList.add('is-active');
      }
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(data => {
      this.authenticationService.clearStaleSession();
      this.router.navigate(['/login']);
    });
  }

  checkForMessages() {
    this.myPubSubService.consume().subscribe(data => {
      const responseModel: ResponseModel = data;
      this.fetchingNotification = 1;
      if (responseModel.success) {

        console.log(responseModel.data);
        this.count = responseModel.data.count;
        this.notifications = responseModel.data.dataList;
      }
     // console.log(data);
    }, error1 => {
    });
  }

  setAsRead(index: any, code: string, url: any, title: any, message: any, dateCreated: any, dateUpdated: any) {
    const resultNotification = this.notifications.filter(value => (
      value.code.toString().toUpperCase() === code.toUpperCase()));
    // console.log(resultNotification[0].read = true);
    resultNotification[0].read = true;
    // resultNotification.code
    // this.router.navigateByUrl('/dashboard/lab/orders/10864');
    const notificationSetAsReadModel: NotificationSetAsReadModel = new NotificationSetAsReadModel();
    notificationSetAsReadModel.code = code;
    notificationSetAsReadModel.title = title;
    notificationSetAsReadModel.message = message;
    notificationSetAsReadModel.url = url;
    notificationSetAsReadModel.dateCreated = dateCreated;
    notificationSetAsReadModel.dateUpdated = dateUpdated;
    this.myPubSubService.changeNotificationStatusToRead(code, notificationSetAsReadModel).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        if (this.count > 0) {
          this.count = this.count - 1;
        }
        this.notifications[index] = resultNotification[0];
        this.onRefresh(url);
        // this.router.navigateByUrl(url);
        // this.notifications = responseModel.data;
      } else {
        this.onRefresh(url);
      }
     // console.log(data);
    }, error1 => {
      // this.onRefresh(url);
    });
  }

  onRefresh(url) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    // console.log('redirecting' + url);
    this.router.navigateByUrl(url)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
  }

  redirectTo(s: string) {
    this.router.navigate([s]);
  }

}
