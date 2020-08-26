import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-module/login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import {RouterModule, Routes} from '@angular/router';
import {HeaderModule} from '../header-module/header-module.module';
import {FooterModule} from '../footer-module/footer-module.module';
import { LandPageBodyComponent } from './land-page-body/land-page-body.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {ForgotPasswordPageComponent} from './forgot-password-page/forgot-password-page.component';
import {A11yModule} from '@angular/cdk/a11y';

const routes: Routes = [

  { path: '', component: LandPageBodyComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'forgot-password', component: ForgotPasswordPageComponent },
      { path: 'login',
        loadChildren: () => import('src/app/landing-page/login-module/login-module.module').then(m => m.LoginModule ),
      },
      { path: 'registration',
        loadChildren: () => import('src/app/signup-module/signup-module.module').then(m => m.SignUpModule ),
      }
    ]
  }
];


@NgModule({
  declarations: [
    LandingPageComponent,
    LoginPageComponent,
    SignupPageComponent,
    LandPageBodyComponent,
    ForgotPasswordPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderModule,
    FooterModule,
    MatSidenavModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatIconModule,
    A11yModule
  ]
})
// @ts-ignore
export class LandingPageModule { }
