import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {Subscription} from 'rxjs';
import {MatMenuTrigger} from '@angular/material/menu';
import {PortalUserModel} from '../../../models/portal-user-model';
import {MyCookieService} from '../../../service/mycookieservice.service';
import {AuthenticationService} from '../../../service/authentication-service';
import {FirebaseMessagingService} from '../../../service/firebase-messaging-service';
import {MyPubSubService} from '../../../service/mypubsub.service';
import {ResponseModel} from '../../../models/response-model';
import {PatientLeftSidebarService} from '../../../service/patient-left-sidebar.service';



@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css'],
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
export class PatientHeaderComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, {static: true}) trigger: MatMenuTrigger;
  openSrc = 'assets/img/svg/up.svg';
  closeSrc = 'assets/img/svg/down.svg';
  @ViewChild('hamburgerIcon', {static: true})
  private hamburgerIcon: ElementRef;
  itemsInCart: any[] = [];
  portalUser: PortalUserModel;
  message;
  count: any = 0;
  notifications: any[] = [];
  fetchUserSubscription: Subscription;

  constructor(private patientLeftSidebarService: PatientLeftSidebarService,
              private cookieService: CookieService,
              private myCookieService: MyCookieService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private messagingService: FirebaseMessagingService,
              private myPubSubService: MyPubSubService) {

    const cookieName = 'project-merlin-firebase';
    const token = this.cookieService.get(cookieName);
    // console.log(token);
    if (token) {
      console.log('found the token');
      firebase.auth().signInWithCustomToken(token).then((result) => {
        if (firebase.auth().currentUser !== null) {
          console.log('user xxxxxxxxxxxxxxxxxx id: ' + firebase.auth().currentUser.uid);
        }
      }).catch((error) => {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        console.log(error);
      });
    }

    const userId = 'user001';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;


    // const currentToken = await messaging.getToken();
    // fetch('/register', { method: 'post', body: currentToken });
   // showData();

    // messaging.onTokenRefresh(async () => {
    //   console.log('token refreshed');
    //   const newToken = await messaging.getToken();
    //   fetch('/register', { method: 'post', body: token });
    // });

  }

  ngOnInit() {
    this.patientLeftSidebarService.getSidebarStatus().subscribe(data => {
      if (!data) {
        this.hamburgerIcon.nativeElement.classList.remove('is-active');
      }
    }, error1 => {
    });


    this.myCookieService.getShoppingCartList().subscribe(data => {
      console.log(data);
      this.itemsInCart = data;
    }, error1 => {
    });

    this.patientLeftSidebarService.getSidebarStatus().subscribe(data => {
      if (!data) {
        this.hamburgerIcon.nativeElement.classList.remove('is-active');
      } else {
        this.hamburgerIcon.nativeElement.classList.add('is-active');
      }
    }, error1 => {
    });

    this.cookieService.get('items-in-cart');


    this.fetchUserSubscription = this.authenticationService.checkIfUserIsAlreadyLoggedIn().subscribe(data => {
      // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel) {
        this.portalUser = responseModel.data;
        console.log(this.portalUser);
        const userId = this.portalUser.id;
        // this.messagingService.requestPermission(userId);
        // this.messagingService.receiveMessage();
        // this.message = this.messagingService.currentMessage;
        // if (this.message) {
        //   const notification = 'notification';
        //   console.log(this.message[notification]);
        //   this.notifications.push(this.message[notification]);
        // }
        // this.message = this.messagingService.
      }
    }, error1 => {
    });
  }

  hamburgerIconClick() {
    if (this.hamburgerIcon.nativeElement.classList) {
      if (this.hamburgerIcon.nativeElement.classList.contains('is-active')) {
        this.patientLeftSidebarService.close();
        this.hamburgerIcon.nativeElement.classList.remove('is-active');
      } else {
        this.patientLeftSidebarService.open();
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

  redirectTo(s: string) {
    this.router.navigate([s]);
  }


  showDropdown() {
    document.getElementById('myDropdown').classList.toggle('show');
  }


  checkForMessages() {
    this.myPubSubService.consume().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {

        console.log(responseModel.data);
        this.count = responseModel.data.count;
        this.notifications = responseModel.data.dataList;
      }
      console.log(data);
    }, error1 => {});
  }

  setAsRead(code: any, url: any) {
    console.log(url);
    // this.router.navigateByUrl('/dashboard/lab/orders/10864');
    this.myPubSubService.changeNotificationStatusToRead(code, null).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.onRefresh(url);
        // this.router.navigateByUrl(url);
        // this.notifications = responseModel.data;
      } else {
        this.onRefresh(url);
      }
    }, error1 => {
      this.onRefresh(url);
    });
  }



  onRefresh(url) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => {
    //   return false;
    // };

    if (this.count > 0) {
      this.count = this.count - 1;
    }
    console.log('on refresh url: ' + url);
    // this.router.navigateByUrl(url)
    //   .then(() => {
    //     this.router.navigated = false;
    //     this.router.navigate([this.router.url]);
    //   });
  }

  ngOnDestroy(): void {
    this.fetchUserSubscription.unsubscribe();
  }
}
