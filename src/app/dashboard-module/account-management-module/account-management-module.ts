import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {UpdateUserAccountComponent} from './update-user-account/update-user-account.component';
import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {EditPhoneNumberDialogueModule} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue.module';
import {MatButtonModule} from '@angular/material/button';
import {Ng9PasswordStrengthBarModule} from 'ng9-password-strength-bar';


const app = [
  { path: 'patient-details', component: UpdateUserAccountComponent },
  { path: 'account-settings', component: AccountSettingsComponent },
  { path: 'chang-password', component: ChangePasswordComponent},
];

@NgModule({
  declarations: [
    UpdateUserAccountComponent,
  AccountSettingsComponent,
    ChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(app),
    MatCardModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    Ng9PasswordStrengthBarModule,
    MatProgressSpinnerModule,
    EditPhoneNumberDialogueModule,
    MatButtonModule
  ], exports: [
    UpdateUserAccountComponent
  ]
})
export class AccountManagementModule { }
