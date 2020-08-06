import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PhoneNumberVerificationService} from './service/phone-number-verification';
import {UserService} from './service/user.service';
import {LoginInfoService} from './service/login-info.service';
import {DataToPrintService} from './service/data-to-print.service';
import {PhoneNumberCodeService} from './service/phone_number_service';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {AuthenticationService} from './service/authentication-service';
import {LottieAnimationViewModule} from 'ng-lottie';
import {PatientService} from './service/patient.service';
import {PrintService} from './service/print.service';
import { LabTestCategoriesService } from './service/lab-test-categories.service';
import { MyCookieService } from './service/mycookieservice.service';
import { AdminSettingsService } from './service/admin-settings-service';
import { GraphqlService } from './service/graphql-service';
import {AlreadyLoggedInGuardCanActivateChild} from './guards/already-logged-in-can-activate-child';
import {MainLeftSidebarService} from './service/main-left-sidebar.service';
import {AlreadyLoggedInCanLoadGuard} from './guards/already-logged-in-can-load.guard';
import {AlreadyLoggedInGuard} from './guards/already-logged-in.guard';
import {LoggedInPatientCanLoadGuard} from './guards/patient/patient-logged-in-can-load.guard';
import {PatientLoggedInGuard} from './guards/patient/patient-logged-in.guard';
import {LabLoggedInGuard} from './guards/labs/labs-logged-in.guard';
import {PatientLoggedInGuardCanActivateChild} from './guards/patient/patient-logged-in-can-activate-child';
import {LabLoggedInGuardCanActivateChild} from './guards/labs/lab-logged-in-can-activate-child';
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {CookieService} from 'ngx-cookie-service';
import {PaymentInfoService} from './service/payment.info.service';
import {ReportService} from './service/report.service';
import {LabLeftSidebarService} from './service/lab-left-sidebar.service';
import {FirebaseMessagingService} from './service/firebase-messaging-service';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {MyNotificationInfoUpdaterService} from './service/my-notification-info-updater-service';
import {PatientLeftSidebarService} from './service/patient-left-sidebar.service';
import {PaymentMethodsService} from './payment-module/service/payment-methods-service';
import {ScriptService} from './service/script-service';
import {TimeagoModule} from 'ngx-timeago';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LottieAnimationViewModule.forRoot(),
    ApolloModule,
    HttpLinkModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    TimeagoModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    // Guard
    AlreadyLoggedInGuardCanActivateChild,
    AlreadyLoggedInCanLoadGuard,
    AlreadyLoggedInGuard,
    LoggedInPatientCanLoadGuard,
    PatientLoggedInGuard,
    LabLoggedInGuard,
    PatientLoggedInGuardCanActivateChild,
    LabLoggedInGuardCanActivateChild,

    // Service
    ScriptService,
    PaymentMethodsService,
    PatientLeftSidebarService,
    MyNotificationInfoUpdaterService,
    FirebaseMessagingService,
    LabLeftSidebarService,
    ReportService,
    PaymentInfoService,
    CookieService,
    MainLeftSidebarService,
    GraphqlService,
    PatientService,
    PrintService,
    PhoneNumberVerificationService,
    AuthenticationService,
    UserService,
    LoginInfoService,
    DataToPrintService,
    PhoneNumberCodeService,
    LabTestCategoriesService,
    MyCookieService,
    AdminSettingsService,
    GraphqlService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
