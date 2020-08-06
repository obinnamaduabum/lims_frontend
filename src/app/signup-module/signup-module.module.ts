import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import {EditPhoneNumberDialogueModule} from '../edit-phone-number-dialogue/edit-phone-number-dialogue.module';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {Ng9PasswordStrengthBarModule} from 'ng9-password-strength-bar';

import { RegistrationSuccessfulComponent } from './registration-successful/registration-successful.component';
import {LottieAnimationViewModule} from 'ng-lottie';
// tslint:disable-next-line:max-line-length
import { RegistrationSuccessfulWithStepsComponent } from './registration-successful-with-steps/registration-successful-with-steps.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {CountdownModule} from 'ngx-countdown';
import {MatCheckboxModule} from '@angular/material/checkbox';


const app = [
  { path: '', component: SignupComponent }
];

@NgModule({
  declarations: [
    PatientRegistrationComponent,
    SignupComponent,
    RegistrationSuccessfulComponent,
    RegistrationSuccessfulWithStepsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EditPhoneNumberDialogueModule,
    MatOptionModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    Ng9PasswordStrengthBarModule,
    MatStepperModule,
    LottieAnimationViewModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CountdownModule,
    MatCheckboxModule
  ], providers: [MatDatepickerModule],
  entryComponents: [
    RegistrationSuccessfulComponent,
    RegistrationSuccessfulWithStepsComponent]
})
export class SignUpModule { }
