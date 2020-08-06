import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditPhoneNumberDialogueModule} from '../../edit-phone-number-dialogue/edit-phone-number-dialogue.module';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {AlreadyLoggedInGuard} from '../../guards/already-logged-in.guard';

const routes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [AlreadyLoggedInGuard] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EditPhoneNumberDialogueModule
  ]
})
export class LoginModule { }
